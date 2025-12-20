const HeroSection = () => {
  return (
    <section className="bg-hero-animated py-16 md:py-24">
      <div className="container">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out motion-reduce:animate-none">
            Insights on <span className="text-accent">Data</span>, AI & Business Intelligence
          </h1>
          <p
            className="text-lg md:text-xl text-white/80 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out motion-reduce:animate-none"
            style={{ animationDelay: "120ms" }}
          >
            Expert perspectives from BeamX Solutions on leveraging data to drive growth and innovation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
