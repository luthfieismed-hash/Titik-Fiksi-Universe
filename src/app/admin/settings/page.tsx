import { db } from "@/lib/db";
import { 
  updateSettings, 
  addSocialLink, 
  deleteSocialLink, 
  addDonationLink, 
  deleteDonationLink, 
  addSponsor, 
  deleteSponsor 
} from "@/lib/actions";
import { 
  Settings, 
  Mail, 
  Lock, 
  Type, 
  Link as LinkIcon, 
  Coffee, 
  Save, 
  Plus, 
  Trash2, 
  Megaphone,
  Globe,
  Heart
} from "lucide-react";

export default async function SettingsPage() {
  // OPTIMASI JELI: Parallel Fetching menggunakan Promise.all
  // Ini memangkas waktu loading hingga 4x lebih cepat dibandingkan await satu per satu.
  const [settings, socials, donations, sponsors] = await Promise.all([
    db.settings.findFirst(),
    db.socialLink.findMany(),
    db.donationLink.findMany(),
    db.sponsor.findMany()
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-fade-in-up">
      {/* HEADER DASHBOARD */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <Settings className="text-blue-600" size={32} /> Pengaturan <span className="text-blue-600">Website</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1">Kelola identitas, pengumuman, dan dukungan finansial Titik Fiksi Universe.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* KOLOM KIRI: KONFIGURASI UTAMA */}
        <div className="lg:col-span-8 space-y-10">
          
          <form action={updateSettings} className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden transition-all">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h2 className="font-bold text-gray-800 flex items-center gap-2"><Globe size={20} className="text-blue-500"/> Identitas & Branding</h2>
              <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                <Save size={18} /> Simpan Semua Perubahan
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nama Platform</label>
                  <div className="relative">
                    <input type="text" name="siteName" defaultValue={settings?.siteName} className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-gray-800" />
                    <Type className="absolute left-4 top-4 text-gray-300" size={20} />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Kontak</label>
                  <div className="relative">
                    <input type="email" name="email" defaultValue={settings?.email || ""} className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-gray-800" />
                    <Mail className="absolute left-4 top-4 text-gray-300" size={20} />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Running Text (Running Announcement)</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isActive" defaultChecked={settings?.isActive} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                    <span className="text-xs font-bold text-gray-600 uppercase">Aktifkan</span>
                  </label>
                </div>
                <div className="relative">
                  <textarea name="runningText" defaultValue={settings?.runningText || ""} rows={2} className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-medium"></textarea>
                  <Megaphone className="absolute left-4 top-4 text-gray-300" size={20} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Visi Penulis (Tampil di Halaman Tentang)</label>
                <textarea name="visiPenulis" defaultValue={settings?.visiPenulis || ""} rows={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-medium leading-relaxed"></textarea>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Kekuatan Pembaca (Tampil di Halaman Tentang)</label>
                <textarea name="kekuatanPembaca" defaultValue={settings?.kekuatanPembaca || ""} rows={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-medium leading-relaxed"></textarea>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="space-y-3 max-w-sm">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Password Panel Admin Baru</label>
                  <div className="relative">
                    <input type="password" name="adminPassword" placeholder="Kosongkan jika tak diubah" className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-mono" />
                    <Lock className="absolute left-4 top-4 text-gray-300" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* KOLOM KANAN: EKSTERNAL LINKS & DUKUNGAN */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* SOSIAL MEDIA */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><LinkIcon size={18} className="text-indigo-500"/> Media Sosial</h3>
            <form action={addSocialLink} className="space-y-3">
              <input type="text" name="platform" placeholder="Instagram / TikTok" required className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-bold" />
              <input type="url" name="url" placeholder="URL Profil" required className="w-full p-3 bg-gray-50 border rounded-xl text-xs" />
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-100">Tambah Sosial</button>
            </form>
            <div className="space-y-2 pt-2">
              {socials.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                  <div className="overflow-hidden">
                    <span className="font-bold text-gray-800 text-[10px] block truncate uppercase">{s.platform}</span>
                    <span className="text-[9px] text-gray-400 truncate block">{s.url}</span>
                  </div>
                  <form action={deleteSocialLink.bind(null, s.id)}>
                    <button type="submit" className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={14}/></button>
                  </form>
                </div>
              ))}
            </div>
          </div>

          {/* DONASI & DUKUNGAN */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Heart size={18} className="text-red-500"/> Link Donasi</h3>
            <form action={addDonationLink} className="space-y-3">
              <input type="text" name="platform" placeholder="Saweria / Trakteer" required className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-bold" />
              <input type="url" name="url" placeholder="URL Link Donasi" required className="w-full p-3 bg-gray-50 border rounded-xl text-xs" />
              <button type="submit" className="w-full py-3 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition shadow-md shadow-red-100">Tambah Link Donasi</button>
            </form>
            <div className="space-y-2 pt-2">
              {donations.map(d => (
                <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                  <span className="font-bold text-gray-800 text-[10px] uppercase">{d.platform}</span>
                  <form action={deleteDonationLink.bind(null, d.id)}>
                    <button type="submit" className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={14}/></button>
                  </form>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}