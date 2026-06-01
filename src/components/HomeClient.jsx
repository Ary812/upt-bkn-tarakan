"use client";

import HeroSlider from "./HeroSlider";
import NewsGrid from "./NewsGrid";

export default function HomeClient({ heroSlides, latestNews }) {
  return (
    <div className="w-full">
      <HeroSlider slides={heroSlides} />
      <NewsGrid latestNews={latestNews} />
    </div>
  );
}
