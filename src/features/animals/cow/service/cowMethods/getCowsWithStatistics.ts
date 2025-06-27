import CowModel, { Cow } from '../../model/cow.model';
import {
  calculateBirthAverages,
  calculateOverallAverage,
} from '../utils/helpers';

import { COW_MIN_PARENT_AGE_MONTHS } from '../../consts';
import { transformLeanDoc } from '../utils/transform';

interface CowLeanDoc extends Omit<Cow, '_id' | '__v'> {
  id: string;
}

interface CowWithChildren extends Omit<Cow, 'children'> {
  children: Cow[];
}
interface CowLeanDocWithChildren extends Omit<CowLeanDoc, 'children'> {
  children: CowLeanDoc[];
}
type ExtendedCow = CowLeanDocWithChildren & {
  birthAverageDays: number | null;
  lastIntervalDays: number | null;
  reproductiveIntervalDays: number | null;
};

export async function getCowsWithStatistics(): Promise<{
  cows: ExtendedCow[];
  averageOfAverages: number | null;
}> {
  // TODO: Afegir vaques amb més de X dies de vida (diff entre today i dataNaix > X days) sense parts i avisar
  //   Ens servirà per avisar que una vaca sense parts que hauria d'haver parit encara no ho ha fet
  //   Ja que al front de moment només enviem vaques amb 1 o més parts

  // ---------------------------------------------------------------
  // 1. Query: female cows with at least one child and no absence flag
  // ---------------------------------------------------------------
  const cows = await CowModel.find({
    children: { $exists: true },
    absence: null,
    sex: 'f',
  })
    .populate('children', 'birthDate')
    .lean<CowWithChildren[]>();

  const results: ExtendedCow[] = [];
  const validAverages: number[] = [];
  const nowTs = Date.now();
  const msPerMonth = 1000 * 60 * 60 * 24 * 30;
  const minParentAgeMs = COW_MIN_PARENT_AGE_MONTHS * msPerMonth;

  // ---------------------------------------------------------------
  // 2. Iterate: apply calculation helpers per cow
  // ---------------------------------------------------------------
  for (const rawCow of cows) {
    const cow = transformLeanDoc(rawCow);
    const children = cow.children.map((child) => transformLeanDoc(child));

    if (children.length > 0) {
      // Extract and sort birth timestamps
      const birthTimestamps = children
        .map((child) => Number(child.birthDate))
        .sort((a, b) => a - b);

      // Use pure function to get stats
      const { overallAverageDays, lastIntervalDays } =
        calculateBirthAverages(birthTimestamps);

      // Collect enriched cow record
      results.push({
        ...cow,
        children,
        birthAverageDays: overallAverageDays,
        lastIntervalDays,
        reproductiveIntervalDays: null,
      } as ExtendedCow);

      // Track non-null averages for final aggregate
      if (overallAverageDays !== null) {
        validAverages.push(overallAverageDays);
      }
    } else {
      const birthDateTs = Number(cow.birthDate);
      const ageMs = nowTs - birthDateTs;

      if (ageMs > minParentAgeMs) {
        const sinceThresholdMs = ageMs - minParentAgeMs;
        const reproductiveIntervalDays = Math.round(
          sinceThresholdMs / (1000 * 60 * 60 * 24)
        );

        results.push({
          ...cow,
          children: [] as CowLeanDoc[],
          birthAverageDays: null,
          lastIntervalDays: null,
          reproductiveIntervalDays,
        } as ExtendedCow);
      }
    }
  }

  // ---------------------------------------------------------------
  // 3. Compute final aggregate average across cows
  // ---------------------------------------------------------------
  const averageOfAverages = calculateOverallAverage(validAverages);

  return { cows: results, averageOfAverages };
}
