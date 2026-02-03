// Классы квартир по планировке (из чертежей)
export type ApartmentClass = "А" | "Б" | "В" | "Г";

// Статусы: только 2 варианта
export type ApartmentStatus = "free" | "sold";

// Все 12 секций здания
export type Section = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";

export interface Apartment {
  id: string; // format: "section-floor-number" e.g., "1-5-3"
  number: string;
  floor: number;
  rooms: 1 | 2;
  area: number;
  price: number;
  status: ApartmentStatus;
  section: Section;
  /** Класс квартиры (А, Б, В, Г) */
  apartmentClass: ApartmentClass;
  /** Жилая площадь */
  livingArea: number;
  /** Площадь кухни */
  kitchenArea: number;
}

export interface FloorPlan {
  floor: number;
  section: Section;
  apartments: Apartment[];
}

export interface BuildingStats {
  total: number;
  sold: number;
  free: number;
}

// Покупка квартиры с именем покупателя
export interface ApartmentPurchase {
  apartmentId: string;
  buyerName: string;
  purchaseDate: string;
}