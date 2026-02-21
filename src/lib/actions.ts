"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

/** --- AUTHENTICATION --- **/
export async function loginAdmin(formData: FormData) {
  try {
    const passwordInput = formData.get("password") as string;
    const settings = await db.settings.findFirst();
    const validPassword = settings?.adminPassword || "Master_TFUniverse2026!";
    if (passwordInput === validPassword) {
      cookies().set("admin_session", "true", { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        maxAge: 60 * 60 * 24 * 7,
        path: '/' 
      });
      return redirect("/admin");
    }
    return redirect("/login?error=1");
  } catch (error) { return redirect("/login?error=system"); }
}

export async function logoutAdmin() { 
  cookies().delete("admin_session"); 
  redirect("/"); 
}

/** --- NOVEL MANAGEMENT --- **/
export async function createNovel(formData: FormData) { 
  try {
    const title = formData.get("title") as string; 
    const slug = formData.get("slug") as string; 
    const synopsis = formData.get("synopsis") as string; 
    const coverImage = formData.get("coverImage") as string; 
    const status = formData.get("status") as string || "Ongoing"; 
    const genres = formData.getAll("genre") as string[]; 
    const genre = genres.length > 0 ? genres.join(", ") : "Fiksi"; 
    const youtubeTrailer = (formData.get("youtubeTrailer") as string)?.trim() || null;
    await db.novel.create({ data: { title, slug, synopsis, coverImage, status, genre, youtubeTrailer } }); 
    revalidatePath("/"); revalidatePath("/admin");
  } catch (e) { console.error(e); }
  redirect("/admin"); 
}

export async function updateNovel(id: string, formData: FormData) { 
  try {
    const title = formData.get("title") as string; 
    const slug = formData.get("slug") as string; 
    const synopsis = formData.get("synopsis") as string; 
    const coverImage = formData.get("coverImage") as string; 
    const status = formData.get("status") as string || "Ongoing"; 
    const genres = formData.getAll("genre") as string[]; 
    const genre = genres.length > 0 ? genres.join(", ") : "Fiksi"; 
    const youtubeTrailer = (formData.get("youtubeTrailer") as string)?.trim() || null;
    await db.novel.update({ where: { id }, data: { title, slug, synopsis, coverImage, status, genre, youtubeTrailer } }); 
    revalidatePath("/"); revalidatePath(`/novel/${slug}`); revalidatePath("/admin");
  } catch (e) { console.error(e); }
  redirect("/admin"); 
}

/** --- CHAPTER MANAGEMENT (FAST PERFORMANCE) --- **/
export async function createChapter(novelId: string, novelSlug: string, formData: FormData) { 
  try {
    const title = formData.get("title") as string; 
    const slug = formData.get("slug") as string; 
    const content = formData.get("content") as string; 
    const orderIndex = parseInt(formData.get("orderIndex") as string); 
    const isLocked = formData.get("isLocked") === "on"; 
    const isPublished = formData.get("isPublished") === "on"; 
    const payLink = (formData.get("payLink") as string)?.trim() || null;
    const unlockCode = (formData.get("unlockCode") as string)?.trim() || null; 
    await db.chapter.create({ data: { title, slug, content, orderIndex, isLocked, isPublished, payLink, unlockCode, novelId } }); 
    revalidatePath(`/novel/${novelSlug}`); revalidatePath(`/admin/novels/${novelId}`); 
  } catch (e) { console.error(e); }
  redirect(`/admin/novels/${novelId}`); 
}

export async function updateChapter(chapterId: string, novelId: string, novelSlug: string, formData: FormData) { 
  try {
    const title = formData.get("title") as string; 
    const slug = formData.get("slug") as string; 
    const content = formData.get("content") as string; 
    const orderIndex = parseInt(formData.get("orderIndex") as string); 
    const isLocked = formData.get("isLocked") === "on"; 
    const isPublished = formData.get("isPublished") === "on"; 
    const payLink = (formData.get("payLink") as string)?.trim() || null;
    const unlockCode = (formData.get("unlockCode") as string)?.trim() || null; 
    await db.chapter.update({ where: { id: chapterId }, data: { title, slug, content, orderIndex, isLocked, isPublished, payLink, unlockCode } }); 
    revalidatePath(`/novel/${novelSlug}/${slug}`); revalidatePath(`/admin/novels/${novelId}`); 
  } catch (e) { console.error(e); }
  redirect(`/admin/novels/${novelId}`); 
}

export async function deleteChapter(chapterId: string, novelId: string) { 
  try {
    await db.chapter.delete({ where: { id: chapterId }}); 
    revalidatePath(`/admin/novels/${novelId}`); 
  } catch (e) { console.error(e); }
}

/** --- EXTERNAL LINKS & PLATFORMS --- **/
export async function addExternalLink(novelId: string, novelSlug: string, formData: FormData) { 
  try {
    const title = formData.get("title") as string; 
    const url = formData.get("url") as string; 
    if (title && url) {
      await db.externalLink.create({ data: { title, url, novelId }}); 
      revalidatePath(`/admin/novels/${novelId}`); revalidatePath(`/novel/${novelSlug}`); 
    }
  } catch (e) { console.error(e); }
}

export async function deleteExternalLink(id: string, novelId: string, novelSlug: string) {
  try {
    await db.externalLink.delete({ where: { id } });
    revalidatePath(`/admin/novels/${novelId}`); revalidatePath(`/novel/${novelSlug}`);
  } catch (e) { console.error(e); }
}

/** --- SETTINGS & INTERACTION --- **/
export async function updateSettings(formData: FormData) { 
  try {
    const data = { 
      siteName: formData.get("siteName") as string, 
      runningText: formData.get("runningText") as string, 
      email: formData.get("email") as string, 
      isActive: formData.get("isActive") === "on", 
      adminPassword: (formData.get("adminPassword") as string) || "Master_TFUniverse2026!",
      visiPenulis: formData.get("visiPenulis") as string || null,
      kekuatanPembaca: formData.get("kekuatanPembaca") as string || null,
      copyrightText: formData.get("copyrightText") as string || null
    }; 
    await db.settings.upsert({ where: { id: 1 }, update: data, create: data }); 
    revalidatePath("/"); revalidatePath("/admin/settings"); 
  } catch (e) { console.error(e); }
  redirect("/admin/settings"); 
}

export async function addSocialLink(formData: FormData) { 
  try {
    const platform = formData.get("platform") as string; const url = formData.get("url") as string;
    if (platform && url) { await db.socialLink.create({ data: { platform, url } }); revalidatePath("/admin/settings"); }
  } catch (e) {}
}

export async function deleteSocialLink(id: string) {
  try { await db.socialLink.delete({ where: { id } }); revalidatePath("/admin/settings"); } catch (e) {}
}

export async function addDonationLink(formData: FormData) { 
  try {
    const platform = formData.get("platform") as string; const url = formData.get("url") as string;
    if (platform && url) { await db.donationLink.create({ data: { platform, url } }); revalidatePath("/admin/settings"); }
  } catch (e) {}
}

export async function deleteDonationLink(id: string) {
  try { await db.donationLink.delete({ where: { id } }); revalidatePath("/admin/settings"); } catch (e) {}
}

export async function addSponsor(formData: FormData) { 
  try {
    const title = formData.get("title") as string; const imageUrl = formData.get("imageUrl") as string;
    const linkUrl = formData.get("linkUrl") as string; const description = formData.get("description") as string;
    if (title && imageUrl && linkUrl) { 
      await db.sponsor.create({ data: { title, imageUrl, linkUrl, description } }); 
      revalidatePath("/admin/settings"); revalidatePath("/toko"); 
    }
  } catch (e) {}
  redirect("/admin/settings");
}

export async function deleteSponsor(id: string) {
  try { await db.sponsor.delete({ where: { id } }); revalidatePath("/admin/settings"); revalidatePath("/toko"); } catch (e) {}
}

export async function incrementNovelViews(novelId: string) { 
  try { await db.novel.update({ where: { id: novelId }, data: { views: { increment: 1 } } }); } catch (error) {} 
}

export async function addRating(novelId: string, formData: FormData) { 
  try {
    const value = parseInt(formData.get("value") as string); const path = formData.get("path") as string;
    if (value) { await db.rating.create({ data: { value, novelId } }); revalidatePath(path); }
  } catch (e) {}
}

export async function addComment(chapterId: string, formData: FormData) { 
  try {
    const name = formData.get("name") as string; const content = formData.get("content") as string; const path = formData.get("path") as string;
    if (name && content) { await db.comment.create({ data: { name, content, chapterId } }); revalidatePath(path); }
  } catch (e) {}
}