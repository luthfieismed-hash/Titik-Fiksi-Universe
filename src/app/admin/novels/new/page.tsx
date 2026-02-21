import { createNovel } from "@/lib/actions";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

export default function NewNovelPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-gray-900">Tambah Novel Baru</h1>
        <Link href="/admin" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition font-bold">
          <ArrowLeft size={20} /> Kembali
        </Link>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm">
        <form action={createNovel} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Judul Novel</label>
              <input type="text" name="title" required placeholder="Contoh: System Raja Keberuntungan" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Slug URL (Tanpa spasi, gunakan strip)</label>
              <input type="text" name="slug" required placeholder="contoh: system-raja-keberuntungan" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-mono text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status Novel</label>
              <select name="status" defaultValue="Ongoing" className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-700">
                <option value="Ongoing">Ongoing (Sedang Berjalan)</option>
                <option value="Completed">Completed (Tamat)</option>
                <option value="Hiatus">Hiatus</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Genre (Pisahkan dengan koma)</label>
              <input type="text" name="genre" required placeholder="Contoh: Fantasy, Action, Sistem" defaultValue="Fiksi" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
          </div>

          <div className="pt-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Sinopsis / Deskripsi</label>
            <textarea name="synopsis" required rows={6} placeholder="Tuliskan sinopsis yang menarik di sini..." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none resize-none"></textarea>
          </div>

          <div className="pt-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Link Gambar Cover (Opsional)</label>
            <input type="url" name="coverImage" placeholder="https://..." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
            <p className="text-xs text-gray-500 mt-2 font-medium">Gunakan link langsung (berakhiran .jpg / .png) dari Postimages atau Imgur.</p>
          </div>

          <div className="pt-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Link Trailer YouTube (Opsional)</label>
            <input type="url" name="youtubeTrailer" placeholder="https://youtube.com/watch?v=..." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
          </div>

          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg mt-8"><Plus size={20} /> Simpan & Buat Novel</button>
        </form>
      </div>
    </div>
  );
}