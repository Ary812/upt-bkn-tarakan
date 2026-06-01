"use server";

import { getSupabaseAdmin } from "./supabase";
import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

// ==========================================
// AUTHENTICATION & VALIDATION
// ==========================================

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Please log in");
  }
  
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (adminEmail && email !== adminEmail) {
    throw new Error("Unauthorized: Admin access required");
  }
}

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(300, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  category: z.enum([
    "berita", "pengumuman", "sejarah", 
    "tugas-fungsi", "struktur-organisasi", "maklumat", "layanan"
  ], {
    errorMap: () => ({ message: "Invalid category" })
  }),
  status: z.enum(["draft", "publish"]),
  image_url: z.string().url().optional().or(z.literal("")).or(z.null()),
});

const gallerySchema = z.object({
  caption: z.string().min(1, "Caption is required").max(500, "Caption is too long"),
  image_url: z.string().url().optional().or(z.literal("")).or(z.null()),
});

// Helper to safely format Supabase errors
function handleDbError(error) {
  console.error("Database Error:", error);
  throw new Error("Terjadi kesalahan pada database. Silakan coba lagi.");
}

// ==========================================
// STORAGE UPLOAD (Secure Server Action)
// ==========================================
export async function uploadImageAction(formData) {
  await requireAdmin();

  const file = formData.get("file");
  if (!file || typeof file !== "object" || !('name' in file)) {
    throw new Error("File not found or invalid");
  }

  // Basic validation for image upload
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase();
  if (!['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(fileExt)) {
     throw new Error("Invalid image format");
  }

  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from('public-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    handleDbError(error);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('public-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

// ==========================================
// POSTS (Berita, Pengumuman, Profil, Layanan)
// ==========================================

export async function getAdminPosts(category) {
  await requireAdmin();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });
  
  if (error) handleDbError(error);
  return data;
}

export async function createPost(formData) {
  await requireAdmin();

  // Validate inputs
  const parsedData = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    category: formData.get("category"),
    status: formData.get("status"),
    image_url: formData.get("image_url")
  });

  if (!parsedData.success) {
    throw new Error(parsedData.error.errors[0].message);
  }

  const { title, content, category, status, image_url } = parsedData.data;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .insert([{ title, content, category, image_url, status }])
    .select();

  if (error) handleDbError(error);

  revalidatePath("/");
  revalidatePath(`/publikasi/${category}`);
  revalidatePath("/admin");
  return data;
}

export async function updatePost(id, formData) {
  await requireAdmin();

  const parsedData = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    category: formData.get("category"),
    status: formData.get("status"),
    image_url: formData.get("image_url")
  });

  if (!parsedData.success) {
    throw new Error(parsedData.error.errors[0].message);
  }

  const { title, content, category, status, image_url } = parsedData.data;

  const updateData = { title, content, category, status };
  if (image_url !== undefined && image_url !== null) {
    updateData.image_url = image_url;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) handleDbError(error);

  revalidatePath("/");
  revalidatePath(`/publikasi/${category}`);
  revalidatePath("/admin");
  return data;
}

export async function deletePost(id) {
  await requireAdmin();
  
  // Basic validation that ID is a UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new Error("Invalid post ID");
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) handleDbError(error);

  revalidatePath("/");
  revalidatePath("/publikasi/berita");
  revalidatePath("/publikasi/pengumuman");
  revalidatePath("/admin");
  return true;
}

// ==========================================
// GALLERIES
// ==========================================

export async function getAdminGalleries() {
  await requireAdmin();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("galleries")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) handleDbError(error);
  return data;
}

export async function createGallery(formData) {
  await requireAdmin();

  const parsedData = gallerySchema.safeParse({
    caption: formData.get("caption"),
    image_url: formData.get("image_url")
  });

  if (!parsedData.success) {
    throw new Error(parsedData.error.errors[0].message);
  }

  const { caption, image_url } = parsedData.data;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("galleries")
    .insert([{ caption, image_url }])
    .select();

  if (error) handleDbError(error);

  revalidatePath("/publikasi/galeri");
  revalidatePath("/admin");
  return data;
}

export async function updateGallery(id, formData) {
  await requireAdmin();

  const parsedData = gallerySchema.safeParse({
    caption: formData.get("caption"),
    image_url: formData.get("image_url")
  });

  if (!parsedData.success) {
    throw new Error(parsedData.error.errors[0].message);
  }

  const { caption, image_url } = parsedData.data;

  const updateData = { caption };
  if (image_url !== undefined && image_url !== null) {
    updateData.image_url = image_url;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("galleries")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) handleDbError(error);

  revalidatePath("/publikasi/galeri");
  revalidatePath("/admin");
  return data;
}

export async function deleteGallery(id) {
  await requireAdmin();

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new Error("Invalid gallery ID");
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("galleries").delete().eq("id", id);

  if (error) handleDbError(error);

  revalidatePath("/publikasi/galeri");
  revalidatePath("/admin");
  return true;
}
