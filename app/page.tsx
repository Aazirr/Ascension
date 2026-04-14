export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-4xl rounded-2xl border border-white/10 bg-black/20 p-8 backdrop-blur-sm md:p-12">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-300/80">
          Ascension Portfolio
        </p>
        <h1 className="mt-4 text-4xl font-bold text-white md:text-6xl">
          Cosmic Neural Network
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200/85 md:text-lg">
          Foundation is complete. Next step is building the mobile fallback
          experience, then wiring device and motion gates before the 3D scene.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full border border-[#1D9E75]/60 bg-[#1D9E75]/15 px-3 py-1">
            Projects
          </span>
          <span className="rounded-full border border-[#378ADD]/60 bg-[#378ADD]/15 px-3 py-1">
            Skills
          </span>
          <span className="rounded-full border border-[#D85A30]/60 bg-[#D85A30]/15 px-3 py-1">
            Experience
          </span>
          <span className="rounded-full border border-[#888780]/60 bg-[#888780]/20 px-3 py-1">
            About
          </span>
        </div>
      </section>
    </main>
  );
}
