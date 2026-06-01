"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { getAdminPosts, createPost, updatePost } from "@/lib/actions";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import { Save } from "lucide-react";

export default function SingleContentEditor({ title, category, description }) {
  const pageRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postId, setPostId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: title,
    content: "",
    status: "publish"
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminPosts(category);
      if (data && data.length > 0) {
        const post = data[0];
        setPostId(post.id);
        setFormData({
          title: post.title || title,
          content: post.content || "",
          status: post.status || "publish"
        });
      }
    } catch (error) {
      toast.error("Gagal mengambil data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    let ctx = gsap.context(() => {
      gsap.from(".admin-anim", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, pageRef);
    return () => ctx.revert();
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const actionData = new FormData();
      actionData.append("title", formData.title);
      actionData.append("content", formData.content);
      actionData.append("category", category);
      actionData.append("status", formData.status);

      if (postId) {
        await updatePost(postId, actionData);
        toast.success(`${title} berhasil diperbarui!`);
      } else {
        const newPost = await createPost(actionData);
        if (newPost && newPost.length > 0) {
          setPostId(newPost[0].id);
        }
        toast.success(`${title} berhasil disimpan!`);
      }
    } catch (error) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={pageRef} className="space-y-6 max-w-4xl mx-auto">
      <div className="admin-anim">
        <h1 className="text-2xl font-black text-ink">{title}</h1>
        <p className="text-sm text-mute mt-1">{description}</p>
      </div>

      <div className="bg-canvas rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden admin-anim relative">
        {isLoading && (
          <div className="absolute inset-0 bg-canvas/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="text-sm font-bold text-primary animate-pulse">Memuat data...</div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-ink-soft mb-2">Konten</label>
            <RichTextEditor 
              value={formData.content}
              onChange={(val) => setFormData({...formData, content: val})}
              placeholder={`Ketik konten ${title.toLowerCase()} di sini...`}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-100 gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-sm font-semibold text-ink-soft whitespace-nowrap">Status Publikasi:</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm bg-surface-soft font-medium text-ink"
              >
                <option value="draft">Draft</option>
                <option value="publish">Publish</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto btn-magnetic bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
