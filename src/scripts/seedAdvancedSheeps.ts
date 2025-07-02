// ─── IMPORTS Y UTILIDADES ─────────────────────────────────────────────────────

import { addMonths, differenceInMonths } from './dateUtils'; // o dayjs/plugin/customParseFormat
import mongoose, { Types } from 'mongoose';
import { pickRandom, pickRandomMany, randomInt } from './utils';

import connectDB from '../config/db';
import { SEX, ORIGIN, ABSENCE } from '../features/animals/animalsConsts';
import {
  SHEEP_MIN_PARENT_AGE_MONTHS,
  SHEEP_SHORT_CODE_LAST_CHARS_NUM,
} from '../features/animals/sheep/consts';
import SheepModel from '../features/animals/sheep/model/sheep.model';

interface Sheep {
  _id: Types.ObjectId;
  longCode: string;
  shortCode: string;
  breed: Types.ObjectId;
  sex: SEX;
  birthDate: string | null;
  weight: string | null;
  origin: ORIGIN;
  buyPrice: number | null;
  salePrice: number | null;
  absence: ABSENCE | null;
  characteristics: Types.ObjectId[];
  mother: Types.ObjectId | null;
  children: Types.ObjectId[];
}

// ─── CONSTS ────────────────────────────────────────────────────────────────────

// IDs reales de caracteres disponibles
const charResistent = new Types.ObjectId('6864e44ab4d97e624a792dda');
const charProductoraLlana = new Types.ObjectId('6864e46db4d97e624a792ddc');
const charBonaMare = new Types.ObjectId('6864e488b4d97e624a792ddd');
const charPeuPodrit = new Types.ObjectId('6864e4adb4d97e624a792dde');
const charConversioFarratge = new Types.ObjectId('6864e4f1b4d97e624a792ddf');

const CHARACTERISTICS = [
  charResistent,
  charProductoraLlana,
  charBonaMare,
  charPeuPodrit,
  charConversioFarratge,
];

// IDs reales de razas disponibles
const breedRipollesa = new Types.ObjectId('6864e2d5b4d97e624a792dd7');
const breedMerina = new Types.ObjectId('6864e303b4d97e624a792dd8');
const breedAssaf = new Types.ObjectId('6864e312b4d97e624a792dd9');
const BREEDS = [breedRipollesa, breedMerina, breedAssaf];

// ─── PARÁMETROS DE CONFIGURACIÓN ──────────────────────────────────────────────

const TOTAL_SHEEPS = 120;
const INITIAL_BOUGHT = 20; // nº de ovejas “fundacionales”
const MIN_FUNDATIONAL_BIRTH = 16; // años atras
const MAX_FUNDATIONAL_BIRTH = 18; // años atras
const MIN_BIRTH_INTERVAL = 10; // meses
const MAX_BIRTH_INTERVAL = 18; // meses
const MIN_WEIGHT = 40; // kg
const MAX_WEIGHT = 100; // kg
const MIN_PRICE = 800; // €
const MAX_PRICE = 1200; // €
const MIN_PARENT_AGE_MONTHS = SHEEP_MIN_PARENT_AGE_MONTHS; // meses de vida para considerarse ovejas con edat reproductiva

// ─── FUNCIÓN PRINCIPAL ────────────────────────────────────────────────────────

export async function seedSheepsDynamic() {
  // 1️⃣ FASE 1: Crear ovejas compradas “fundacionales”

  const mothersPool: Sheep[] = []; // lista de candidatas a madre
  const allSheeps: Sheep[] = []; // array donde guardaremos todas las ovejas

  for (let i = 0; i < INITIAL_BOUGHT; i++) {
    const sheep: Sheep = {
      _id: new Types.ObjectId(),
      longCode: `SHEEP${String(i + 1).padStart(10, '0')}`,
      shortCode: `SHEEP${String(i + 1).padStart(10, '0')}`.slice(
        -SHEEP_SHORT_CODE_LAST_CHARS_NUM
      ),
      breed: pickRandom(BREEDS),
      sex: pickRandom([SEX.M, SEX.F]),
      birthDate: String(
        new Date(
          Date.now() -
            randomInt(
              MIN_FUNDATIONAL_BIRTH * 12 * 30,
              MAX_FUNDATIONAL_BIRTH * 12 * 30
            ) *
              24 *
              3600 *
              1000
        ).getTime()
      ),
      weight: String(randomInt(MIN_WEIGHT, MAX_WEIGHT)),
      origin: ORIGIN.BOUGHT,
      buyPrice: randomInt(MIN_PRICE, MAX_PRICE),
      salePrice: null,
      // absence: pickRandom([null, ABSENCE.DEAD, ABSENCE.SOLD]),
      absence: null,
      characteristics: pickRandomMany(CHARACTERISTICS, randomInt(0, 3)),
      mother: null,
      children: [],
    };
    allSheeps.push(sheep);
    // Solo hembras adultas entran en el pool de madres
    if (sheep.sex === SEX.F) mothersPool.push(sheep);
  }

  // 2️⃣ FASE 2: Generar descendencia hasta TOTAL_SHEEPS

  let idx = INITIAL_BOUGHT;
  while (allSheeps.length < TOTAL_SHEEPS) {
    // 2.1 Elegir madre aleatoria con edad mínima
    const possibleMothers = mothersPool.filter((m) => {
      const ageMonths = differenceInMonths(
        new Date(),
        new Date(Number(m.birthDate))
      );
      return ageMonths >= MIN_PARENT_AGE_MONTHS;
    });
    const mother = pickRandom(possibleMothers);

    // 2.2 Calcular fecha de último parto de esa madre
    const lastChildDates = mother.children.map((childId: Types.ObjectId) => {
      const child = allSheeps.find((c) => c._id.equals(childId));
      return new Date(Number(child!.birthDate));
    });
    const baseDate =
      lastChildDates.length > 0
        ? new Date(Math.max(...lastChildDates.map((d) => d.getTime())))
        : addMonths(new Date(Number(mother.birthDate)), MIN_PARENT_AGE_MONTHS);

    // 2.3 Generar fecha de nacimiento del nuevo ternero
    const interval = randomInt(MIN_BIRTH_INTERVAL, MAX_BIRTH_INTERVAL);
    const birthDate = addMonths(baseDate, interval);

    // 2.4 Construir objeto oveja “nacida”
    const calf: Sheep = {
      _id: new Types.ObjectId(),
      longCode: `SHEEP${String(++idx).padStart(10, '0')}`,
      shortCode: `SHEEP${String(idx).padStart(10, '0')}`.slice(
        -SHEEP_SHORT_CODE_LAST_CHARS_NUM
      ),
      breed: pickRandom(BREEDS),
      sex: pickRandom([SEX.M, SEX.F]),
      birthDate: String(birthDate.getTime()),
      weight: String(randomInt(MIN_WEIGHT, MAX_WEIGHT)),
      origin: ORIGIN.BORN,
      buyPrice: null,
      salePrice: null,
      // absence: pickRandom([null, ABSENCE.DEAD, ABSENCE.SOLD]),
      absence: null,
      characteristics: pickRandomMany(CHARACTERISTICS, randomInt(0, 3)),
      mother: mother._id,
      children: [],
    };

    // 2.5 Actualizar arrays y pools
    allSheeps.push(calf);
    mother.children.push(calf._id);
    if (calf.sex === SEX.F) mothersPool.push(calf);
  }

  // 4️⃣ LIMPIAR DB
  await SheepModel.deleteMany({}); // limpiar colección

  // 3️⃣ INSERTAR EN BD
  await SheepModel.insertMany(allSheeps);
  console.log(`Seed completado: ${allSheeps.length} ovejas generadas.`);
  return;
}
