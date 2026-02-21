import { db } from "@/lib/db";
import { PenTool, Heart, Sparkles } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "Tentang Kami - Titik Fiksi",
  description: "Mengenal lebih dekat perjalanan dan visi Titik Fiksi Universe.",
};

export default async function TentangPage() {
  const settings = await db.settings.findFirst();
  
  // Script ini telah diintegrasikan dengan database Settings agar bisa diedit di Admin.
  // Jika teks belum disetel di Admin, ia akan menggunakan teks bawaan yang profesional.
  
  // @ts-ignore
  const visiPenulis = settings?.visiPenulis || "Titik Fiksi Universe dibangun sebagai markas besar kebebasan berimajinasi. Di sini, batas antara realita dan fiksi melebur menjadi karya-karya yang dirancang secara khusus untuk menemani waktu luang Anda. Kami ingin menciptakan platform baca yang tidak hanya menarik dari segi cerita, tapi juga sangat nyaman di mata.";
  
  // @ts-ignore
  const kekuatanPembaca = settings?.kekuatanPembaca || "Platform ini dapat terus berdiri murni karena dukungan Anda. Setiap komentar, rating bintang, dan buku yang Anda baca adalah bahan bakar utama kami. Jika Anda menyukai karya di sini, membagikannya ke teman atau mendukung penulis melalui halaman Toko & Dukungan sangatlah berarti bagi kami.";

  return (
    <div className="min-h-screen bg-white py-16 pt-28 md:pt-32 overflow-x-hidden relative">
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        
        {/* Bintang Air (Watermark) - Diperbaiki agar tidak terpotong navbar */}
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <Sparkles size={300} />
        </div>

        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-blue-50 text-blue-600 rounded-full mb-6 shadow-sm">
            <Sparkles size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Cerita di Balik <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Titik Fiksi</span></h1>
          <p className="text-lg text-gray-600 leading-relaxed font-medium">
            Kami percaya bahwa setiap kata memiliki nyawa, dan setiap paragraf mampu membawa pembacanya ke semesta yang sama sekali baru.
          </p>
        </div>

        <div className="space-y-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4 bg-white text-gray-700 rounded-2xl flex-shrink-0 shadow-sm border border-gray-100"><PenTool size={32} /></div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Visi Penulis</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {visiPenulis}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start bg-red-50/50 p-6 md:p-8 rounded-3xl border border-red-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4 bg-white text-red-500 rounded-2xl flex-shrink-0 shadow-sm border border-red-100"><Heart size={32} /></div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Kekuatan Pembaca</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {kekuatanPembaca}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}