import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Book, Star, Eye, ChevronRight, Megaphone, Clock, Search } from "lucide-react";

export const revalidate = 60; 

const PREDEFINED_GENRES = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Isekai", "Mystery", "Romance", "Sci-Fi", "System", "Urban Fantasy"];

export default async function HomePage() {
  const [settings, novels, latestChapters] = await Promise.all([
    db.settings.findFirst(),
    db.novel.findMany({
      orderBy: { views: 'desc' },
      take: 12, 
      include: { 
        chapters: { where: { isPublished: true }, select: { id: true } }, 
        ratings: { select: { value: true } } 
      }
    }),
    db.chapter.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { novel: { select: { title: true, slug: true, coverImage: true } } }
    })
  ]);

  const featuredNovel = novels[0]; 
  
  let fAvgRating = "0.0";
  if (featuredNovel && featuredNovel.ratings.length > 0) {
    const fSum = featuredNovel.ratings.reduce((sum, r) => sum + r.value, 0);
    fAvgRating = (fSum / featuredNovel.ratings.length).toFixed(1);
  }

  return (
    <div className="min-h-screen pb-20 pt-28 overflow-x-hidden bg-gray-50">
      
      {settings?.runningText && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm py-2 px-4 shadow-md flex items-center overflow-hidden mb-8 animate-fade-in-up">
          <Megaphone size={16} className="mr-3 flex-shrink-0 animate-pulse relative z-10 bg-indigo-700 rounded-full p-1 box-content" />
          <div className="flex-1 overflow-hidden relative">
            <div className="animate-marquee font-bold tracking-wide">{settings.runningText}</div>
          </div>
        </div>
      )}

      {featuredNovel && (
        <div className="container mx-auto px-4 max-w-6xl mb-16 animate-fade-in-up delay-100">
          <div className="relative rounded-3xl overflow-hidden bg-gray-900 shadow-2xl group border border-gray-800">
            <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity duration-700 bg-gray-900">
              {featuredNovel.coverImage && (
                <Image src={featuredNovel.coverImage} alt="bg-blur" fill className="object-cover blur-xl scale-125" priority />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>

            <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12">
              <div className="w-48 md:w-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/20 transform group-hover:scale-105 transition-transform duration-500 bg-gray-800 relative aspect-[2/3]">
                {featuredNovel.coverImage ? (
                  <Image src={featuredNovel.coverImage} alt={featuredNovel.title} fill priority className="object-cover" />
                ) : <div className="absolute inset-0 flex items-center justify-center text-gray-500"><Book size={48} /></div>}
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-yellow-400 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md flex items-center gap-1 z-10">
                  <Star size={12} fill="currentColor"/> {fAvgRating}
                </div>
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md z-10">
                  {featuredNovel.status}
                </div>
              </div>

              <div className="text-center md:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                  <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg">Sorotan Utama</span>
                  <span className="inline-block px-3 py-1.5 bg-gray-800/80 backdrop-blur-sm border border-gray-600 text-blue-400 text-xs font-bold uppercase tracking-widest rounded-full shadow-sm">{featuredNovel.genre}</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">{featuredNovel.title}</h1>
                <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-8 max-w-2xl leading-relaxed">{featuredNovel.synopsis}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <Link href={`/novel/${featuredNovel.slug}`} className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition shadow-xl flex items-center gap-2 transform hover:-translate-y-1">
                    Mulai Membaca <ChevronRight size={20} />
                  </Link>
                  <div className="flex items-center gap-4 text-gray-300 font-medium">
                    <span className="flex items-center gap-1 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm"><Eye size={18} /> {featuredNovel.views}</span>
                    <span className="flex items-center gap-1 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm"><Star size={18} className="text-yellow-400" /> {fAvgRating} ({featuredNovel.ratings.length})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-6xl mb-12 animate-fade-in-up delay-100">
        <form action="/search" method="GET" className="relative max-w-2xl mx-auto">
          <input type="text" name="q" placeholder="Cari judul novel..." className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none font-medium text-gray-700" />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition">Cari</button>
        </form>
      </div>

      <div className="container mx-auto px-4 max-w-6xl animate-fade-in-up delay-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">Koleksi <span className="text-blue-600">Novel</span></h2>
            </div>
            
            <div className="flex overflow-x-auto custom-scrollbar pb-3 mb-6 gap-2">
               <Link href="/search" className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-bold whitespace-nowrap shadow-md hover:bg-blue-700 transition">Semua Novel</Link>
               {PREDEFINED_GENRES.map(g => (
                 <Link key={g} href={`/search?genre=${g}`} className="px-5 py-2 bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 rounded-full text-sm font-bold whitespace-nowrap transition-colors shadow-sm">{g}</Link>
               ))}
            </div>

            {novels.length === 0 ? (
              <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-200 shadow-sm">Belum ada novel yang dirilis.</div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {novels.map((novel) => {
                    const totalRatings = novel.ratings.length;
                    const sumRatings = novel.ratings.reduce((sum, r) => sum + r.value, 0);
                    const avgRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : "0.0";

                    return (
                      <Link key={novel.id} href={`/novel/${novel.slug}`} className="group flex flex-col">
                        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-gray-200 mb-4 shadow-md group-hover:shadow-xl transition-all duration-500 border border-gray-200">
                          {novel.coverImage ? (
                            <Image src={novel.coverImage} alt={novel.title} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" />
                          ) : <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100"><Book size={40} /></div>}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-yellow-400 text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1 z-10"><Star size={10} fill="currentColor"/> {avgRating}</div>
                          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md z-10">{novel.status}</div>
                        </div>
                        <div className="flex flex-col flex-1 px-1">
                          <h3 className="font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">{novel.title}</h3>
                          <p className="text-xs text-blue-600 font-bold mt-1 mb-2 truncate">{novel.genre}</p>
                          <div className="mt-auto flex items-center justify-between text-xs text-gray-500 font-medium border-t border-gray-100 pt-2">
                            <span className="flex items-center gap-1"><Eye size={14}/> {novel.views}</span>
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md text-gray-600">{novel.chapters.length} Bab</span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
                {novels.length >= 12 && (
                  <div className="mt-10 text-center">
                    <Link href="/search" className="inline-block px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-50 hover:text-blue-600 transition shadow-sm">Lihat Semua Novel</Link>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">Update <span className="text-blue-600">Terbaru</span></h2>
            </div>
            <div className="flex flex-col gap-3">
              {latestChapters.length === 0 ? (
                <div className="text-center py-10 bg-white border border-gray-200 rounded-2xl text-gray-400 text-sm shadow-sm">Belum ada bab rilis.</div>
              ) : (
                latestChapters.map((chapter) => (
                  <Link key={chapter.id} href={`/novel/${chapter.novel.slug}/${chapter.slug}`} className="flex items-center gap-4 p-3 bg-white hover:bg-blue-50/50 border border-gray-100 hover:border-blue-100 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                      <div className="w-16 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200 shadow-sm relative aspect-[2/3]">
                        {chapter.novel.coverImage ? (
                          <Image src={chapter.novel.coverImage} alt="cover" fill sizes="100px" className="object-cover transform group-hover:scale-110 transition-transform duration-500" />
                        ) : <Book size={20} className="absolute inset-0 m-auto h-full text-gray-400"/>}
                      </div>
                      
                      {/* OPTIMASI ANDROID: Hapus truncate, ganti ke line-clamp-2 agar judul panjang terbaca utuh menurun */}
                      <div className="flex-1 min-w-0 py-1">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full mb-1">Bab {chapter.orderIndex}</span>
                        <h4 className="font-bold text-sm text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1 leading-tight">{chapter.novel.title}</h4>
                        <p className="text-xs font-medium text-gray-600 line-clamp-2 mt-1 leading-snug pr-2">{chapter.title}</p>
                        <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-2"><Clock size={10}/> {new Date(chapter.createdAt).toLocaleDateString('id-ID')}</div>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-transform transform group-hover:translate-x-1 flex-shrink-0 mr-1" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}