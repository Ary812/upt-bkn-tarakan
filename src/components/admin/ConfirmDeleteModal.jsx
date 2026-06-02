"use client";

import { AlertTriangle } from "lucide-react";

export default function ConfirmDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Konfirmasi Hapus", 
  message = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.", 
  isLoading = false 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={!isLoading ? onClose : undefined}></div>
      <div className="bg-canvas rounded-[2rem] w-full max-w-md relative z-10 shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-ink text-center mb-2">{title}</h2>
        <p className="text-mute text-center text-sm mb-8">{message}</p>
        
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 rounded-full text-sm font-bold text-mute bg-surface-soft hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button 
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-full text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}
