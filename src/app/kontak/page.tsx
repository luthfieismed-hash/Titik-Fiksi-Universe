import { db } from "@/lib/db";
import { Mail, Send, MapPin, Link as LinkIcon, Instagram, Twitter, Facebook, Youtube, MessageCircle } from "lucide-react";
import Link from "next/link";

// Ikon TikTok Kustom
const TikTokIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3-3v7a8 8 0 1 1-8-8v3a5 5 0 1 0 5 5z"></path></svg>
);

// Pencari Ikon
function getIcon(platform: string, size = 20) {
  const p = platform.toLowerCase();
  if (p.includes("instagram")) return <Instagram size={size} />;
  if (p.includes("tiktok")) return <TikTokIcon size={size} />;
  if (p.includes("twitter") || p.includes("x")) return <Twitter size={size} />;
  if (p.includes("facebook")) return <Facebook size={size} />;
  if (p.includes("youtube")) return <Youtube size={size} />;
  if (p.includes("whatsapp")) return <MessageCircle size={size} />;
  return <LinkIcon size={size} />;
}

export const metadata = {
  title: "Kontak & Sosial Media - Titik Fiksi",
  description: "Hubungi kami untuk kerja sama, kritik, saran, atau sekadar menyapa.",
};

export default async function KontakPage() {
  const settings = await db.settings.findFirst();
  const socialLinks = await db.socialLink.findMany();
  const email = settings?.email || "halo@domainanda.com";

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 text-blue-600 rounded-full mb-6 shadow-sm"><Send size={32} /></div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Mari Terhubung</h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Setiap masukan Anda adalah tinta berharga bagi kami. Dengan pena dan buku yang selalu terbuka, kami siap menampung sapaan, kritik, maupun tawaran kerja sama.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Informasi Kontak</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Mail size={24} /></div>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Email Resmi</h3>
                  <a href={`mailto:${email}`} className="text-lg font-medium text-gray-900 hover:text-blue-600 transition">{email}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><MapPin size={24} /></div>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Lokasi Markas</h3>
                  <p className="text-lg font-medium text-gray-900">Indonesia</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-6 text-gray-900">Jejaring Sosial</h2>
            <div className="flex flex-wrap gap-4">
              {socialLinks.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Belum ada sosial media yang ditambahkan.</p>
              ) : (
                socialLinks.map(link => (
                  <Link key={link.id} href={link.url} target="_blank" className="flex items-center gap-2 px-5 py-3 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 rounded-xl font-bold transition text-gray-700">
                    {getIcon(link.platform, 20)} {link.platform}
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl shadow-xl text-white">
            <h2 className="text-2xl font-bold mb-6">Kirim Pesan Cepat</h2>
            <form className="space-y-4" action={`mailto:${email}`} method="GET" encType="text/plain">
              <div><label className="block text-sm font-medium mb-2 text-gray-300">Nama Anda</label><input type="text" name="subject" placeholder="Nama / Instansi" className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition" required /></div>
              <div><label className="block text-sm font-medium mb-2 text-gray-300">Pesan</label><textarea name="body" rows={5} placeholder="Tuliskan pesan..." className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition resize-none" required></textarea></div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg flex justify-center items-center gap-2">Buka di Aplikasi Email <Send size={18} /></button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}