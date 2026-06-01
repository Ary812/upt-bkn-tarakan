"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { supabase } from "@/lib/supabase";
import { getAdminGalleries, createGallery, updateGallery, deleteGallery, uploadImageAction } from "@/lib/actions";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, X, UploadCloud, Image as ImageIcon } from "lucide-react";

export default function ManajemenGaleriPage() {
  const pageRef = useRef(null);
  const [galleries, setGalleries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    caption: "",
    imageFile: null,
    imagePreview: null,
    existingImageUrl: ""
  });

  // Fetch Data
  const fetchGalleries = async () => {
    try {
      const data = await getAdminGalleries();
      setGalleries(data || []);
    } catch (error) {
      toast.error("Gagal mengambil data galeri");
    }
  };

  useEffect(() => {
    fetchGalleries();

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

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        caption: item.caption,
        imageFile: null,
        imagePreview: null,
        existingImageUrl: item.image_url
      });
    } else {
      setEditingId(null);
      setFormData({
        caption: "",
        imageFile: null,
        imagePreview: null,
        existingImageUrl: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingId && !formData.imageFile) {
      toast.error("Gambar wajib diunggah untuk galeri baru!");
      return;
    }

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
        const compressedBlob = await imageCompression(formData.imageFile, options);
        // Reconstruct File to preserve .type on Vercel
        const mimeType = compressedBlob.type || formData.imageFile.type || "image/jpeg";
        const ext = mimeType.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
        const safeFile = new File([compressedBlob], `upload_${Date.now()}.${ext}`, { type: mimeType });
        
        const uploadData = new FormData();
        uploadData.append("file", safeFile);
        finalImageUrl = await uploadImageAction(uploadData);
      }

      const actionData = new FormData();
      actionData.append("caption", formData.caption);
      if (finalImageUrl) actionData.append("image_url", finalImageUrl);

      if (editingId) {
        await updateGallery(editingId, actionData);
        toast.success("Galeri berhasil diperbarui!");
      } else {
        await createGallery(actionData);
        toast.success("Galeri berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      fetchGalleries();
    } catch (error) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus foto galeri ini?")) {
      try {
        await deleteGallery(id);
        toast.success("Foto galeri berhasil dihapus!");
        fetchGalleries();
      } catch (error) {
        toast.error("Gagal menghapus galeri");
      }
    }
  };

  return (
    <div ref={pageRef} className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 admin-anim">
        <div>
          <h1 className="text-2xl font-black text-ink">Manajemen Galeri</h1>
          <p className="text-sm text-mute mt-1">Kelola dokumentasi foto kegiatan UPT BKN Tarakan.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-magnetic bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Foto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 admin-anim">
        {galleries.length === 0 ? (
          <div className="col-span-full py-12 text-center text-mute text-sm bg-canvas rounded-[2rem] border border-gray-100">
            Belum ada foto di galeri.
          </div>
        ) : (
          galleries.map(item => (
            <div key={item.id} className="bg-canvas rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                <img 
                  src={item.image_url} 
                  alt={item.caption} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(item)} className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500/80 hover:bg-red-500 backdrop-blur-md rounded-full text-white transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-ink line-clamp-2" title={item.caption}>{item.caption}</p>
                <p className="text-xs text-mute mt-1">
                  {new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-canvas rounded-[2.5rem] w-full max-w-lg relative z-10 shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-ink">{editingId ? 'Edit Foto Galeri' : 'Tambah Foto Galeri'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-mute hover:bg-surface-soft rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-ink-soft mb-2">Keterangan Gambar (Caption)</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.caption}
                  onChange={e => setFormData({...formData, caption: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm resize-none"
                  placeholder="Masukkan keterangan gambar..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-soft mb-2">Foto / Gambar</label>
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
                      <p className="text-sm font-medium">Upload foto galeri</p>
                      <p className="text-xs mt-1">Otomatis dikompresi ({'<'} 300KB)</p>
                    </div>
                  )}
                </div>
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
                  {isSubmitting ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Unggah Foto')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
