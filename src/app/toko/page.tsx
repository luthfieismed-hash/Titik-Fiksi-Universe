import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Store, Heart, ExternalLink, Coffee, ShoppingBag } from "lucide-react";

export const revalidate = 60;

export default async function TokoPage() {
  // OPTIMASI: Parallel Fetching untuk kecepatan maksimal
  const [settings, donationLinks, sponsors] = await Promise.all([
    db.settings.findFirst(),
    db.donationLink.findMany(),
    db.sponsor.findMany()
  ]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-32">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm transform -rotate-6">
            <Store size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Toko & Dukungan</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Dukung terus karya-karya {settings?.siteName || "Titik Fiksi"} agar kami bisa terus menghadirkan cerita terbaik untuk Anda.
          </p>
        </div>

        {/* SECTION DONASI */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-sm mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-600 rotate-12"><Heart size={120} fill="currentColor"/></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <Coffee className="text-orange-500" /> Traktir Penulis
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {donationLinks.map(link => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50/30 transition group">
                  <span className="font-black text-gray-700 group-hover:text-blue-600">{link.platform}</span>
                  <ExternalLink size={18} className="text-gray-300 group-move-x" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION MERCHANDISE / SPONSOR */}
        <div className="space-y-8">
           <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 ml-4">
             <ShoppingBag className="text-blue-600" /> Produk & Merchandise
           </h2>
           {sponsors.length === 0 ? (
             <div className="p-20 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center text-gray-400 font-bold">
               Belum ada produk yang tersedia saat ini.
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sponsors.map(sponsor => (
                  <div key={sponsor.id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition group flex flex-col">
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                       <Image 
                         src={sponsor.imageUrl} 
                         alt={sponsor.title} 
                         fill 
                         className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                       />
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                       <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">{sponsor.title}</h3>
                       <p className="text-sm text-gray-600 mb-8 leading-relaxed flex-1">{sponsor.description}</p>
                       <Link href={sponsor.linkUrl} target="_blank" className="flex items-center justify-center gap-2 w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-blue-600 transition shadow-lg">
                         Beli Sekarang <ExternalLink size={18}/>
                       </Link>
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>

      </div>
    </div>
  );
}