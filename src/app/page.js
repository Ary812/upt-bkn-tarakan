import { supabase } from "@/lib/supabase";
import HomeClient from "@/components/HomeClient";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

export default async function Home() {
  let latestNews = [];
  let heroSlides = [];

  try {
    // Fetch latest 4 published berita or pengumuman
    const { data: newsData } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'publish')
      .in('category', ['berita', 'pengumuman'])
      .order('created_at', { ascending: false })
      .limit(4);
      
    if (newsData) {
      latestNews = newsData;
    }

    // Fetch 3 latest posts (berita or pengumuman) for hero slider
    const { data: heroRes } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'publish')
      .in('category', ['berita', 'pengumuman'])
      .order('created_at', { ascending: false })
      .limit(3);

    if (heroRes && heroRes.length > 0) {
      heroSlides = heroRes.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.content.substring(0, 150) + "...",
        image: post.image_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600",
        href: `/publikasi/${post.category}/${post.id}`,
        category: post.category
      }));
    }
  } catch (error) {
    console.error("Error fetching home data:", error);
  }

  return <HomeClient heroSlides={heroSlides} latestNews={latestNews} />;
}
