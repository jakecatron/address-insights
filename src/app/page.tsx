import AddressSearch from "@/components/AddressSearch";
import SearchHistory from "@/components/SearchHistory";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 pt-28 pb-20">
      <div className="mb-12 max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 mb-2 rounded-full border border-[#d8dbe2] bg-white px-4 py-1.5 shadow-[0_2px_4px_rgba(26,35,50,0.04)]">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#FF4F00]" />
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] font-medium tracking-[0.02em] text-[#3a3f4f]">
            Address Insights
          </span>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-[#1a1a1a] sm:text-6xl">
          Know the neighborhood
          <span className="text-[#ff4f00]"> instantly</span>
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          Walking score, driving score, and urban character for any street
          address — built for faster property decisions.
        </p>
      </div>

      <AddressSearch />
      <SearchHistory />
    </main>
  );
}