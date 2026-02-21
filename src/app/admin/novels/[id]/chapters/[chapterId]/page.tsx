import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic"; // Penambahan jeli untuk performa
import { ArrowLeft, Save, Layout, FileText, Lock } from "lucide-react";
import { updateChapter } from "@/lib/actions";

// Memuat Rich Text Editor secara dinamis agar halaman tidak berat/lemot
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { 
  ssr: false,
  loading: () => <div className="h-96 w-full bg-gray-100 animate-pulse rounded-3xl flex items-center justify-center text-gray-400 font-bold">Memuat Editor Profesional...</div>
});

export default async function EditChapterPage({ params }: { params: { id: string, chapterId: string } }) {
  // Parallel Fetching: Memuat data novel dan bab sekaligus
  const [novel, chapter] = await Promise.all([
    db.novel.findUnique({ where: { id: params.id }, select: { title: true, slug: true, id: true } }),
    db.chapter.findUnique({ where: { id: params.chapterId } })
  ]);

  if (!novel || !chapter) return notFound();

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-fade-in-up">
      {/* HEADER NAVIGASI */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <FileText className="text-blue-600" /> Edit <span className="text-blue-600">Bab Profesional</span>
          </h1>
          <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">{novel.title}</p>
        </div>
        <Link href={`/admin/novels/${novel.id}`} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition">
          <ArrowLeft size={18} /> Kembali ke Novel
        </Link>
      </div>

      <form action={updateChapter.bind(null, chapter.id, novel.id, novel.slug)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* AREA EDITOR PROFESIONAL */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <span className="font-black text-xs text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Layout size={16}/> Konten Cerita (Rich Text Mode)
              </span>
              <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                <Save size={18} /> Simpan Bab
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Judul Bab</label>
                <input type="text" name="title" defaultValue={chapter.title} required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
              </div>
              
              {/* FITUR DIKEMBALIKAN: Editor dengan dukungan formatting penuh */}
              <div className="space-y-2 min-h-[500px]">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Konten Novel</label>
                <RichTextEditor 
                  name="content" 
                  defaultValue={chapter.content} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR PENGATURAN */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-widest border-b pb-4">
              <Lock size={16} className="text-amber-500"/> Akses & Keamanan
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-xs font-black text-gray-800">Publikasikan</span>
                <input type="checkbox" name="isPublished" defaultChecked={chapter.isPublished} className="w-6 h-6 rounded-lg text-blue-600" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-xs font-black text-gray-800">Kunci Bab</span>
                <input type="checkbox" name="isLocked" defaultChecked={chapter.isLocked} className="w-6 h-6 rounded-lg text-amber-500" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase">Urutan Bab (No.)</label>
                <input type="number" name="orderIndex" defaultValue={chapter.orderIndex} className="w-full p-3 bg-gray-50 border rounded-xl font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase">Kode Akses</label>
                <input type="text" name="unlockCode" defaultValue={chapter.unlockCode || ""} className="w-full p-3 bg-gray-50 border rounded-xl font-mono text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase">Link Pembayaran</label>
                <input type="url" name="payLink" defaultValue={chapter.payLink || ""} className="w-full p-3 bg-gray-50 border rounded-xl text-xs" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}