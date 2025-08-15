export function Hero() {
  return (
    <section className="relative h-[calc(100vh-5rem)] w-full overflow-hidden">
      {/* Video Background Placeholder */}
      <div className="absolute top-0 left-0 w-full h-full bg-black z-0">
        {/* In a real application, a <video> tag would go here. */}
        {/* e.g., <video autoPlay loop muted className="w-full h-full object-cover" src="/path/to/video.mp4" /> */}
        <div className="w-full h-full object-cover bg-black" />
      </div>
      
      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center text-center text-white">
        <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter">
          Ouiaan
        </h1>
        <p className="mt-4 text-lg md:text-xl text-foreground/80 font-body">
          Digital assets for the modern creator.
        </p>
      </div>
    </section>
  );
}
