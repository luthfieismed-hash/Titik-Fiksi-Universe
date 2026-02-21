"use client";

import { Trash } from "lucide-react";

export default function DeleteButton({ warningText = "Yakin ingin menghapus data ini?" }: { warningText?: string }) {
  return (
    <button 
      type="submit" 
      className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition" 
      title="Hapus"
      onClick={(e) => { 
        if(!confirm(warningText)) e.preventDefault(); 
      }}
    >
      <Trash size={18} />
    </button>
  );
}