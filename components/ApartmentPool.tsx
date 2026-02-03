"use client";

import { useState, useEffect, useMemo } from "react";
import { apartmentsData, buildingConfig, sectionStats, sectionImages } from "@/data/apartments";
import { Apartment, ApartmentStatus, Section } from "@/types/apartment";
import { Button } from "@/components/ui/Button";
import { Building2, Home, User, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ApartmentPool() {
  // Состояние выбора секции
  const [selectedSection, setSelectedSection] = useState<Section>("1");
  const [selectedFloor, setSelectedFloor] = useState<number | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "free" | "sold">("all");
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [selectedSchema, setSelectedSchema] = useState<"firstFloor" | "typicalFloor" | null>(null);
  const [showNameForm, setShowNameForm] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [isClient, setIsClient] = useState(false);
  
  // Покупки: id квартиры + имя покупателя
  const [purchases, setPurchases] = useState<Record<string, string>>({});

  // Загрузка из localStorage
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("apartmentPurchases");
    if (saved) {
      setPurchases(JSON.parse(saved));
    }
  }, []);

  // Сохранение в localStorage
  const savePurchase = (apartmentId: string, name: string) => {
    const updated = { ...purchases, [apartmentId]: name };
    setPurchases(updated);
    localStorage.setItem("apartmentPurchases", JSON.stringify(updated));
  };

  // Отмена покупки
  const cancelPurchase = (apartmentId: string) => {
    const updated = { ...purchases };
    delete updated[apartmentId];
    setPurchases(updated);
    localStorage.setItem("apartmentPurchases", JSON.stringify(updated));
  };

  // Квартиры текущей секции
  const sectionApartments = useMemo(() => {
    return apartmentsData
      .filter(f => f.section === selectedSection)
      .flatMap(f => f.apartments);
  }, [selectedSection]);

  // Статистика текущей секции
  const sectionApartmentStats = useMemo(() => {
    const purchasedIds = Object.keys(purchases);
    return {
      total: sectionApartments.length,
      free: sectionApartments.filter(a => a.status === "free" && !purchasedIds.includes(a.id)).length,
      sold: sectionApartments.filter(a => a.status === "sold" || purchasedIds.includes(a.id)).length,
    };
  }, [sectionApartments, purchases]);

  // Общая статистика здания
  const buildingApartmentStats = useMemo(() => {
    const allApartments = apartmentsData.flatMap(f => f.apartments);
    const purchasedIds = Object.keys(purchases);
    return {
      total: allApartments.length,
      free: allApartments.filter(a => a.status === "free" && !purchasedIds.includes(a.id)).length,
      sold: allApartments.filter(a => a.status === "sold" || purchasedIds.includes(a.id)).length,
    };
  }, [purchases]);

  // Фильтрация этажей
  const filteredFloors = useMemo(() => {
    return apartmentsData
      .filter(floor => {
        if (floor.section !== selectedSection) return false;
        if (selectedFloor !== "all" && floor.floor !== selectedFloor) return false;
        return true;
      })
      .map(floor => ({
        ...floor,
        apartments: floor.apartments.filter(apt => {
          const isBooked = !!purchases[apt.id];
          const isSold = apt.status === "sold" || isBooked;

          if (selectedStatus === "free") return !isSold;
          if (selectedStatus === "sold") return isSold;
          return true;
        }),
      }))
      .filter(floor => floor.apartments.length > 0);
  }, [selectedSection, selectedFloor, selectedStatus, purchases]);

  // Этажи для выпадающего списка
  const floorOptions = useMemo(() => {
    return apartmentsData
      .filter(f => f.section === selectedSection)
      .map(f => f.floor)
      .sort((a, b) => a - b);
  }, [selectedSection]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  const handleApartmentClick = (apartmentId: string) => {
    const apt = apartmentsData.flatMap(f => f.apartments).find(a => a.id === apartmentId);
    if (apt) {
      setSelectedApartment(apt);
      setShowNameForm(false);
      setBuyerName("");
    }
  };

  const handlePurchase = () => {
    if (selectedApartment && buyerName.trim()) {
      savePurchase(selectedApartment.id, buyerName.trim());
      setSelectedApartment(null);
      setBuyerName("");
      setShowNameForm(false);
    }
  };

  const getDisplayStatus = (apt: Apartment): "free" | "sold" | "my" => {
    if (purchases[apt.id]) return "my";
    return apt.status;
  };

  if (!isClient) return null;

  return (
    <section id="apartments" className="section-padding bg-gray-50">
      <div className="container-custom">
        <h2 className="text-2xl font-bold mb-6">Схема здания</h2>

        {/* Выбор секции */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Выберите секцию:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {buildingConfig.sections.map(section => {
              const isWide = buildingConfig.sectionTypes.wide.includes(section as any);
              return (
                <button
                  key={section}
                  onClick={() => {
                    setSelectedSection(section as Section);
                    setSelectedFloor("all");
                  }}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-all",
                    selectedSection === section
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  Секция {section}
                  <span className="ml-1 text-xs opacity-75">
                    ({isWide ? "6 кв." : "5 кв."})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Статистика секции */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600">{sectionApartmentStats.total}</div>
            <div className="text-sm text-gray-500">Всего квартир</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border-l-4 border-green-500">
            <div className="text-3xl font-bold text-green-600">{sectionApartmentStats.free}</div>
            <div className="text-sm text-gray-500">Свободно</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border-l-4 border-red-500">
            <div className="text-3xl font-bold text-red-600">{sectionApartmentStats.sold}</div>
            <div className="text-sm text-gray-500">Занято</div>
          </div>
        </div>

        {/* Фильтры */}
        <div className="bg-white rounded-lg p-4 mb-8 shadow-sm">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Этаж
              </label>
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value === "all" ? "all" : Number(e.target.value))}
                className="border rounded-lg px-3 py-2 min-w-[120px]"
              >
                <option value="all">Все этажи</option>
                {floorOptions.map(floor => (
                  <option key={floor} value={floor}>Этаж {floor}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="border rounded-lg px-3 py-2 min-w-[140px]"
              >
                <option value="all">Любой</option>
                <option value="free">Свободно</option>
                <option value="sold">Занято</option>
              </select>
            </div>

            <div className="ml-auto flex items-center gap-6">
              <span className="flex items-center gap-2 text-sm">
                <span className="w-4 h-4 bg-green-500 rounded"></span>
                Свободно
              </span>
              <span className="flex items-center gap-2 text-sm">
                <span className="w-4 h-4 bg-red-500 rounded"></span>
                Занято
              </span>
              <span className="flex items-center gap-2 text-sm">
                <span className="w-4 h-4 bg-red-600 rounded border-2 border-red-300"></span>
                Моя бронь
              </span>
            </div>
          </div>
        </div>

        {/* Чертежи секции */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-gray-500" />
            Архитектурные чертежи секции {selectedSection}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* План 1 этажа */}
            <button
              onClick={() => setSelectedSchema("firstFloor")}
              className="border rounded-lg overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all"
            >
              <div className="bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 border-b text-left">
                План 1 этажа
              </div>
              <img
                src={sectionImages[selectedSection].firstFloor}
                alt={`Секция ${selectedSection} - План 1 этажа`}
                className="w-full h-auto object-contain bg-white cursor-pointer"
                style={{ maxHeight: "300px" }}
              />
            </button>
            
            {/* План типового этажа */}
            <button
              onClick={() => setSelectedSchema("typicalFloor")}
              className="border rounded-lg overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all"
            >
              <div className="bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 border-b text-left">
                План типового этажа (2-15)
              </div>
              <img
                src={sectionImages[selectedSection].typicalFloor}
                alt={`Секция ${selectedSection} - Типовой этаж`}
                className="w-full h-auto object-contain bg-white cursor-pointer"
                style={{ maxHeight: "300px" }}
              />
            </button>
          </div>
        </div>

        {/* Этажи */}
        <div className="grid gap-6">
          {filteredFloors.map(floor => (
            <div key={floor.floor} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Home className="w-5 h-5 text-gray-500" />
                  Этаж {floor.floor} • Секция {floor.section}
                </h3>
                <div className="text-sm text-gray-500">
                  {floor.apartments.length} квартир
                </div>
              </div>

              {/* Коридор */}
              <div className="bg-gray-200 h-10 rounded-lg mb-4 flex items-center justify-center text-sm text-gray-600 font-medium">
                Коридор
              </div>

              {/* Квартиры */}
              <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:grid-cols-6">
                {floor.apartments.map((apt) => {
                  const buyer = purchases[apt.id];
                  const status = getDisplayStatus(apt);
                  const isSold = status === "sold" || status === "my";

                  return (
                    <button
                      key={apt.id}
                      onClick={() => handleApartmentClick(apt.id)}
                      className={cn(
                        "p-2 md:p-3 rounded-lg text-white text-center transition-all cursor-pointer hover:shadow-lg hover:scale-105",
                        status === "free" && "bg-green-500 hover:bg-green-600",
                        status === "sold" && "bg-red-500 hover:bg-red-600",
                        status === "my" && "bg-red-600 border-2 border-red-300"
                      )}
                      >
                        <div className="font-bold text-base md:text-lg">№{apt.number}</div>
                      <div className="text-xs opacity-90">{apt.rooms}кн • {apt.area}м²</div>
                      <div className="text-sm font-medium mt-1">
                        {status === "my" ? buyer : (isSold ? "Занято" : "Свободно")}
                      </div>
                      {apt.apartmentClass && (
                        <div className="text-xs opacity-75 mt-1">кл. {apt.apartmentClass}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredFloors.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm">
            Квартиры по выбранным критериям не найдены
          </div>
        )}

        {/* Модальное окно */}
        {selectedApartment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">Квартира №{selectedApartment.number}</h3>
                  <p className="text-sm text-gray-500">Секция {selectedApartment.section} • Этаж {selectedApartment.floor}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedApartment(null);
                    setShowNameForm(false);
                    setBuyerName("");
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Тип</span>
                  <span className="font-medium">{selectedApartment.rooms}-комнатная</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Класс</span>
                  <span className="font-medium">Класс {selectedApartment.apartmentClass}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Общая площадь</span>
                  <span className="font-medium">{selectedApartment.area} м²</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Жилая площадь</span>
                  <span className="font-medium">{selectedApartment.livingArea} м²</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Площадь кухни</span>
                  <span className="font-medium">{selectedApartment.kitchenArea} м²</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Цена</span>
                  <span className="font-bold text-lg text-primary-600">
                    {formatPrice(selectedApartment.price)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Статус</span>
                  <span className={cn(
                    "font-medium",
                    getDisplayStatus(selectedApartment) === "free" ? "text-green-600" : "text-red-600"
                  )}>
                    {getDisplayStatus(selectedApartment) === "free" 
                      ? "Свободно" 
                      : getDisplayStatus(selectedApartment) === "my"
                      ? `Забронировано: ${purchases[selectedApartment.id]}`
                      : "Занято"}
                  </span>
                </div>
              </div>

              {/* Кнопки действий */}
              {getDisplayStatus(selectedApartment) === "free" && !showNameForm && (
                <Button className="w-full mt-4" size="lg" onClick={() => setShowNameForm(true)}>
                  <User className="w-5 h-5 mr-2" />
                  Забронировать
                </Button>
              )}

              {getDisplayStatus(selectedApartment) === "free" && showNameForm && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Введите ваше имя для бронирования
                    </label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Ваше имя"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" size="lg" onClick={handlePurchase} disabled={!buyerName.trim()}>
                      <Check className="w-5 h-5 mr-2" />
                      Подтвердить
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => {
                      setShowNameForm(false);
                      setBuyerName("");
                    }}>
                      <X className="w-5 h-5 mr-2" />
                      Отмена
                    </Button>
                  </div>
                </div>
              )}

              {getDisplayStatus(selectedApartment) === "my" && (
                <div className="mt-4">
                  <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-center mb-3">
                    <span className="font-medium">Забронировано: {purchases[selectedApartment.id]}</span>
                  </div>
                  <Button className="w-full" size="lg" variant="outline" onClick={() => {
                    cancelPurchase(selectedApartment.id);
                    setSelectedApartment(null);
                  }}>
                    <X className="w-5 h-5 mr-2" />
                    Отменить бронь
                  </Button>
                </div>
              )}

              {getDisplayStatus(selectedApartment) !== "free" && !purchases[selectedApartment.id] && (
                <div className="w-full mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-center text-sm">
                  Квартира недоступна для бронирования
                </div>
              )}
            </div>
          </div>
        )}

        {/* Preview чертежа */}
        {selectedSchema && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSchema(null)}>
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-bold text-lg">
                  {selectedSchema === "firstFloor" ? "План 1 этажа" : "План типового этажа (2-15)"} • Секция {selectedSection}
                </h3>
                <button
                  onClick={() => setSelectedSchema(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <img
                src={selectedSchema === "firstFloor" 
                  ? sectionImages[selectedSection].firstFloor 
                  : sectionImages[selectedSection].typicalFloor}
                alt={`Секция ${selectedSection} - ${selectedSchema === "firstFloor" ? "План 1 этажа" : "Типовой этаж"}`}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}