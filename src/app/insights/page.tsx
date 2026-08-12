import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ScoreCard from "@/components/ScoreCard";
import MapWrapper from "@/components/MapWrapper";
import { geocodeAddress } from "@/lib/geocode";
import { fetchNearbyAmenities } from "@/lib/places";
import { calculateInsightsScores } from "@/lib/scores";
import SaveToHistory from "@/components/SaveToHistory";

interface InsightsPageProps {
  searchParams: Promise<{ address?: string }>;
}

export default async function InsightsPage({ searchParams }: InsightsPageProps) {
  const { address } = await searchParams;

  if (!address) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">No address provided.</p>
          <Link
            href="/"
            className="mt-4 inline-block text-[#FF4F00] hover:underline"
          >
            ← Back to search
          </Link>
        </div>
      </main>
    );
  }

  const decodedAddress = decodeURIComponent(address);
  const geo = await geocodeAddress(decodedAddress);

  if (!geo) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg text-gray-600">
            Could not find that address. Try a more specific one.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-[#FF4F00] hover:underline"
          >
            ← Back to search
          </Link>
        </div>
      </main>
    );
  }

  const { walkingAmenities, drivingAmenities } = await fetchNearbyAmenities(
    geo.lat,
    geo.lon
  );

  const scores = calculateInsightsScores(walkingAmenities, drivingAmenities);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <SaveToHistory
          address={geo.displayName}
          lat={geo.lat}
          lon={geo.lon}
        />

        <div className="mb-8">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#FF4F00]"
          >
            <ArrowLeft size={16} />
            New search
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {geo.displayName}
          </h1>
          <p className="mt-1 text-[#ff4f00]">Address insights</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <ScoreCard
            title="Walking Score"
            score={scores.walkingScore}
            subtitle="Amenities within ~0.5 mile"
          />
          <ScoreCard
            title="Driving Score"
            score={scores.drivingScore}
            subtitle="Amenities within ~2 miles"
          />
          <ScoreCard
            title="Address Type"
            score={scores.urbanSuburbanLabel}
            subtitle={`Index: ${scores.urbanSuburbanIndex}`}
          />
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <MapWrapper
            lat={geo.lat}
            lon={geo.lon}
            address={geo.displayName}
            walkingAmenities={walkingAmenities}
            drivingAmenities={drivingAmenities}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">How these scores work</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Scores are simple heuristics based on the number and type of nearby
            amenities (restaurants, shops, parks, transit, schools, etc.).
            Walking uses a smaller radius (~800 m). Driving uses a larger radius
            (~3 km). The Address Type label is derived from overall density and
            the mix of commercial amenities.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Found {walkingAmenities.length} amenities in walking range and{" "}
            {drivingAmenities.length} in driving range.
          </p>
        </div>
      </div>
    </main>
  );
}