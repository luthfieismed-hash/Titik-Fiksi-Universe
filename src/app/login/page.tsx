import { loginAdmin } from "@/lib/actions";
import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Ruang Rahasia - Titik Fiksi" };

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition">
        <ArrowLeft size={20} /> Kembali ke Beranda
      </Link>

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Lock size={36} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Pintu Rahasia</h1>
          <p className="text-sm text-gray-500">Masukkan kode akses untuk masuk ke Ruang Penulis.</p>
        </div>

        <form action={loginAdmin} className="space-y-6">
          <div>
            <input 
              type="password" 
              name="password" 
              placeholder="Kata Sandi..." 
              required 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-center font-mono text-xl tracking-widest shadow-inner transition"
            />
            {searchParams.error && (
              <p className="text-red-500 text-sm font-bold mt-3 text-center animate-pulse">Akses Ditolak! Sandi Salah.</p>
            )}
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-black text-lg py-4 rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-xl hover:-translate-y-1">
            Buka Brankas
          </button>
        </form>
      </div>
    </div>
  );
}