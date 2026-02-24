import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Eye, BookOpen, Lock, ExternalLink } from "lucide-react";
import ViewTracker from "@/components/ViewTracker";
import BookmarkButton from "@/components/BookmarkButton";
import ShareButton from "@/components/ShareButton";
import TrailerModal from "@/components/TrailerModal";
import ExpandableSynopsis from "@/components/ExpandableSynopsis";

export const revalidate = 60;

export default async function NovelDetailPage({ params }: { params: { slug: string } }) {
  const novel = await db.novel.findUnique({
    where: { slug: params.slug },
    include: { 
      chapters: { where: { isPublished: true }, orderBy: { orderIndex: 'asc' } },
      ratings: true,
      externalLinks: true 
    }
  });

  if (!novel) return notFound();

  const totalRatings = novel.ratings.length;
  const avgRating = totalRatings > 0 
    ? (novel.ratings.reduce((a, b) => a + b.value, 0) / totalRatings).toFixed(1) 
    : "0.0";

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <ViewTracker novelId={novel.id} />
      
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* KIRI: Sampul & Metadata */}
          <div className="lg:col-span-4 space-y-6 md:space-y-8">
            <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white group w-2/3 mx-auto md:w-full">
              {novel.coverImage ? (
                <Image src={novel.coverImage} alt={novel.title} fill priority className="object-cover group-hover:scale-105 transition duration-700" />
              ) : <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400"><BookOpen size={64}/></div>}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-yellow-400 font-black px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg z-10">
                <Star size={18} fill="currentColor"/> {avgRating}
              </div>
            </div>

            <div className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between text-xs md:text-sm font-bold border-b border-gray-50 pb-4">
                <span className="text-gray-400 uppercase tracking-widest">Status</span>
                <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{novel.status}</span>
              </div>
              <div className="flex items-center justify-between text-xs md:text-sm font-bold border-b border-gray-50 pb-4">
                <span className="text-gray-400 uppercase tracking-widest">Pembaca</span>
                <span className="text-gray-900 flex items-center gap-2"><Eye size={16}/> {novel.views}</span>
              </div>
              
              {/* PERBAIKAN VISUAL GENRE: Menjadi bentuk Kapsul/Badge yang bisa tersusun otomatis secara rapi */}
              <div className="flex items-start justify-between text-xs md:text-sm font-bold gap-4 pt-1">
                <span className="text-gray-400 uppercase tracking-widest flex-shrink-0 pt-1">Genre</span>
                <div className="flex flex-wrap justify-end gap-1.5">
                  {novel.genre.split(',').map((g, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-50 border border-gray-200 text-gray-700 px-2.5 py-1 rounded-lg text-[10px] md:text-xs hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-default"
                    >
                      {g.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Platform Eksternal */}
            {novel.externalLinks.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Tersedia Juga Di:</h3>
                <div className="grid grid-cols-1 gap-2">
                  {novel.externalLinks.map((link) => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-blue-500 transition shadow-sm group">
                      <span className="font-bold text-gray-700 text-sm group-hover:text-blue-600">{link.title}</span>
                      <ExternalLink size={16} className="text-gray-300 group-hover:text-blue-500 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <BookmarkButton novel={{ id: novel.id, title: novel.title }} />
              <ShareButton title={novel.title} />
              {novel.youtubeTrailer && <TrailerModal youtubeId={novel.youtubeTrailer} />}
            </div>
          </div>

          {/* KANAN: Sinopsis & Daftar Bab */}
          <div className="lg:col-span-8 space-y-10 md:space-y-12">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 md:mb-6 leading-tight text-center md:text-left">{novel.title}</h1>
              <ExpandableSynopsis text={novel.synopsis} />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-3">Daftar Isi <span className="text-xs md:text-sm font-bold bg-blue-600 text-white px-3 py-1 rounded-full">{novel.chapters.length} Bab</span></h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {novel.chapters.map((chapter) => (
                  <Link 
                    key={chapter.id} 
                    href={`/novel/${novel.slug}/${chapter.slug}`}
                    className="flex items-start justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-500 hover:shadow-md transition group min-h-[72px]"
                  >
                    <div className="flex items-start gap-4 flex-1 pr-2">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition flex-shrink-0 mt-0.5">
                        {chapter.orderIndex}
                      </div>
                      <span className="font-bold text-gray-700 text-sm md:text-base group-hover:text-gray-900 line-clamp-2 leading-snug">{chapter.title}</span>
                    </div>
                    {chapter.isLocked && <Lock size={16} className="text-amber-500 flex-shrink-0 mt-2" />}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
