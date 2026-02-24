import { db } from "@/lib/db";
import { createChapter } from "@/lib/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, BookOpen, AlertTriangle } from "lucide-react";
import SubmitButton from "@/components/SubmitButton";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-gray-50 animate-pulse rounded-xl flex items-center justify-center text-gray-400 font-bold border border-gray-200">Menyiapkan Editor Teks...</div>
});

export default async function NewChapterPage({ params }: { params: { id: string } }) {
  const novel = await db.novel.findUnique({
    where: { id: params.id },
    include: { chapters: { orderBy: { orderIndex: 'desc' }, take: 1 } }
  });

  if (!novel) return notFound();
  const nextOrderIndex = novel.chapters.length > 0 ? novel.chapters[0].orderIndex + 1 : 1;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3"><BookOpen className="text-blue-600"/> Tambah Bab Baru</h1>
        <Link href={`/admin/novels/${params.id}`} className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl font-bold shadow-sm transition">
          <ArrowLeft size={18} /> Kembali ke Novel
        </Link>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-200 shadow-sm">
        <form action={createChapter.bind(null, novel.id, novel.slug)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Judul Bab</label>
              <input type="text" name="title" required placeholder="Contoh: Bab 4 - Awal Mula" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Urutan Bab (Angka)</label>
              <input type="number" name="orderIndex" defaultValue={nextOrderIndex} required min="1" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Slug URL</label>
            <input type="text" name="slug" required placeholder={`contoh: bab-${nextOrderIndex}-awal-mula`} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-mono text-sm" />
          </div>

          <div className="pt-4">
            <div className="flex items-center justify-between mb-2">
               <label className="block text-sm font-bold text-gray-700">Isi Cerita</label>
               <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-md font-bold flex items-center gap-1"><AlertTriangle size={12}/> Tips: Tekan Ctrl+Shift+V saat Paste</span>
            </div>
            <RichTextEditor name="content" defaultValue="" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 mt-6">
             <label className="flex items-start gap-4 p-5 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition shadow-sm">
                <input type="checkbox" name="isPublished" defaultChecked={true} className="w-6 h-6 mt-1 accent-blue-600 cursor-pointer" />
                <div>
                   <span className="font-black text-gray-900 block text-lg">Publikasikan Bab</span>
                   <span className="text-sm text-gray-500 leading-relaxed mt-1 block">Tampilkan bab ini ke pembaca publik.</span>
                </div>
             </label>
             <label className="flex items-start gap-4 p-5 border border-amber-200 bg-amber-50/50 rounded-2xl cursor-pointer hover:bg-amber-50 transition shadow-sm">
                <input type="checkbox" name="isLocked" defaultChecked={false} className="w-6 h-6 mt-1 accent-amber-600 cursor-pointer" />
                <div>
                   <span className="font-black text-amber-900 block text-lg">Kunci Bab (Premium)</span>
                   <span className="text-sm text-amber-700 leading-relaxed mt-1 block">Pembaca butuh Kode Akses untuk membukanya.</span>
                </div>
             </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 mt-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Link Donasi (Saweria/Trakteer)</label>
              <input type="url" name="payLink" placeholder="https://saweria.co/..." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kode Akses / Password</label>
              <input type="text" name="unlockCode" placeholder="Contoh: PAKET5K" className="w-full p-4 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-600 outline-none font-black text-amber-900 tracking-widest" />
            </div>
          </div>

          <SubmitButton isEdit={false} />
        </form>
      </div>
    </div>
  );
}
