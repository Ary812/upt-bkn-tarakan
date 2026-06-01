"use server";

import { getSupabaseAdmin } from "./supabase";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";

// ==========================================
// SECURITY & AUTH CHECK HELPER
// ==========================================
async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Sesi Anda telah berakhir, silakan login kembali.");
  }

  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized: Pengguna tidak valid.");
  }

  const email = user.emailAddresses[0]?.emailAddress;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail || email !== adminEmail) {
    throw new Error("Unauthorized: Anda tidak memiliki akses admin.");
  }
}

// ==========================================
// HTML SANITIZATION HELPER
// ==========================================
function sanitizeRichText(html) {
  if (!html) return "";
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "h1", "h2", "h3", "h4", "h5", "h6", "img", "iframe", "u", "s", "span", "hr"
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["style", "class", "id"],
      "a": ["href", "name", "target", "rel"],
      "img": ["src", "alt", "width", "height", "loading"],
      "iframe": ["src", "width", "height", "frameborder", "allowfullscreen"]
    },
    allowedSchemes: ["http", "https", "mailto", "tel", "data"],
    allowedIframeHostnames: ["www.youtube.com", "youtube.com", "player.vimeo.com"]
  });
}

// ==========================================
// INPUT VALIDATION SCHEMAS
// ==========================================
const postSchema = z.object({
  title: z.string({ required_error: "Judul wajib diisi" })
    .min(3, "Judul minimal 3 karakter")
    .max(200, "Judul maksimal 200 karakter"),
  content: z.string({ required_error: "Konten wajib diisi" })
    .min(10, "Konten minimal 10 karakter"),
  category: z.enum(["berita", "pengumuman", "profil", "layanan"], { 
    errorMap: () => ({ message: "Kategori tidak valid" }) 
  }),
  status: z.enum(["draft", "publish"], { 
    errorMap: () => ({ message: "Status tidak valid" }) 
  }),
  image_url: z.string().url("Format URL gambar tidak valid").nullable().optional()
});

const gallerySchema = z.object({
  caption: z.string({ required_error: "Keterangan wajib diisi" })
    .min(3, "Keterangan minimal 3 karakter")
    .max(500, "Keterangan maksimal 500 karakter"),
  image_url: z.string({ required_error: "Gambar wajib diunggah" })
    .url("Format URL gambar tidak valid")
});

// ==========================================
// STORAGE UPLOAD (Secure)
// ==========================================
export async function uploadImageAction(formData) {
  // Ensure only authenticated admin can upload files
  await requireAdmin();

  const file = formData.get("file");
  if (!file) throw new Error("Berkas gambar tidak ditemukan");

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Tipe berkas tidak didukung. Harap unggah gambar (JPEG, PNG, GIF, WEBP).");
  }

  // Validate file size (max 2MB limit)
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("Ukuran file terlalu besar. Maksimal ukuran file adalah 2MB.");
  }

  const fileExt = file.name.split('.').pop();
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
    throw new Error(error.message);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('public-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

// ==========================================
// POSTS (Berita, Pengumuman & Profil Pages)
// ==========================================

export async function getAdminPosts(category) {
  await requireAdmin();

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });
  
  if (error) throw new Error(error.message);
  return data;
}

export async function createPost(formData) {
  await requireAdmin();

  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
    category: formData.get("category"),
    status: formData.get("status"),
    image_url: formData.get("image_url") || null
  };

  // Perform backend schema validation using Zod
  const result = postSchema.safeParse(rawData);
  if (!result.success) {
    const errorMessages = result.error.errors.map(err => err.message).join(", ");
    throw new Error(`Validasi Gagal: ${errorMessages}`);
  }

  const validatedData = result.data;

  // Sanitize potentially unsafe HTML from the rich text editor before writing to the database
  const sanitizedContent = sanitizeRichText(validatedData.content);

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .insert([{
      title: validatedData.title,
      content: sanitizedContent,
      category: validatedData.category,
      status: validatedData.status,
      image_url: validatedData.image_url || null
    }])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath(`/publikasi/${validatedData.category}`);
  revalidatePath("/admin");
  return data;
}

export async function updatePost(id, formData) {
  await requireAdmin();

  if (!id) throw new Error("ID post tidak valid.");

  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
    category: formData.get("category"),
    status: formData.get("status"),
    image_url: formData.get("image_url") || null
  };

  // Perform backend schema validation using Zod
  const result = postSchema.safeParse(rawData);
  if (!result.success) {
    const errorMessages = result.error.errors.map(err => err.message).join(", ");
    throw new Error(`Validasi Gagal: ${errorMessages}`);
  }

  const validatedData = result.data;

  // Sanitize rich text input
  const sanitizedContent = sanitizeRichText(validatedData.content);

  const updateData = {
    title: validatedData.title,
    content: sanitizedContent,
    category: validatedData.category,
    status: validatedData.status,
  };
  
  if (validatedData.image_url !== undefined) {
    updateData.image_url = validatedData.image_url;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath(`/publikasi/${validatedData.category}`);
  revalidatePath("/admin");
  return data;
}

export async function deletePost(id) {
  await requireAdmin();

  if (!id) throw new Error("ID post tidak valid.");

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

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
  
  if (error) throw new Error(error.message);
  return data;
}

export async function createGallery(formData) {
  await requireAdmin();

  const rawData = {
    caption: formData.get("caption"),
    image_url: formData.get("image_url")
  };

  const result = gallerySchema.safeParse(rawData);
  if (!result.success) {
    const errorMessages = result.error.errors.map(err => err.message).join(", ");
    throw new Error(`Validasi Gagal: ${errorMessages}`);
  }

  const validatedData = result.data;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("galleries")
    .insert([{
      caption: validatedData.caption,
      image_url: validatedData.image_url
    }])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/publikasi/galeri");
  revalidatePath("/admin");
  return data;
}

export async function updateGallery(id, formData) {
  await requireAdmin();

  if (!id) throw new Error("ID galeri tidak valid.");

  const rawData = {
    caption: formData.get("caption"),
    image_url: formData.get("image_url")
  };

  const result = gallerySchema.safeParse(rawData);
  if (!result.success) {
    const errorMessages = result.error.errors.map(err => err.message).join(", ");
    throw new Error(`Validasi Gagal: ${errorMessages}`);
  }

  const validatedData = result.data;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("galleries")
    .update({
      caption: validatedData.caption,
      image_url: validatedData.image_url
    })
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/publikasi/galeri");
  revalidatePath("/admin");
  return data;
}

export async function deleteGallery(id) {
  await requireAdmin();

  if (!id) throw new Error("ID galeri tidak valid.");

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("galleries").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/publikasi/galeri");
  revalidatePath("/admin");
  return true;
}
