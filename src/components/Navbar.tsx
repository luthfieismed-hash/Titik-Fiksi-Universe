import Link from "next/link";
import { db } from "@/lib/db";

export default async function Navbar() {
  const settings = await db.settings.findFirst();
  
  return (
    <nav className="fixed w-full max-w-[100vw] top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 transition-all duration-300">
      <div className="container mx-auto px-4 max-w-6xl h-[72px] md:h-20 flex items-center justify-between">
        
        {/* LOGO & NAMA WEB */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-xl group-hover:scale-105 transition-transform shadow-md">TF</div>
          <div>
            <h1 className="font-black text-gray-900 leading-tight text-base md:text-lg group-hover:text-blue-600 transition-colors">{settings?.siteName || "Titik Fiksi"}</h1>
            <p className="text-[9px] md:text-[10px] font-bold text-gray-500 tracking-widest uppercase">Universe</p>
          </div>
        </Link>

        {/* MENU TENGAH (DESKTOP) */}
        <div className="hidden md:flex items-center gap-8 font-bold text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
          <Link href="/toko" className="hover:text-blue-600 transition-colors">Toko & Dukungan</Link>
          <Link href="/tentang" className="hover:text-blue-600 transition-colors">Tentang Kami</Link>
          <Link href="/kontak" className="hover:text-blue-600 transition-colors">Kontak</Link>
        </div>
      </div>
    </nav>
  );
}