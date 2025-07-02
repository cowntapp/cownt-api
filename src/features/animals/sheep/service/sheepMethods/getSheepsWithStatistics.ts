import SheepModel, { Sheep } from '../../model/sheep.model';
import {
  calculateBirthAverages,
  calculateOverallAverage,
} from '../utils/helpers';

import { SHEEP_MIN_PARENT_AGE_MONTHS } from '../../consts';
import { transformLeanDoc } from '../utils/transform';

interface SheepLeanDoc extends Omit<Sheep, '_id' | '__v'> {
  id: string;
}

interface SheepWithChildren extends Omit<Sheep, 'children'> {
  children: Sheep[];
}
interface SheepLeanDocWithChildren extends Omit<SheepLeanDoc, 'children'> {
  children: SheepLeanDoc[];
}
type ExtendedSheep = SheepLeanDocWithChildren & {
  birthAverageDays: number | null;
  lastIntervalDays: number | null;
  reproductiveIntervalDays: number | null;
};

export async function getSheepsWithStatistics(): Promise<{
  sheeps: ExtendedSheep[];
  averageOfAverages: number | null;
}> {
  // TODO: Afegir ovelles amb més de X dies de vida (diff entre today i dataNaix > X days) sense parts i avisar
  //   Ens servirà per avisar que una ovella sense parts que hauria d'haver parit encara no ho ha fet
  //   Ja que al front de moment només enviem ovelles amb 1 o més parts

  // ---------------------------------------------------------------
  // 1. Query: female sheeps with at least one child and no absence flag
  // ---------------------------------------------------------------
  const sheeps = await SheepModel.find({
    children: { $exists: true },
    absence: null,
    sex: 'f',
  })
    .populate('children', 'birthDate')
    .lean<SheepWithChildren[]>();

  const results: ExtendedSheep[] = [];
  const validAverages: number[] = [];
  const nowTs = Date.now();
  const msPerMonth = 1000 * 60 * 60 * 24 * 30;
  const minParentAgeMs = SHEEP_MIN_PARENT_AGE_MONTHS * msPerMonth;

  // ---------------------------------------------------------------
  // 2. Iterate: apply calculation helpers per sheep
  // ---------------------------------------------------------------
  for (const rawSheep of sheeps) {
    const sheep = transformLeanDoc(rawSheep);
    const children = sheep.children.map((child) => transformLeanDoc(child));

    if (children.length > 0) {
      // Extract and sort birth timestamps
      const birthTimestamps = children
        .map((child) => Number(child.birthDate))
        .sort((a, b) => a - b);

      // Use pure function to get stats
      const { overallAverageDays, lastIntervalDays } =
        calculateBirthAverages(birthTimestamps);

      // Collect enriched sheep record
      results.push({
        ...sheep,
        children,
        birthAverageDays: overallAverageDays,
        lastIntervalDays,
        reproductiveIntervalDays: null,
      } as ExtendedSheep);

      // Track non-null averages for final aggregate
      if (overallAverageDays !== null) {
        validAverages.push(overallAverageDays);
      }
    } else {
      const birthDateTs = Number(sheep.birthDate);
      const ageMs = nowTs - birthDateTs;

      if (ageMs > minParentAgeMs) {
        const sinceThresholdMs = ageMs - minParentAgeMs;
        const reproductiveIntervalDays = Math.round(
          sinceThresholdMs / (1000 * 60 * 60 * 24)
        );

        results.push({
          ...sheep,
          children: [] as SheepLeanDoc[],
          birthAverageDays: null,
          lastIntervalDays: null,
          reproductiveIntervalDays,
        } as ExtendedSheep);
      }
    }
  }

  // ---------------------------------------------------------------
  // 3. Compute final aggregate average across sheeps
  // ---------------------------------------------------------------
  const averageOfAverages = calculateOverallAverage(validAverages);

  return { sheeps: results, averageOfAverages };
}
