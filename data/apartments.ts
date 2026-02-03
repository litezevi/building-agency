import { FloorPlan, Section } from "@/types/apartment";

const PRICE_PER_SQM = 130000; // ₽ за м²

// Маппинг изображений чертежей к секциям
export const sectionImages: Record<Section, { firstFloor: string; typicalFloor: string }> = {
  "1": { firstFloor: "/schemaImages/Plan zdaniya-01.png", typicalFloor: "/schemaImages/Plan zdaniya-02.png" },
  "2": { firstFloor: "/schemaImages/Plan zdaniya-03.png", typicalFloor: "/schemaImages/Plan zdaniya-04.png" },
  "3": { firstFloor: "/schemaImages/Plan zdaniya-07.png", typicalFloor: "/schemaImages/Plan zdaniya-08.png" },
  "4": { firstFloor: "/schemaImages/Plan zdaniya-05.png", typicalFloor: "/schemaImages/Plan zdaniya-06.png" },
  "5": { firstFloor: "/schemaImages/Plan zdaniya-05.png", typicalFloor: "/schemaImages/Plan zdaniya-06.png" },
  "6": { firstFloor: "/schemaImages/Plan zdaniya-09.png", typicalFloor: "/schemaImages/Plan zdaniya-10.png" },
  "7": { firstFloor: "/schemaImages/Plan zdaniya-11.png", typicalFloor: "/schemaImages/Plan zdaniya-12.png" },
  "8": { firstFloor: "/schemaImages/Plan zdaniya-13.png", typicalFloor: "/schemaImages/Plan zdaniya-14.png" },
  "9": { firstFloor: "/schemaImages/Plan zdaniya-15.png", typicalFloor: "/schemaImages/Plan zdaniya-16.png" },
  "10": { firstFloor: "/schemaImages/Plan zdaniya-17.png", typicalFloor: "/schemaImages/Plan zdaniya-18.png" },
  "11": { firstFloor: "/schemaImages/Plan zdaniya-19.png", typicalFloor: "/schemaImages/Plan zdaniya-20.png" },
  "12": { firstFloor: "/schemaImages/Plan zdaniya-21.png", typicalFloor: "/schemaImages/Plan zdaniya-22.png" },
};

// Площади квартир по типам (из реальных чертежей)
const APARTMENT_TYPES = {
  // 2-комнатные квартиры
  "2А-81": { rooms: 2, area: 81.33, livingArea: 43.31, kitchenArea: 15.85 },
  "2Б-74": { rooms: 2, area: 74.45, livingArea: 42.65, kitchenArea: 14.72 },
  "2В-75": { rooms: 2, area: 75.57, livingArea: 43.89, kitchenArea: 15.00 },
  "2Г-74": { rooms: 2, area: 74.60, livingArea: 40.39, kitchenArea: 14.81 },
  "2Д-81": { rooms: 2, area: 81.57, livingArea: 44.12, kitchenArea: 15.50 },
  "2Е-80": { rooms: 2, area: 80.52, livingArea: 42.85, kitchenArea: 15.20 },
  // 1-комнатные квартиры
  "1А-45": { rooms: 1, area: 45.93, livingArea: 33.62, kitchenArea: 14.81 },
  "1Б-53": { rooms: 1, area: 53.71, livingArea: 38.45, kitchenArea: 15.32 },
} as const;

type ApartmentTypeKey = keyof typeof APARTMENT_TYPES;

// Генерация ID квартиры
function generateId(section: Section, floor: number, number: string): string {
  return `${section}-${floor}-${number}`;
}

// Расчёт цены
function calculatePrice(area: number): number {
  return Math.round(area * PRICE_PER_SQM);
}

// Создание одной квартиры
function createApartment(
  section: Section,
  floor: number,
  number: string,
  typeKey: ApartmentTypeKey
): (typeof APARTMENT_TYPES)[ApartmentTypeKey] & {
  id: string;
  number: string;
  floor: number;
  price: number;
  status: "free" | "sold";
  section: Section;
  apartmentClass: "А" | "Б" | "В" | "Г";
} {
  const type = APARTMENT_TYPES[typeKey];
  return {
    ...type,
    id: generateId(section, floor, number),
    number,
    floor,
    price: calculatePrice(type.area),
    status: "free" as const, // Все квартиры свободны
    section,
    apartmentClass: typeKey.includes("А") ? "А" : typeKey.includes("Б") ? "Б" : typeKey.includes("В") ? "В" : "Г",
  };
}

// План этажа для узкой секции (5 квартир: 2 x 2-комн + 1 x 1-комн)
function createNarrowSectionFloor(section: Section, floor: number, firstFloor: boolean): FloorPlan {
  const apartments = [];
  
  if (firstFloor) {
    // Первый этаж: 5 квартир по реальному плану
    apartments.push(createApartment(section, floor, "1", "2А-81"));
    apartments.push(createApartment(section, floor, "2", "2Г-74"));
    apartments.push(createApartment(section, floor, "3", "2В-75"));
    apartments.push(createApartment(section, floor, "4", "1А-45"));
    apartments.push(createApartment(section, floor, "5", "2Г-74"));
  } else {
    // Типовые этажи: 5 квартир
    apartments.push(createApartment(section, floor, "1", "2А-81"));
    apartments.push(createApartment(section, floor, "2", "2Б-74"));
    apartments.push(createApartment(section, floor, "3", "2В-75"));
    apartments.push(createApartment(section, floor, "4", "1А-45"));
    apartments.push(createApartment(section, floor, "5", "2Г-74"));
  }
  
  return { floor, section, apartments };
}

// План этажа для широкой секции (6 квартир: 2 x 2-комн + 4 x 1-комн)
function createWideSectionFloor(section: Section, floor: number, firstFloor: boolean): FloorPlan {
  const apartments = [];

  if (firstFloor) {
    // Первый этаж: 6 квартир по реальному плану
    apartments.push(createApartment(section, floor, "1", "2Д-81"));
    apartments.push(createApartment(section, floor, "2", "1Б-53"));
    apartments.push(createApartment(section, floor, "3", "1Б-53"));
    apartments.push(createApartment(section, floor, "4", "2Е-80"));
    apartments.push(createApartment(section, floor, "5", "2Г-74"));
    apartments.push(createApartment(section, floor, "6", "1Б-53"));
  } else {
    // Типовые этажи: 6 квартир
    apartments.push(createApartment(section, floor, "1", "2Д-81"));
    apartments.push(createApartment(section, floor, "2", "1Б-53"));
    apartments.push(createApartment(section, floor, "3", "1Б-53"));
    apartments.push(createApartment(section, floor, "4", "2Е-80"));
    apartments.push(createApartment(section, floor, "5", "2Б-74"));
    apartments.push(createApartment(section, floor, "6", "1Б-53"));
  }

  return { floor, section, apartments };
}

// План этажа для блока 4/5 (8 квартир: двойная секция с двумя лифтами)
function createBlock45Floor(section: Section, floor: number, firstFloor: boolean): FloorPlan {
  const apartments = [];

  if (firstFloor) {
    // Первый этаж: 8 квартир по Plan zdaniya-05
    apartments.push(createApartment(section, floor, "1", "2Д-81"));
    apartments.push(createApartment(section, floor, "2", "1Б-53"));
    apartments.push(createApartment(section, floor, "3", "1Б-53"));
    apartments.push(createApartment(section, floor, "4", "2Е-80"));
    apartments.push(createApartment(section, floor, "5", "2Г-74"));
    apartments.push(createApartment(section, floor, "6", "1Б-53"));
    apartments.push(createApartment(section, floor, "7", "2Д-81"));
    apartments.push(createApartment(section, floor, "8", "1Б-53"));
  } else {
    // Типовые этажи: 8 квартир по Plan zdaniya-06
    apartments.push(createApartment(section, floor, "1", "2Д-81"));
    apartments.push(createApartment(section, floor, "2", "1Б-53"));
    apartments.push(createApartment(section, floor, "3", "1Б-53"));
    apartments.push(createApartment(section, floor, "4", "2Е-80"));
    apartments.push(createApartment(section, floor, "5", "2Б-74"));
    apartments.push(createApartment(section, floor, "6", "1Б-53"));
    apartments.push(createApartment(section, floor, "7", "2Д-81"));
    apartments.push(createApartment(section, floor, "8", "1Б-53"));
  }

  return { floor, section, apartments };
}

// Генерация данных для секции
function generateSectionData(section: Section, type: "narrow" | "wide" | "block45"): FloorPlan[] {
  const floors: FloorPlan[] = [];

  for (let floor = 1; floor <= 15; floor++) {
    const isFirstFloor = floor === 1;
    if (type === "narrow") {
      floors.push(createNarrowSectionFloor(section, floor, isFirstFloor));
    } else if (type === "wide") {
      floors.push(createWideSectionFloor(section, floor, isFirstFloor));
    } else {
      floors.push(createBlock45Floor(section, floor, isFirstFloor));
    }
  }

  return floors;
}

// Типы секций по конфигурации (из context.md)
const SECTION_CONFIG: { section: Section; type: "narrow" | "wide" | "block45" }[] = [
  { section: "1", type: "narrow" },  // Узкая (5 кв) - Plan 01/02
  { section: "2", type: "wide" },    // Широкая (6 кв) - Plan 03/04
  { section: "3", type: "wide" },    // Широкая (6 кв) - Plan 07/08
  { section: "4", type: "block45" }, // Блок 4/5 (8 кв) - Plan 05/06
  { section: "5", type: "block45" }, // Блок 4/5 (8 кв) - Plan 05/06
  { section: "6", type: "narrow" },  // Узкая (5 кв) - Plan 09/10
  { section: "7", type: "wide" },    // Широкая (6 кв) - Plan 11/12
  { section: "8", type: "wide" },    // Широкая (6 кв) - Plan 13/14
  { section: "9", type: "narrow" },  // Узкая (5 кв) - Plan 15/16
  { section: "10", type: "narrow" }, // Узкая (5 кв) - Plan 17/18
  { section: "11", type: "wide" },   // Широкая (6 кв) - Plan 19/20
  { section: "12", type: "wide" },   // Широкая (6 кв) - Plan 21/22
];

// Генерация всех данных
export const apartmentsData: FloorPlan[] = SECTION_CONFIG.flatMap(({ section, type }) =>
  generateSectionData(section, type)
);

// Конфигурация здания
export const buildingConfig = {
  floors: 15,
  sections: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const,
  sectionTypes: {
    narrow: ["1", "6", "9", "10"] as const, // 5 квартир/этаж
    wide: ["2", "3", "7", "8", "11", "12"] as const, // 6 квартир/этаж
    block45: ["4", "5"] as const, // 8 квартир/этаж (двойная секция)
  },
  pricePerSqm: PRICE_PER_SQM,
  totalApartments: apartmentsData.reduce((sum, floor) => sum + floor.apartments.length, 0),
};

// Статистика по секциям
export const sectionStats = SECTION_CONFIG.map(({ section, type }) => {
  const sectionFloors = apartmentsData.filter((f) => f.section === section);
  const totalApartments = sectionFloors.reduce((sum, f) => sum + f.apartments.length, 0);
  const freeApartments = sectionFloors.reduce(
    (sum, f) => sum + f.apartments.filter((a) => a.status === "free").length,
    0
  );

  const typeLabel = type === "narrow" ? "Узкая (5 кв.)" : type === "block45" ? "Блок 4/5 (8 кв.)" : "Широкая (6 кв.)";

  return {
    section,
    type: typeLabel,
    total: totalApartments,
    free: freeApartments,
    sold: totalApartments - freeApartments,
  };
});