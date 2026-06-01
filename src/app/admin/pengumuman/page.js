"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { supabase } from "@/lib/supabase";
import { getAdminPosts, createPost, updatePost, deletePost, uploadImageAction } from "@/lib/actions";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, X, UploadCloud, FileImage, Eye } from "lucide-react";
import Link from "next/link";
import RichTextEditor from "@/components/RichTextEditor";

export default function ManajemenPengumumanPage() {
  const pageRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft",
    imageFile: null,
    imagePreview: null,
    existingImageUrl: ""
  });

  // Fetch Data
  const fetchPosts = async () => {
    try {
      const data = await getAdminPosts('pengumuman');
      setPosts(data || []);
    } catch (error) {
      toast.error("Gagal mengambil data pengumuman");
    }
  };

  useEffect(() => {
    fetchPosts();

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
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleOpenModal = (post = null) => {
    if (post) {
      setEditingId(post.id);
      setFormData({
        title: post.title,
        content: post.content,
        status: post.status,
        imageFile: null,
        imagePreview: null,
        existingImageUrl: post.image_url
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        content: "",
        status: "draft",
        imageFile: null,
        imagePreview: null,
        existingImageUrl: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let finalImageUrl = formData.existingImageUrl;

      if (formData.imageFile) {
        // Compress image
        const options = {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 1200,
          useWebWorker: true
        };
        const compressedFile = await imageCompression(formData.imageFile, options);
        
        const uploadData = new FormData();
        uploadData.append("file", compressedFile);
        finalImageUrl = await uploadImageAction(uploadData);
      }

      const actionData = new FormData();
      actionData.append("title", formData.title);
      actionData.append("content", formData.content);
      actionData.append("category", "pengumuman");
      actionData.append("status", formData.status);
      if (finalImageUrl) actionData.append("image_url", finalImageUrl);

      if (editingId) {
        await updatePost(editingId, actionData);
        toast.success("Pengumuman berhasil diperbarui!");
      } else {
        await createPost(actionData);
        toast.success("Pengumuman berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      fetchPosts();
    } catch (error) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) {
      try {
        await deletePost(id);
        toast.success("Pengumuman berhasil dihapus!");
        fetchPosts();
      } catch (error) {
        toast.error("Gagal menghapus pengumuman");
      }
    }
  };

  return (
    <div ref={pageRef} className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 admin-anim">
        <div>
          <h1 className="text-2xl font-black text-ink">Manajemen Pengumuman</h1>
          <p className="text-sm text-mute mt-1">Kelola informasi pengumuman penting UPT BKN Tarakan.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-magnetic bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Pengumuman
        </button>
      </div>

      <div className="bg-canvas rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden admin-anim">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-soft text-ink-soft text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Gambar</th>
                <th className="px-6 py-4">Judul</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-mute text-sm">Belum ada pengumuman.</td>
                </tr>
              ) : (
                posts.map(post => (
                  <tr key={post.id} className="hover:bg-surface-soft/50 transition-colors">
                    <td className="px-6 py-4">
                      {post.image_url ? (
                        <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                          <FileImage className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-ink line-clamp-2">{post.title}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-mute">
                      {new Date(post.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${post.status === 'publish' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/publikasi/pengumuman/${post.id}`} 
                          target="_blank"
                          className="p-2 text-mute hover:text-blue-600 bg-surface-soft hover:bg-blue-50 rounded-xl transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleOpenModal(post)} className="p-2 text-mute hover:text-primary bg-surface-soft hover:bg-primary/10 rounded-xl transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="p-2 text-mute hover:text-accent bg-surface-soft hover:bg-accent/10 rounded-xl transition-colors" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-canvas rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-ink">{editingId ? 'Edit Pengumuman' : 'Tambah Pengumuman'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-mute hover:bg-surface-soft rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-ink-soft mb-2">Judul Pengumuman</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                  placeholder="Masukkan judul pengumuman..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-soft mb-2">Konten Pengumuman</label>
                <RichTextEditor 
                  value={formData.content}
                  onChange={(val) => setFormData({...formData, content: val})}
                  placeholder="Ketik konten pengumuman di sini..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-soft mb-2">Thumbnail Gambar</label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-surface-soft transition-colors relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {(formData.imagePreview || formData.existingImageUrl) ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={formData.imagePreview || formData.existingImageUrl} 
                        alt="Preview" 
                        className="h-32 object-contain rounded-lg mb-3"
                      />
                      <p className="text-xs text-primary font-medium">Klik untuk mengubah gambar</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-mute">
                      <UploadCloud className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm font-medium">Upload gambar thumbnail</p>
                      <p className="text-xs mt-1">Otomatis dikompresi ({'<'} 300KB)</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-soft mb-2">Status Publikasi</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm bg-white"
                >
                  <option value="draft">Draft (Simpan saja)</option>
                  <option value="publish">Publish (Tampilkan ke Publik)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-full text-sm font-bold text-mute bg-surface-soft hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-full text-sm font-bold text-white bg-primary hover:bg-primary-pressed transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Terbitkan Pengumuman')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
