import AddressSearch from "@/components/AddressSearch";
import SearchHistory from "@/components/SearchHistory";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 pt-28 pb-20">
      <div className="mb-12 max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center rounded-full border border-[#ff4f00]/20 bg-[#ff4f00]/5 px-3 py-1 text-xs font-medium text-[#ff4f00]">
          Address Insights
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-[#1a1a1a] sm:text-5xl">
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