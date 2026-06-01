"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ViewCounter({ postId }) {
  useEffect(() => {
    // Only increment once per visit by keeping track in sessionStorage
    const hasViewed = sessionStorage.getItem(`viewed_${postId}`);
    
    if (!hasViewed) {
      const incrementView = async () => {
        try {
          await supabase.rpc('increment_post_views', { p_id: postId });
          sessionStorage.setItem(`viewed_${postId}`, 'true');
        } catch (error) {
          console.error("Failed to increment views", error);
        }
      };

      incrementView();
    }
  }, [postId]);

  return null; // Silent component
}
