import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plus, Edit, BookOpen, Link as LinkIcon, Save, Image as ImageIcon, Hash, Layout, Lock } from "lucide-react";
import { deleteChapter, addExternalLink, deleteExternalLink, updateNovel } from "@/lib/actions";
// IMPORT KOMPONEN DELETE BUTTON BARU
import DeleteButton from "@/components/DeleteButton";

export default async function ManageNovelPage({ params }: { params: { id: string } }) {
  const novel = await db.novel.findUnique({
    where: { id: params.id },
    include: {
      chapters: { orderBy: { orderIndex: 'desc' } },
      externalLinks: true
    }
  });

  if (!novel) return notFound();

  const PREDEFINED_GENRES = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Isekai", "Mystery", "Romance", "Sci-Fi", "System", "Urban Fantasy"];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-fade-in-up">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <BookOpen className="text-blue-600" size={32}/> Kelola <span className="text-blue-600">Novel</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">ID: {novel.id}</p>
        </div>
        <Link href="/admin" className="inline-flex items-center gap-2 bg-white border border-gray-200 px-5 py-2.5 rounded-xl text-gray-600 hover:text-gray-900 font-bold transition shadow-sm">
          <ArrowLeft size={18} /> Kembali
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* EDIT DATA NOVEL */}
        <div className="lg:col-span-8 space-y-8">
          <form action={updateNovel.bind(null, novel.id)} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h2 className="font-bold text-gray-800 flex items-center gap-2"><Edit size={18}/> Informasi Novel</h2>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition">
                <Save size={16}/> Simpan
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Judul</label>
                  <input type="text" name="title" defaultValue={novel.title} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Slug</label>
                  <input type="text" name="slug" defaultValue={novel.slug} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Status</label>
                  <select name="status" defaultValue={novel.status} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-bold">
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Hiatus">Hiatus</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">YouTube ID</label>
                  <input type="text" name="youtubeTrailer" defaultValue={novel.youtubeTrailer || ""} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Genre</label>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_GENRES.map((g) => (
                    <label key={g} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl cursor-pointer">
                      <input type="checkbox" name="genre" value={g} defaultChecked={novel.genre.includes(g)} className="w-4 h-4 rounded text-blue-600" />
                      <span className="text-xs font-bold">{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Sinopsis</label>
                <textarea name="synopsis" defaultValue={novel.synopsis} rows={5} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-medium"></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">URL Sampul</label>
                <input type="text" name="coverImage" defaultValue={novel.coverImage || ""} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
            </div>
          </form>

          {/* DAFTAR BAB */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="font-bold text-gray-800 flex items-center gap-2"><Hash size={18}/> Daftar Bab ({novel.chapters.length})</h2>
              <Link href={`/admin/novels/${novel.id}/chapters/new`} className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-green-700 transition">
                <Plus size={14}/> Tambah Bab
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {novel.chapters.map((chapter) => (
                <div key={chapter.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition group">
                  <div className="flex items-center gap-4">
                    <span className="font-black text-gray-200 text-lg w-6 text-right">{chapter.orderIndex}</span>
                    <div>
                      <span className="font-bold text-gray-900 block truncate max-w-[200px] sm:max-w-xs">{chapter.title}</span>
                      <div className="flex items-center gap-2 mt-1 text-[10px] font-bold uppercase tracking-widest">
                         <span className={chapter.isPublished ? 'text-green-500' : 'text-gray-400'}>{chapter.isPublished ? 'Published' : 'Draft'}</span>
                         {chapter.isLocked && <span className="text-amber-500 flex items-center gap-1"><Lock size={10}/> Locked</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/admin/novels/${novel.id}/chapters/${chapter.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18}/></Link>
                    <form action={deleteChapter.bind(null, chapter.id, novel.id)}>
                      {/* IMPLEMENTASI DELETE BUTTON */}
                      <DeleteButton message={`Yakin ingin menghapus bab "${chapter.title}" secara permanen?`} />
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-widest flex items-center gap-2"><Layout size={16}/> Preview Sampul</h3>
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
                {novel.coverImage ? (
                  <Image src={novel.coverImage} alt="Preview" fill className="object-cover" sizes="400px" />
                ) : <div className="flex items-center justify-center h-full text-gray-300"><ImageIcon size={48} /></div>}
              </div>
           </div>

           <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><LinkIcon size={18} className="text-indigo-600"/> Link Platform Luar</h3>
              <form action={addExternalLink.bind(null, novel.id, novel.slug)} className="space-y-3 mb-6">
                  <input type="text" name="title" placeholder="Platform (KBM App, dll)" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600" />
                  <input type="url" name="url" placeholder="https://..." required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-600" />
                  <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition text-xs">Tambah Link</button>
              </form>
              <div className="space-y-2">
                 {novel.externalLinks.map(link => (
                    <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                       <div className="overflow-hidden">
                          <span className="font-bold text-gray-900 text-[10px] block truncate">{link.title}</span>
                          <span className="text-[9px] text-blue-600 truncate block">{link.url}</span>
                       </div>
                       <form action={deleteExternalLink.bind(null, link.id, novel.id, novel.slug)}>
                          {/* IMPLEMENTASI DELETE BUTTON */}
                          <DeleteButton message={`Yakin ingin menghapus tautan ${link.title}?`} />
                       </form>
                    </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
