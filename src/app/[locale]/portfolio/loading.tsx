// Kerangka sementara untuk halaman portofolio selagi data diambil. Juga menjadi batas Suspense
// yang dibutuhkan Cache Components karena halaman portofolio membaca params/koneksi saat request.
export default function PortfolioLoading() {
  return (
    <div aria-busy="true" className="bg-forest pt-36 pb-16 sm:pt-44">
      <div className="mx-auto max-w-7xl animate-pulse space-y-5 px-6">
        <div className="h-3 w-24 rounded-full bg-white/10" />
        <div className="h-10 w-2/3 rounded-2xl bg-white/10" />
        <div className="h-4 w-1/2 rounded-full bg-white/10" />
        <div className="grid grid-cols-1 gap-6 pt-10 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-72 rounded-3xl bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
