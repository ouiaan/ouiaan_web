import { Hero } from "@/components/home/Hero";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { ShowcaseSection } from "@/components/home/ShowcaseSection";
import { VideoSection } from "@/components/home/VideoSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ShowcaseSection />
      <FeaturedWork />
      <VideoSection />
    </div>
  );
}
