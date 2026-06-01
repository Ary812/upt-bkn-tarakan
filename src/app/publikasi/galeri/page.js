import { supabase } from "@/lib/supabase";
import GaleriClient from "@/components/GaleriClient";

export const revalidate = 60; // ISR

export default async function GaleriPage() {
  let galleries = [];
  try {
    const { data } = await supabase
      .from('galleries')
      .select('*')
      .order('created_at', { ascending: false });
    
    galleries = data || [];
  } catch (error) {
    console.error("Error fetching galleries:", error);
  }

  return <GaleriClient galleries={galleries} />;
}
