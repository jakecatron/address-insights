import { Amenity, AmenityCategory } from "@/types";

const CATEGORY_WEIGHTS: Record<AmenityCategory, number> = {
  transit: 3.0,
  park: 2.5,
  school: 2.0,
  restaurant: 1.5,
  cafe: 1.5,
  shop: 1.2,
  other: 1.0,
};

/**
 * Calculate a 0–100 score from a list of amenities.
 * We use a simple weighted count + diminishing returns.
 */
function calculateScore(amenities: Amenity[]): number {
  if (amenities.length === 0) return 12; // baseline for very sparse areas

  let weightedSum = 0;
  for (const amenity of amenities) {
    weightedSum += CATEGORY_WEIGHTS[amenity.category] ?? 1;
  }

  // Diminishing returns so the score doesn't jump to 100 too easily
  // Using a soft curve: score ≈ 100 * (1 - e^(-x/25))
  const raw = 100 * (1 - Math.exp(-weightedSum / 25));
  return Math.round(Math.min(100, Math.max(0, raw)));
}

// Calulates the community type (urban/suburban/rural) label for the insights page based on an array of walking and driving amenities
function getCommunityLabel(
  walkingAmenities: Amenity[],
  drivingAmenities: Amenity[]
): { index: number; label: "Urban" | "Suburban" | "Rural" } {
  const total = walkingAmenities.length + drivingAmenities.length * 0.35;

  // Rough commercial ratio
  const commercialCategories: AmenityCategory[] = [
    "restaurant",
    "cafe",
    "shop",
  ];
  const commercialCount = [...walkingAmenities, ...drivingAmenities].filter(
    (a) => commercialCategories.includes(a.category)
  ).length;

  const commercialRatio =
    total > 0 ? commercialCount / (walkingAmenities.length + drivingAmenities.length) : 0;

  let label: "Urban" | "Suburban" | "Rural";
  let index: number;

  if (total > 55 || (total > 35 && commercialRatio > 0.45)) {
    label = "Urban";
    index = Math.min(100, Math.round(60 + total * 0.5));
  } else if (total > 18) {
    label = "Suburban";
    index = Math.round(35 + total * 0.8);
  } else {
    label = "Rural";
    index = Math.round(Math.max(5, total * 1.8));
  }

  return { index: Math.min(100, index), label };
}

export interface ScoreResult {
  walkingScore: number;
  drivingScore: number;
  urbanSuburbanIndex: number;
  urbanSuburbanLabel: "Urban" | "Suburban" | "Rural";
}

// Calulates the scores for the insights page based on an array of walking and driving amenities
export function calculateInsightsScores(
  walkingAmenities: Amenity[],
  drivingAmenities: Amenity[]
): ScoreResult {
  const walkingScore = calculateScore(walkingAmenities);
  const drivingScore = calculateScore(drivingAmenities);
  const { index, label } = getCommunityLabel(
    walkingAmenities,
    drivingAmenities
  );

  return {
    walkingScore,
    drivingScore,
    urbanSuburbanIndex: index,
    urbanSuburbanLabel: label,
  };
}