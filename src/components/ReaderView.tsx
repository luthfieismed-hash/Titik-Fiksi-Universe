"use client";
import { Lock, Unlock, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useReaderStore } from "@/lib/store";

export default function ReaderView({ content, isLocked, payLink, chapterId, unlockCode }: { content: string, isLocked: boolean, payLink: string | null, chapterId?: string, unlockCode?: string | null }) {
  const [unlocked, setUnlocked] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState(false);
  const { fontSize } = useReaderStore();

  useEffect(() => {
    const unlockedById = chapterId ? localStorage.getItem(`unlocked_${chapterId}`) : null;
    const unlockedByCode = unlockCode ? localStorage.getItem(`unlocked_code_${unlockCode}`) : null;
    
    if (unlockedById || unlockedByCode) {
      setUnlocked(true);
    }
  }, [chapterId, unlockCode]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockCode && inputCode.trim() === unlockCode) {
      setUnlocked(true);
      setError(false);
      localStorage.setItem(`unlocked_code_${unlockCode}`, "true");
      if (chapterId) localStorage.setItem(`unlocked_${chapterId}`, "true");
    } else {
      setError(true);
    }
  };

  const effectivelyLocked = isLocked && !unlocked;
  const safeContent = content || "";
  const displayContent = effectivelyLocked ? safeContent.substring(0, 400) + '... (Konten Terkunci)' : safeContent;

  return (
    <div className="relative w-full">
      <div 
        id="reader-content"
        className={`prose max-w-none transition-all duration-500 ease-in-out leading-relaxed md:leading-loose font-medium ${effectivelyLocked ? 'select-none blur-[4px] opacity-40' : ''}`} 
        style={{ fontSize: `${fontSize}px`, color: 'var(--paper-text)' }}
        dangerouslySetInnerHTML={{ __html: displayContent }} 
      />

      {effectivelyLocked && (
        <div className="absolute top-24 left-0 right-0 p-6 md:p-10 bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-gray-700 text-center shadow-2xl mx-auto max-w-xl z-20 animate-fade-in-up">
           <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <Lock size={32} className="text-amber-500" />
              <div className="absolute inset-0 border border-amber-500 rounded-full animate-ping opacity-20"></div>
           </div>
           
           <h3 className="text-xl font-black text-white mb-2">Bab Eksklusif</h3>
           <p className="text-gray-400 text-sm mb-8 leading-relaxed">
             Dukung penulis untuk mendapatkan <b>Kode Akses</b> dan membuka lembaran cerita ini.
           </p>
           
           {payLink ? (
             <a href={payLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition shadow-lg mb-6 w-full">
               <Zap size={18}/> Donasi & Dapatkan Kode
             </a>
           ) : (
             <button disabled className="bg-gray-800 text-gray-500 px-8 py-4 rounded-xl font-bold mb-6 w-full cursor-not-allowed">
               Link Belum Tersedia
             </button>
           )}

           {unlockCode && (
             <div className="bg-white/5 p-1 rounded-2xl border border-white/10">
                <form onSubmit={handleUnlock} className="flex gap-2">
                  <input 
                    type="text" 
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Masukkan Kode" 
                    className={`flex-1 p-3 bg-transparent outline-none font-bold text-white text-center uppercase ${error ? 'text-red-400' : ''}`}
                  />
                  <button type="submit" className="bg-white text-gray-900 font-bold px-5 rounded-xl hover:bg-gray-200 transition flex items-center gap-2">
                    Buka <Unlock size={16}/>
                  </button>
                </form>
             </div>
           )}
           {error && <p className="text-xs text-red-400 font-bold mt-4 animate-bounce">Kode Salah!</p>}
        </div>
      )}
    </div>
  );
}