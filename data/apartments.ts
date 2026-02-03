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

// Генерация данных для секции
function generateSectionData(section: Section, isWide: boolean): FloorPlan[] {
  const floors: FloorPlan[] = [];
  
  for (let floor = 1; floor <= 15; floor++) {
    const isFirstFloor = floor === 1;
    floors.push(isWide ? createWideSectionFloor(section, floor, isFirstFloor) : createNarrowSectionFloor(section, floor, isFirstFloor));
  }
  
  return floors;
}

// Типы секций по конфигурации
const SECTION_CONFIG: { section: Section; isWide: boolean }[] = [
  { section: "1", isWide: false },  // Узкая (5 кв)
  { section: "2", isWide: true },   // Широкая (6 кв)
  { section: "3", isWide: true },   // Широкая (6 кв)
  { section: "4", isWide: true },   // Широкая (6 кв) - Блок 4/5
  { section: "5", isWide: true },   // Широкая (6 кв) - Блок 4/5
  { section: "6", isWide: false },  // Узкая (5 кв)
  { section: "7", isWide: true },   // Широкая (6 кв)
  { section: "8", isWide: true },   // Широкая (6 кв)
  { section: "9", isWide: false },  // Узкая (5 кв)
  { section: "10", isWide: false }, // Узкая (5 кв)
  { section: "11", isWide: true },  // Широкая (6 кв)
  { section: "12", isWide: true },  // Широкая (6 кв)
];

// Генерация всех данных
export const apartmentsData: FloorPlan[] = SECTION_CONFIG.flatMap(({ section, isWide }) =>
  generateSectionData(section, isWide)
);

// Конфигурация здания
export const buildingConfig = {
  floors: 15,
  sections: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const,
  sectionTypes: {
    narrow: ["1", "6", "9", "10"] as const, // 5 квартир/этаж
    wide: ["2", "3", "4", "5", "7", "8", "11", "12"] as const, // 6 квартир/этаж
  },
  pricePerSqm: PRICE_PER_SQM,
  totalApartments: apartmentsData.reduce((sum, floor) => sum + floor.apartments.length, 0),
};

// Статистика по секциям
export const sectionStats = SECTION_CONFIG.map(({ section, isWide }) => {
  const sectionFloors = apartmentsData.filter((f) => f.section === section);
  const totalApartments = sectionFloors.reduce((sum, f) => sum + f.apartments.length, 0);
  const freeApartments = sectionFloors.reduce(
    (sum, f) => sum + f.apartments.filter((a) => a.status === "free").length,
    0
  );
  
  return {
    section,
    type: isWide ? "Широкая (6 кв.)" : "Узкая (5 кв.)",
    total: totalApartments,
    free: freeApartments,
    sold: totalApartments - freeApartments,
  };
});