"use client";
import { useFormStatus } from "react-dom";
import { Save, Plus, Loader2 } from "lucide-react";

export default function SubmitButton({ isEdit = false }: { isEdit?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`w-full flex items-center justify-center gap-2 text-white font-bold py-4 rounded-xl transition-all shadow-lg mt-8 ${
        pending ? 'bg-gray-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {pending ? (
        <><Loader2 className="animate-spin" size={20} /> Memproses Teks & Menyimpan...</>
      ) : isEdit ? (
        <><Save size={20} /> Simpan Perubahan Bab</>
      ) : (
        <><Plus size={20} /> Simpan & Terbitkan Bab</>
      )}
    </button>
  );
}
