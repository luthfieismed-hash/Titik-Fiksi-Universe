import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Book, Star, Eye, Search as SearchIcon, ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string, genre?: string } }) {
  const query = searchParams.q || "";
  const genre = searchParams.genre || "";

  // Logika Filter Database yang dioptimalkan
  const whereClause: any = {};
  if (query) whereClause.title = { contains: query, mode: 'insensitive' };
  if (genre) whereClause.genre = { contains: genre, mode: 'insensitive' };

  const novels = await db.novel.findMany({
    where: whereClause,
    include: { 
      chapters: { where: { isPublished: true }, select: { id: true } }, 
      ratings: { select: { value: true } } 
    }
  });

  return (
    <div className="min-h-screen pb-20 pt-32 overflow-x-hidden bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition font-bold mb-4">
              <ChevronLeft size={20}/> Kembali ke Beranda
            </Link>
            <h1 className="text-3xl font-black text-gray-900">
              {query || genre ? `Hasil untuk "${query || genre}"` : "Jelajahi Semua Novel"}
            </h1>
            <p className="text-gray-500 font-medium">{novels.length} cerita ditemukan</p>
          </div>
        </div>

        {novels.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
            <Book size={64} className="mx-auto text-gray-200 mb-6" />
            <p className="text-xl font-bold text-gray-400">Maaf, cerita tidak ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {novels.map((novel) => {
              const totalRatings = novel.ratings.length;
              const avgRating = totalRatings > 0 
                ? (novel.ratings.reduce((sum, r) => sum + r.value, 0) / totalRatings).toFixed(1) 
                : "0.0";

              return (
                <Link key={novel.id} href={`/novel/${novel.slug}`} className="group flex flex-col bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-200 mb-3">
                    {novel.coverImage ? (
                      <Image 
                        src={novel.coverImage} 
                        alt={novel.title} 
                        fill 
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : <div className="w-full h-full flex items-center justify-center text-gray-400"><Book size={40} /></div>}
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-yellow-400 text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1 z-10">
                      <Star size={10} fill="currentColor"/> {avgRating}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">{novel.title}</h3>
                  <div className="mt-auto pt-3 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Eye size={12}/> {novel.views}</span>
                    <span>{novel.chapters.length} Bab</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}