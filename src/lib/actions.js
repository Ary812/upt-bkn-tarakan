"use server";

import { getSupabaseAdmin } from "./supabase";
import { revalidatePath } from "next/cache";

// ==========================================
// STORAGE UPLOAD (Secure Server Action)
// ==========================================
export async function uploadImageAction(formData) {
  const file = formData.get("file");
  if (!file) throw new Error("File not found");

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
// POSTS (Berita & Pengumuman)
// ==========================================

export async function getAdminPosts(category) {
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
  const title = formData.get("title");
  const content = formData.get("content");
  const category = formData.get("category"); // 'berita' atau 'pengumuman'
  const imageUrl = formData.get("image_url");
  const status = formData.get("status"); // 'draft' atau 'publish'

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .insert([{ title, content, category, image_url: imageUrl, status }])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath(`/publikasi/${category}`);
  revalidatePath("/admin");
  return data;
}

export async function updatePost(id, formData) {
  const title = formData.get("title");
  const content = formData.get("content");
  const category = formData.get("category");
  const imageUrl = formData.get("image_url");
  const status = formData.get("status");

  const updateData = { title, content, category, status };
  if (imageUrl) updateData.image_url = imageUrl;

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
  revalidatePath(`/publikasi/${category}`);
  revalidatePath("/admin");
  return data;
}

export async function deletePost(id) {
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
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("galleries")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) throw new Error(error.message);
  return data;
}

export async function createGallery(formData) {
  const caption = formData.get("caption");
  const imageUrl = formData.get("image_url");

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("galleries")
    .insert([{ caption, image_url: imageUrl }])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/publikasi/galeri");
  revalidatePath("/admin");
  return data;
}

export async function updateGallery(id, formData) {
  const caption = formData.get("caption");
  const imageUrl = formData.get("image_url");

  const updateData = { caption };
  if (imageUrl) updateData.image_url = imageUrl;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("galleries")
    .update(updateData)
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
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("galleries").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/publikasi/galeri");
  revalidatePath("/admin");
  return true;
}
