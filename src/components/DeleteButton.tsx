"use client";

import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";

export default function DeleteButton({ message = "Yakin ingin menghapus data ini secara permanen?" }: { message?: string }) {
  // useFormStatus mendeteksi apakah fungsi Server Action sedang berjalan (loading)
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center ${pending ? 'opacity-50 cursor-wait' : ''}`}
      onClick={(e) => {
        // Mencegah form terkirim jika admin menekan "Cancel" pada pop-up
        if (!window.confirm(message)) {
          e.preventDefault();
        }
      }}
      title="Hapus Data"
    >
      <Trash2 size={18} className={pending ? 'animate-pulse text-red-400' : ''} />
    </button>
  );
}
