"use client";

import { Building2, Home, Wrench, Ruler, TreePine, PenTool } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const services = [
  {
    icon: Building2,
    title: "Строительство домов",
    description: "Возводим частные дома, коттеджи и таунхаусы под ключ. Работаем с любыми материалами: кирпич, газобетон, дерево.",
    features: ["Фундамент любого типа", "Стены и перекрытия", "Кровельные работы", "Фасадные работы"],
  },
  {
    icon: Home,
    title: "Ремонт квартир",
    description: "Качественный ремонт квартир под ключ: от косметического до капитального. Более 100 успешных проектов.",
    features: ["Черновые работы", "Чистовая отделка", "Электромонтаж", "Сантехника"],
  },
  {
    icon: PenTool,
    title: "Проектирование",
    description: "Разработка полного пакета проектной документации для жилых и коммерческих объектов.",
    features: ["Архитектурные решения", "Конструктивные решения", "Инженерные сети", "Дизайн-проект"],
  },
  {
    icon: Ruler,
    title: "Коммерческие объекты",
    description: "Строительство офисов, магазинов, складов и производственных помещений под ключ.",
    features: ["Офисные здания", "Торговые помещения", "Склады", "Промышленные объекты"],
  },
  {
    icon: Wrench,
    title: "Инженерные системы",
    description: "Монтаж всех инженерных систем: отопление, водоснабжение, канализация, вентиляция, электрика.",
    features: ["Отопление и теплый пол", "Водоснабжение", "Вентиляция", "Электрика"],
  },
  {
    icon: TreePine,
    title: "Благоустройство",
    description: "Комплексное благоустройство территорий: ландшафтный дизайн, асфальтирование, озеленение.",
    features: ["Ландшафтный дизайн", "Детские площадки", "Парковки", "Освещение"],
  },
];

export function Services() {
  return (
    <section id="services" className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
            Наши услуги
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Предлагаем полный спектр строительных и ремонтных услуг для частных и коммерческих клиентов
          </p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} hover className="h-full">
              <CardHeader>
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <service.icon className="w-7 h-7 text-primary-500" />
                </div>
                <h3 className="text-xl font-bold text-secondary-800">{service.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg">
            Получить консультацию
          </Button>
        </div>
      </div>
    </section>
  );
}