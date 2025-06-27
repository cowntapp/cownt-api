/**
 * Calculate birth intervals and averages for a sequence of birth timestamps.
 * Completely isolated from DB logic for unit testing.
 *
 * Steps:
 * 1. Handle edge cases: no births or single birth.
 * 2. Compute last interval (time since most recent birth).
 * 3. Compute intervals between consecutive births.
 * 4. Calculate preliminary average and include last interval if it's larger.
 * 5. Derive final overall average and per-interval values in days.
 *
 * @param {number[]} birthTimestamps Sorted array of child birth timestamps (ms since epoch).
 * @param {number} [referenceTimestamp=Date.now()] Timestamp to use as "now" for last interval.
 * @returns {{
 *   birthIntervalsDays: number[],   // Each interval length in days (incl. last if > avg)
 *   lastIntervalDays: number,       // Days since the most recent birth
 *   overallAverageDays: number|null // Rounded average across all intervals, or null if <2 births
 * }}
 */
export function calculateBirthAverages(
  birthTimestamps: number[],
  referenceTimestamp: number = Date.now()
): {
  birthIntervalsDays: number[]; // Each interval length in days (incl. last if > avg)
  lastIntervalDays: number; // Days since the most recent birth
  overallAverageDays: number | null; // Rounded average across all intervals, or null if <2 births
} {
  // ---------------------------------------------------------------------------
  // 1. Edge cases: no births or only one birth
  // ---------------------------------------------------------------------------
  if (birthTimestamps.length === 0) {
    // No data at all
    return {
      birthIntervalsDays: [],
      lastIntervalDays: 0,
      overallAverageDays: null,
    };
  }

  // Always compute last interval: time since the most recent birth
  const lastBirthTs = birthTimestamps[birthTimestamps.length - 1];
  const lastIntervalMs = referenceTimestamp - lastBirthTs;
  const lastIntervalDays = Math.round(lastIntervalMs / (1000 * 60 * 60 * 24));

  if (birthTimestamps.length === 1) {
    // With only one birth, no average intervals to compute
    return {
      birthIntervalsDays: [],
      lastIntervalDays,
      overallAverageDays: null,
    };
  }

  // ---------------------------------------------------------------------------
  // 2. Compute differences between consecutive births
  // ---------------------------------------------------------------------------
  const diffs: number[] = [];
  for (let i = 1; i < birthTimestamps.length; i++) {
    diffs.push(birthTimestamps[i] - birthTimestamps[i - 1]);
  }

  // ---------------------------------------------------------------------------
  // 3. Sum diffs and count intervals for preliminary average
  // ---------------------------------------------------------------------------
  let sumMs = diffs.reduce((sum, delta) => sum + delta, 0);
  let count = diffs.length;
  const preliminaryAvgMs = sumMs / count;

  // ---------------------------------------------------------------------------
  // 4. Include last interval if it exceeds the preliminary average
  // ---------------------------------------------------------------------------
  if (lastIntervalMs > preliminaryAvgMs) {
    sumMs += lastIntervalMs;
    count++;
  }

  // ---------------------------------------------------------------------------
  // 5. Compute final overall average in days
  // ---------------------------------------------------------------------------
  const finalAvgMs = sumMs / count;
  const overallAverageDays = Math.round(finalAvgMs / (1000 * 60 * 60 * 24));

  // ---------------------------------------------------------------------------
  // 6. Build per-interval day values for insight
  // ---------------------------------------------------------------------------
  const birthIntervalsDays = diffs.map((delta) =>
    Math.round(delta / (1000 * 60 * 60 * 24))
  );
  if (lastIntervalMs > preliminaryAvgMs) {
    birthIntervalsDays.push(lastIntervalDays);
  }

  return { birthIntervalsDays, lastIntervalDays, overallAverageDays };
}

/**
 * Calculate the rounded average of an array of numbers.
 * Utility helper abstracted from service logic for testability.
 *
 * @param {number[]} values Numeric array to average.
 * @returns {number|null} Rounded average, or null if input is empty.
 */
export function calculateOverallAverage(values: number[]): number | null {
  // No values means no average to return
  if (values.length === 0) {
    return null;
  }

  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / values.length);
}
