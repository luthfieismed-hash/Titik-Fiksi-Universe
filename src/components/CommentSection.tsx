"use client";

import { useState, useEffect } from "react";
import { addComment } from "@/lib/actions";
import { usePathname } from "next/navigation";
import { MessageSquare, Clock, Send, ShieldAlert } from "lucide-react";

export default function CommentSection({ chapterId, comments }: { chapterId: string, comments: any[] }) {
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // SISTEM ANTI SPAM COOLDOWN (60 Detik)
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    // Mengecek apakah pembaca ini baru saja mengirim komentar di bab ini
    const lastCommentStr = localStorage.getItem(`last_comment_${chapterId}`);
    if (lastCommentStr) {
      const secondsPassed = Math.floor((Date.now() - parseInt(lastCommentStr)) / 1000);
      if (secondsPassed < 60) {
        setCooldown(60 - secondsPassed);
      }
    }
  }, [chapterId]);

  useEffect(() => {
    // Penghitung waktu mundur Anti-Spam
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cooldown > 0) return; // Mencegah orang memaksa kirim saat masih cooldown

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("path", pathname);
    
    await addComment(chapterId, formData);
    
    // Memicu kunci Anti-Spam setelah berhasil terkirim
    localStorage.setItem(`last_comment_${chapterId}`, Date.now().toString());
    setCooldown(60);
    
    setIsSubmitting(false);
    e.currentTarget.reset();
  };

  return (
    <div>
      <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3"><MessageSquare className="text-blue-600"/> Ruang Diskusi <span className="text-sm font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{comments.length} Komentar</span></h3>
      
      {/* FORM KOMENTAR */}
      <form onSubmit={handleSubmit} className="mb-12 bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
        
        {/* LAYAR PERINGATAN ANTI-SPAM (Muncul jika Cooldown aktif) */}
        {cooldown > 0 && (
          <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 transition-all duration-300">
             <ShieldAlert size={40} className="text-amber-500 mb-3" />
             <p className="font-bold text-gray-900 text-lg">Sistem Anti-Spam Aktif</p>
             <p className="text-sm text-gray-600">Tolong tunggu <span className="text-amber-600 font-black text-xl">{cooldown}</span> detik lagi sebelum mengirim komentar baru.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
           <div>
             <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Nama Anda</label>
             <input type="text" name="name" required placeholder="Siapa nama Anda?" className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition font-medium text-gray-800" disabled={cooldown > 0} />
           </div>
        </div>
        <div className="mb-4">
           <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Isi Komentar</label>
           <textarea name="content" required rows={4} placeholder="Tuliskan pendapat atau teorimu tentang bab ini..." className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none resize-none transition font-medium text-gray-800" disabled={cooldown > 0}></textarea>
        </div>
        
        <button type="submit" disabled={isSubmitting || cooldown > 0} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2">
          {isSubmitting ? "Mengirim..." : <><Send size={16} /> Kirim Komentar</>}
        </button>
      </form>

      {/* DAFTAR KOMENTAR BAWAAN */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200 font-medium">Jadilah yang pertama memberikan komentar!</div>
        ) : (
          comments.map((comment: any) => (
            <div key={comment.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start group hover:border-blue-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md flex-shrink-0">
                {comment.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-900">{comment.name}</h4>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1"><Clock size={10} /> {new Date(comment.createdAt).toLocaleDateString("id-ID")}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}