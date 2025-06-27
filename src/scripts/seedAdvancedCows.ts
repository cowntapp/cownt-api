// ─── IMPORTS Y UTILIDADES ─────────────────────────────────────────────────────

import { addMonths, differenceInMonths } from './dateUtils'; // o dayjs/plugin/customParseFormat
import mongoose, { Types } from 'mongoose';
import { pickRandom, pickRandomMany, randomInt } from './utils';

import CowModel from '../features/animals/cow/model/cow.model';
import connectDB from '../config/db';
import { SEX, ORIGIN, ABSENCE } from '../features/animals/animalsConsts';
import {
  COW_MIN_PARENT_AGE_MONTHS,
  COW_SHORT_CODE_LAST_CHARS_NUM,
} from '../features/animals/cow/consts';

interface Cow {
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
const charCoixera = new Types.ObjectId('67db3e158f0cd15fbf235583');
const charMalCaracter = new Types.ObjectId('67dc0e98d58885ca877e6a0a');
const charMalaLlet = new Types.ObjectId('67dc0ec2d58885ca877e6a0b');
const charBerguerGros = new Types.ObjectId('67dc0eead58885ca877e6a0c');
const CHARACTERISTICS = [
  charCoixera,
  charMalCaracter,
  charMalaLlet,
  charBerguerGros,
];

// IDs reales de razas disponibles
const breedCreuada = new Types.ObjectId('67db806a5c3ac17f8dc736b3');
const breedLlimosina = new Types.ObjectId('67dc0de2d58885ca877e6a07');
const breedSalers = new Types.ObjectId('67dc0e65d58885ca877e6a08');
const breedXarolesa = new Types.ObjectId('67dc0e73d58885ca877e6a09');
const BREEDS = [breedCreuada, breedLlimosina, breedSalers, breedXarolesa];

// ─── PARÁMETROS DE CONFIGURACIÓN ──────────────────────────────────────────────

const TOTAL_COWS = 120;
const INITIAL_BOUGHT = 20; // nº de vacas “fundacionales”
const MIN_FUNDATIONAL_BIRTH = 16; // años atras
const MAX_FUNDATIONAL_BIRTH = 18; // años atras
const MIN_BIRTH_INTERVAL = 10; // meses
const MAX_BIRTH_INTERVAL = 18; // meses
const MIN_WEIGHT = 40; // kg
const MAX_WEIGHT = 100; // kg
const MIN_PRICE = 800; // €
const MAX_PRICE = 1200; // €
const MIN_PARENT_AGE_MONTHS = COW_MIN_PARENT_AGE_MONTHS; // meses de vida para considerarse vacas con edat reproductiva

// ─── FUNCIÓN PRINCIPAL ────────────────────────────────────────────────────────

export async function seedCowsDynamic() {
  // 1️⃣ FASE 1: Crear vacas compradas “fundacionales”

  const mothersPool: Cow[] = []; // lista de candidatas a madre
  const allCows: Cow[] = []; // array donde guardaremos todas las vacas

  for (let i = 0; i < INITIAL_BOUGHT; i++) {
    const cow: Cow = {
      _id: new Types.ObjectId(),
      longCode: `COW${String(i + 1).padStart(10, '0')}`,
      shortCode: `COW${String(i + 1).padStart(10, '0')}`.slice(
        -COW_SHORT_CODE_LAST_CHARS_NUM
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
    allCows.push(cow);
    // Solo hembras adultas entran en el pool de madres
    if (cow.sex === SEX.F) mothersPool.push(cow);
  }

  // 2️⃣ FASE 2: Generar descendencia hasta TOTAL_COWS

  let idx = INITIAL_BOUGHT;
  while (allCows.length < TOTAL_COWS) {
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
      const child = allCows.find((c) => c._id.equals(childId));
      return new Date(Number(child!.birthDate));
    });
    const baseDate =
      lastChildDates.length > 0
        ? new Date(Math.max(...lastChildDates.map((d) => d.getTime())))
        : addMonths(new Date(Number(mother.birthDate)), MIN_PARENT_AGE_MONTHS);

    // 2.3 Generar fecha de nacimiento del nuevo ternero
    const interval = randomInt(MIN_BIRTH_INTERVAL, MAX_BIRTH_INTERVAL);
    const birthDate = addMonths(baseDate, interval);

    // 2.4 Construir objeto vaca “nacida”
    const calf: Cow = {
      _id: new Types.ObjectId(),
      longCode: `COW${String(++idx).padStart(10, '0')}`,
      shortCode: `COW${String(idx).padStart(10, '0')}`.slice(
        -COW_SHORT_CODE_LAST_CHARS_NUM
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
    allCows.push(calf);
    mother.children.push(calf._id);
    if (calf.sex === SEX.F) mothersPool.push(calf);
  }

  // 4️⃣ LIMPIAR DB
  // await connectDB();
  await CowModel.deleteMany({}); // limpiar colección

  // 3️⃣ INSERTAR EN BD
  await CowModel.insertMany(allCows);
  console.log(`Seed completado: ${allCows.length} vacas generadas.`);
  // await mongoose.disconnect();
}
