import { describe, it, expect } from "vitest";
import { calculateInsightsScores } from "./scores";
import type { Amenity } from "@/types";

// Minimal amenity factory – only category is used by the scoring logic
const amenity = (category: Amenity["category"]): Amenity =>
  ({ category } as Amenity);

describe("calculateInsightsScores", () => {
  it("returns baseline scores when there are no amenities", () => {
    const result = calculateInsightsScores([], []);

    expect(result.walkingScore).toBe(12);
    expect(result.drivingScore).toBe(12);
    expect(result.urbanSuburbanLabel).toBe("Rural");
    expect(result.urbanSuburbanIndex).toBeGreaterThanOrEqual(5);
  });

  it("gives higher scores when more weighted amenities are present", () => {
    const sparse = [amenity("other"), amenity("other")];
    const rich = [
      amenity("transit"),
      amenity("transit"),
      amenity("park"),
      amenity("school"),
      amenity("restaurant"),
      amenity("cafe"),
    ];

    const sparseResult = calculateInsightsScores(sparse, sparse);
    const richResult = calculateInsightsScores(rich, rich);

    expect(richResult.walkingScore).toBeGreaterThan(sparseResult.walkingScore);
    expect(richResult.drivingScore).toBeGreaterThan(sparseResult.drivingScore);
  });

  it("never returns scores outside 0–100", () => {
    const many = Array.from({ length: 40 }, () => amenity("transit"));
    const result = calculateInsightsScores(many, many);

    expect(result.walkingScore).toBeGreaterThanOrEqual(0);
    expect(result.walkingScore).toBeLessThanOrEqual(100);
    expect(result.drivingScore).toBeGreaterThanOrEqual(0);
    expect(result.drivingScore).toBeLessThanOrEqual(100);
    expect(result.urbanSuburbanIndex).toBeGreaterThanOrEqual(0);
    expect(result.urbanSuburbanIndex).toBeLessThanOrEqual(100);
  });

  it("classifies high density + commercial mix as Urban", () => {
    const walking = Array.from({ length: 30 }, () => amenity("restaurant"));
    const driving = Array.from({ length: 30 }, () => amenity("shop"));

    const result = calculateInsightsScores(walking, driving);

    expect(result.urbanSuburbanLabel).toBe("Urban");
    expect(result.urbanSuburbanIndex).toBeGreaterThan(50);
  });

  it("classifies moderate density as Suburban", () => {
    const walking = Array.from({ length: 16 }, () => amenity("park"));
    const driving = Array.from({ length: 12 }, () => amenity("school"));
  
    const result = calculateInsightsScores(walking, driving);
  
    expect(result.urbanSuburbanLabel).toBe("Suburban");
  });

  it("classifies very low density as Rural", () => {
    const walking = [amenity("other")];
    const driving = [amenity("other")];

    const result = calculateInsightsScores(walking, driving);

    expect(result.urbanSuburbanLabel).toBe("Rural");
  });
});