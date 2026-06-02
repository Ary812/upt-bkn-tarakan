"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, FileImage } from "lucide-react";
import { getPaginatedPosts } from "@/lib/actions";

// Custom hook for intersection observer
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [options.root, options.rootMargin, options.threshold]);

  return { ref: targetRef, isIntersecting };
}

export default function InfiniteScrollPosts({ initialPosts, category }) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 9);
  const [isLoading, setIsLoading] = useState(false);
  
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const newPosts = await getPaginatedPosts(category, page, 9);
      if (newPosts.length < 9) {
        setHasMore(false);
      }
      setPosts((prev) => [...prev, ...newPosts]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to fetch more posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [category, page, isLoading, hasMore]);

  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading) {
      loadMorePosts();
    }
  }, [isIntersecting, hasMore, isLoading, loadMorePosts]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <Link key={post.id} href={`/publikasi/${category}/${post.id}`} className="block group">
            <div className="bg-surface-card rounded-[2rem] overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 border border-gray-100/50 h-full">
              <div className="aspect-[4/3] relative bg-gray-100 flex items-center justify-center">
                {post.image_url ? (
                  <Image 
                    src={post.image_url} 
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <FileImage className="w-12 h-12 text-gray-300" />
                )}
              </div>
              <div className="p-6 md:p-8 flex flex-col flex-1 relative z-10 group-hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-2 text-mute mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {new Date(post.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-ink leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-mute text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                  {post.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm font-bold text-primary link-hover">Baca Selengkapnya</span>
                  <div className="w-10 h-10 rounded-full bg-surface-soft flex items-center justify-center text-ink group-hover:bg-primary group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {hasMore && (
        <div ref={ref} className="w-full flex justify-center mt-12 py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {!hasMore && posts.length > 0 && (
        <div className="w-full text-center mt-12 text-mute">
          Telah menampilkan semua {category}
        </div>
      )}
    </>
  );
}
