import { SectionTitle } from "@/components/ui/SectionTitle";

export function VideoSection() {
  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <SectionTitle>From the Channel</SectionTitle>
        <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
          Dive deeper into my creative process and learn new techniques with tutorials and behind-the-scenes content from my YouTube channel.
        </p>
        <div className="aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
}
