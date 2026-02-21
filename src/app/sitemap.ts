import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Ganti dengan domain asli Anda setelah online (misal: https://titikfiksi.com)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://titikfiksi.vercel.app'; 

  // Ambil data semua novel dan babnya dari database
  const novels = await db.novel.findMany({
    include: { chapters: true },
  });

  // Petakan URL halaman profil novel
  const novelUrls: MetadataRoute.Sitemap = novels.map((novel) => ({
    url: `${baseUrl}/novel/${novel.slug}`,
    lastModified: novel.updatedAt,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Petakan URL halaman baca setiap bab
  const chapterUrls: MetadataRoute.Sitemap = novels.flatMap((novel) =>
    novel.chapters.map((chapter) => ({
      url: `${baseUrl}/novel/${novel.slug}/${chapter.slug}`,
      lastModified: chapter.createdAt,
      changeFrequency: 'never', // Bab yang sudah dirilis jarang berubah
      priority: 0.6,
    }))
  );

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/toko`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/kontak`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...novelUrls,
    ...chapterUrls,
  ];
}