import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { addToCart, getCart, getCartCount } from '@/lib/cart';

interface ProductDetails {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  pricePrefix?: string;
  images: string[];
  magnification: string;
  weight: string;
  fullDescription: string;
  specifications: {
    label: string;
    value: string;
  }[];
  package: string[];
}

const productsData: ProductDetails[] = [
  {
    id: 1,
    name: 'ProVision X3',
    description: 'Профессиональные бинокуляры с увеличением 3.5x и LED подсветкой',
    price: 89900,
    images: [
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/files/04e000fb-3d6f-472a-a8e7-258bf89f49dd.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/files/15c078bd-817b-4e48-8e88-7225f499093b.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/files/ff5e5d35-bc58-4373-abb8-5856e0b4feba.jpg'
    ],
    magnification: '3.5x',
    weight: '280г',
    fullDescription: 'ProVision X3 — это профессиональные стоматологические бинокуляры, разработанные для врачей, которые ценят точность и комфорт. Оптическая система высокого разрешения обеспечивает четкое изображение, а встроенная LED подсветка позволяет работать в любых условиях освещения. Эргономичная конструкция снижает нагрузку на шею и спину при длительной работе.',
    specifications: [
      { label: 'Увеличение', value: '3.5x' },
      { label: 'Рабочее расстояние', value: '340-420 мм' },
      { label: 'Поле зрения', value: '95 мм' },
      { label: 'Вес', value: '280 г' },
      { label: 'LED подсветка', value: 'Да, 5000K' },
      { label: 'Материал оправы', value: 'Алюминиевый сплав' },
      { label: 'Гарантия', value: '2 года' }
    ],
    package: [
      'Бинокуляры ProVision X3',
      'LED осветитель',
      'Защитный кейс',
      'Салфетка для чистки оптики',
      'Адаптер для крепления на очки',
      'Инструкция по эксплуатации'
    ]
  },
  {
    id: 2,
    name: 'MasterView Elite',
    description: 'Премиум бинокуляры с регулируемым углом и титановой оправой',
    price: 124900,
    images: [
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/files/15c078bd-817b-4e48-8e88-7225f499093b.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/files/ff5e5d35-bc58-4373-abb8-5856e0b4feba.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/files/04e000fb-3d6f-472a-a8e7-258bf89f49dd.jpg'
    ],
    magnification: '4.5x',
    weight: '245г',
    fullDescription: 'MasterView Elite — премиальное решение для взыскательных профессионалов. Титановая оправа обеспечивает минимальный вес при максимальной прочности. Уникальная система регулировки угла наклона позволяет найти идеальное положение для любого врача. Многослойное просветляющее покрытие линз гарантирует максимальную четкость и контрастность изображения.',
    specifications: [
      { label: 'Увеличение', value: '4.5x' },
      { label: 'Рабочее расстояние', value: '380-480 мм' },
      { label: 'Поле зрения', value: '105 мм' },
      { label: 'Вес', value: '245 г' },
      { label: 'LED подсветка', value: 'Да, регулируемая 4000-6000K' },
      { label: 'Материал оправы', value: 'Титановый сплав Grade 5' },
      { label: 'Регулировка угла', value: '0-60°' },
      { label: 'Гарантия', value: '3 года' }
    ],
    package: [
      'Бинокуляры MasterView Elite',
      'LED осветитель с регулировкой температуры',
      'Премиум кейс из карбона',
      'Набор для чистки оптики',
      'Два адаптера для крепления',
      'Запасные носовые упоры',
      'Инструкция и сертификат',
      'Расширенная гарантия 3 года'
    ]
  },
  {
    id: 4,
    name: 'Бинокулярные лупы Ergo Pro Max',
    description: 'Апохроматические линзы из оптического стекла. Немецкая оптика Schott',
    price: 119000,
    oldPrice: 140000,
    images: [
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/e6f53627-0c1b-4e69-9a8f-fcf2235770d6.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/c22073b3-1a17-4de3-8196-e0b08422f849.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/46704256-c5ec-4a17-a95d-6e0902a8c071.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/1b730421-11b5-404a-8a95-5937124af9c6.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/192fcd95-cf06-47c8-b28c-20e73613227f.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/73980f65-fefc-4ccc-91ad-470faebbcf30.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/d75322f1-ce3c-47ae-97c1-0a5e78c8c098.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/30211142-2425-4cdb-b37d-e8c1eab0f989.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/a260e5a9-13f0-4524-ac73-026366ef2b73.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/9121fe26-91b2-4f64-8d42-8733a5b0f057.jpg'
    ],
    magnification: '3.0х / 4.0х / 5.0х / 6.0х',
    weight: 'Зависит от конфигурации',
    fullDescription: 'Бинокулярные лупы Ergo Pro Max — профессиональное решение с апохроматическими линзами из немецкого оптического стекла Schott. Многослойное покрытие с антибликовым эффектом и защитой от запотевания и царапин. Конструкция бинокуляров, расположенная под углом, позволяет держать голову прямо, благодаря чему снижается нагрузка на спину. Асинхронная настройка межзрачкового расстояния. Высокая прочность и легкость за счет материала аэрокосмического класса. Высокое разрешение, чистое и четкое поле обзора без размытия и виньетирования. Возможность крепления осветительного прибора. Рекомендуем использовать в паре с «Беспроводной головной осветитель Pro Max»',
    specifications: [
      { label: 'Увеличение', value: '3.0х, 4.0х, 5.0х, 6.0х' },
      { label: 'Рабочее расстояние', value: '450-550 мм' },
      { label: 'Поле обзора', value: '50-105 мм' },
      { label: 'Глубина обзора', value: '55-135 мм' },
      { label: 'Оптика', value: 'Апохроматические линзы Schott' },
      { label: 'Покрытие', value: 'Многослойное антибликовое с защитой от запотевания' },
      { label: 'Материал', value: 'Аэрокосмический класс / Алюминиевый сплав' },
      { label: 'Настройка', value: 'Асинхронная регулировка межзрачкового расстояния' },
      { label: 'Эргономика', value: 'Угловая конструкция для прямой посадки головы' }
    ],
    package: [
      'Бинокулярные лупы',
      'Салфетка для чистки',
      'Ключ/Отвертка',
      'Шнурок',
      'Инструкции',
      'Кейс'
    ]
  },
  {
    id: 5,
    name: 'Беспроводной головной осветитель Pro Max',
    description: 'Беспроводной головной осветитель Pro Max обеспечивает непрерывную работу без необходимости подключения к кабелю. Высокое качество света, имеются два уровня яркости, переключаемые сенсорным нажатием',
    price: 59000,
    oldPrice: 65000,
    images: [
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/0efe54e3-bfff-4d46-8fa9-663c0dbce656.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/227a1aad-5de6-42b1-b0ec-5ee84ac1d223.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/3448e1d7-7e27-47e5-8fa1-81d35d325e40.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/c07e5a24-e709-4407-a425-75af5115519a.jpg',

      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/d6597e30-2dc9-4e60-9df6-b486ce1780bf.jpg'
    ],
    magnification: '35000 ЛК',
    weight: '10,8 г (осветитель), 19,2 г (аккумулятор)',
    fullDescription: 'Беспроводной головной осветитель Pro Max обеспечивает непрерывную работу без необходимости подключения к кабелю. Высокое качество света, имеются два уровня яркости, переключаемые сенсорным нажатием. Идеальное решение для профессионалов, работающих с бинокулярными лупами. Легкий вес и эргономичная конструкция обеспечивают комфорт при длительной работе.',
    specifications: [
      { label: 'Цветовая температура', value: '5700 K' },
      { label: 'Интенсивность', value: '35000 ЛК' },
      { label: 'Время зарядки', value: '1 ч' },
      { label: 'Время беспрерывной работы', value: '2 ч' },
      { label: 'Вес осветителя', value: '10,8 г' },
      { label: 'Вес аккумулятора', value: '19,2 г' },
      { label: 'Управление', value: 'Сенсорное, два уровня яркости' },
      { label: 'Тип питания', value: 'Аккумуляторный, 3 батареи в комплекте' }
    ],
    package: [
      'Осветитель 1 шт',
      'Аккумулятор 3 шт',
      'Зарядная площадка 1 шт',
      'Зарядное устройство 1 шт',
      'Кабель для зарядки 1 шт',
      'Желтый фильтр 1 шт',
      'Ключ/Отвертка 1 шт',
      'Руководство по эксплуатации 1 шт',
      'Кейс/Сумка 1 шт'
    ]
  },
  {
    id: 6,
    name: 'Бинокулярные лупы Individual Ergo Pro Max',
    description: '5 цветов оправы (на выбор). Апохроматические линзы из оптического стекла. Немецкая оптика Schott',
    price: 120000,
    pricePrefix: 'от',
    images: [
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/c0575249-d4e4-49c3-b689-0c7abc42eabd.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/90150410-d574-4637-9106-f33f8b38d5cc.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/088f3ac5-822f-4572-964d-16b7f0afa4bb.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/82350fa7-f052-4613-abe9-e8ec2ff17579.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/8315452c-69c7-4ca1-bec1-95cc0a3c2b9a.jpg'
    ],
    magnification: '3.0х / 4.0х / 5.0х / 6.0х',
    weight: 'Зависит от конфигурации',
    fullDescription: 'Бинокулярные лупы Individual Ergo Pro Max — профессиональное решение с апохроматическими линзами из немецкого оптического стекла Schott. Многослойное покрытие с антибликовым эффектом и защитой от запотевания и царапин. Конструкция бинокуляров, расположенная под углом, позволяет держать голову прямо, благодаря чему снижается нагрузка на спину. Высокая прочность и легкость оправы. Высокое разрешение, чистое и четкое поле обзора без размытия и виньетирования. Возможность крепления осветительного прибора. Рекомендуем использовать в паре с «Беспроводной головной осветитель Pro Max». Доступны 5 цветов оправы на выбор.',
    specifications: [
      { label: 'Увеличение', value: '3.0х, 4.0х, 5.0х, 6.0х' },
      { label: 'Рабочее расстояние', value: '450-550 мм' },
      { label: 'Поле обзора', value: '50-105 мм' },
      { label: 'Глубина обзора', value: '55-135 мм' },
      { label: 'Оптика', value: 'Апохроматические линзы Schott' },
      { label: 'Покрытие', value: 'Многослойное антибликовое с защитой от запотевания и царапин' },
      { label: 'Эргономика', value: 'Угловая конструкция для прямой посадки головы' },
      { label: 'Цвета оправы', value: '5 вариантов на выбор' },
      { label: 'Дополнительно', value: 'Возможность крепления осветителя' }
    ],
    package: [
      'Бинокулярные лупы',
      'Салфетка для чистки',
      'Шнурок',
      'Инструкции',
      'Кейс'
    ]
  },
  {
    id: 7,
    name: 'Универсальный Осветитель Беспроводной',
    description: 'Быстросъемные аккумуляторы на магнитном креплении. Универсальное крепление с прищепкой для бинокуляров и очков',
    price: 39000,
    oldPrice: 45000,
    images: [
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/594d7ace-2d6f-4c28-bceb-c399b1cadc05.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/28055a27-0fa7-41ab-9b36-22ae352e6c45.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/74b71023-7bdc-4993-9cc5-6df47d251563.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/6b031220-b80a-4b2e-931e-e4639d7d18f4.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/795a1645-887c-4f9a-aa1e-56b3bf4cd4fb.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/6b590a70-8d04-4924-940d-b17fe68b6dc5.jpg'
    ],
    magnification: '20 000-60 000 Люкс',
    weight: '42 г',
    fullDescription: 'Универсальный Осветитель Беспроводной с быстросъемными аккумуляторами на магнитном креплении. Включение по нажатию: тач-пад позволяет быстро включать и выключать прибор. Универсальное крепление — данный осветитель для бинокуляров и очков оснащен удобной и надежной прищепкой, которая легко и прочно крепится на оправу. Осветитель создает однородное, четко очерченное световое пятно без засветов. Такой стоматологический свет обеспечивает отличную видимость рабочего поля. Оранжевый фильтр предотвращает преждевременное отверждение композита.',
    specifications: [
      { label: 'Вес', value: '42 г' },
      { label: 'Мощность источника света', value: '5 Вт' },
      { label: 'Интенсивность света', value: '20 000-60 000 Люкс' },
      { label: 'Время полной зарядки', value: '3 часа' },
      { label: 'Срок службы лампы', value: '10 000 часов' },
      { label: 'Входное напряжение', value: 'AC100-240V/50-60 Гц' },
      { label: 'Аккумулятор', value: '650 мАч × 2 / 3,7 В' },
      { label: 'Конфигурация батареи', value: 'Две батареи' },
      { label: 'Установка батареи', value: 'Магнитный тип' },
      { label: 'Управление', value: 'Тач-пад' },
      { label: 'Дополнительно', value: 'Оранжевый фильтр в комплекте' }
    ],
    package: [
      'Кейс/Сумка 1 шт',
      'Осветитель 1 шт',
      'Аккумулятор беспроводной 2 шт',
      'Зарядное устройство 1 шт',
      'Инструкция по эксплуатации 1 шт'
    ]
  },
  {
    id: 8,
    name: 'Бинокулярные лупы Ergo Pro',
    description: 'Апохроматические линзы из оптического стекла HOYA (Япония). Многослойное покрытие с антибликовым эффектом и защитой от запотевания и царапин',
    price: 91000,
    oldPrice: 120000,
    images: [
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/a6756a05-fe36-4e57-acda-f11fa747f11d.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/adb4b625-cfd4-443f-b7cf-4bebefc0c488.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/939428d1-54c3-48a2-9630-6c83ebd6c718.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/7e704f6e-e020-4b17-98cf-c614dbb47c3a.jpg',

      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/dbffdafc-5e70-4e3d-a061-5a0b8976eda0.jpg'
    ],
    magnification: '4.0х / 5.0х / 6.0х',
    weight: 'Зависит от конфигурации',
    fullDescription: 'Бинокулярные лупы Ergo Pro — профессиональное решение с апохроматическими линзами из оптического стекла HOYA (Япония). Многослойное покрытие с антибликовым эффектом и защитой от запотевания и царапин. Конструкция бинокуляров, расположенная под углом, позволяет держать голову прямо, благодаря чему снижается нагрузка на спину. Асинхронная настройка межзрачкового расстояния. Высокая прочность и легкость за счет материала аэрокосмического класса. Высокое разрешение, чистое и четкое поле обзора без размытия и виньетирования. Возможность крепления осветительного прибора. Рекомендуем использовать в паре с «головной осветитель Pro»',
    specifications: [
      { label: 'Увеличение', value: '4.0х, 5.0х, 6.0х' },
      { label: 'Рабочее расстояние', value: '350-460 мм' },
      { label: 'Поле обзора', value: '50 мм' },
      { label: 'Оптика', value: 'Апохроматические линзы HOYA (Япония)' },
      { label: 'Покрытие', value: 'Многослойное антибликовое с защитой от запотевания и царапин' },
      { label: 'Материал', value: 'Аэрокосмический класс / Алюминиевый сплав' },
      { label: 'Настройка', value: 'Асинхронная регулировка межзрачкового расстояния' },
      { label: 'Эргономика', value: 'Угловая конструкция для прямой посадки головы' }
    ],
    package: [
      'Бинокулярные лупы',
      'Салфетка для чистки',
      'Ключ/Отвертка',
      'Шнурок',
      'Инструкции',
      'Кейс'
    ]
  },
  {
    id: 9,
    name: 'Осветитель Pro',
    description: 'Светодиодный стоматологический осветитель с цветовой температурой 5000 К и индексом цветопередачи CRI>90%',
    price: 29000,
    oldPrice: 40000,
    images: [
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/e1b3cdb0-58c9-4b23-b68d-c95a87b74030.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/ae88c2b2-c710-49a7-a8c2-6ad3964076be.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/525801f5-ad3a-4448-9435-7001c9163daa.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/7d794551-26ce-409f-9110-db7637de3197.jpg'
    ],
    magnification: '90 000 лк',
    weight: 'Не указан',
    fullDescription: 'Светодиодный стоматологический осветитель с цветовой температурой 5000 К, что соответствует качеству освещения в полдень, с индексом цветопередачи CRI>90%, воспроизводит реалистичные цвета, обеспечивает четкие круглые световые пятна и плавную регулировки яркости. Возможность крепления осветительного прибора. Рекомендуем использовать в паре с «Бинокулярные лупы Ergo Pro»',
    specifications: [
      { label: 'Мощность', value: '5 Вт' },
      { label: 'Емкость батареи', value: '3500 мАч' },
      { label: 'Цветовая температура', value: '5000 К' },
      { label: 'Уровни яркости', value: '4 уровня: 25%, 50%, 75%, 100%' },
      { label: 'Яркость на расстоянии 0 см', value: '90 000 лк (макс. мощность)' },
      { label: 'Индекс цветопередачи', value: 'CRI>90%' }
    ],
    package: [
      'Кейс/Сумка 1 шт',
      'Осветитель 1 шт',
      'Аккумулятор с прищепкой/фиксатором 1 шт',
      'Зарядное устройство 1 шт',
      'Инструкция по эксплуатации 1 шт'
    ]
  },
  {
    id: 10,
    name: 'Комплект Бинокулярные лупы Ergo + Осветитель',
    description: 'Эрго линзы из оптического стекла Glance (Корея). Конструкция бинокуляров, расположенная под углом, позволяет держать голову прямо',
    price: 64000,
    oldPrice: 80000,
    images: [
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/531c9a46-4784-4e30-a380-973773977049.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/b1b32cb0-0546-46b5-a3d1-f68b2184118f.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/86e2f2c6-5f63-46c7-9e9b-5348cd49af5d.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/1e6dd960-65b5-44db-b33f-43241c3cca24.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/1cf76a50-0b22-4bcf-832c-16b3ea0844d0.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/786eaf6f-8281-4f69-bfa8-e5cac7fc3a38.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/567128ce-eb88-49bf-b39e-8efc7e16698c.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/9e5ef883-940a-4f57-aeeb-b8b8a33eebc2.jpg',

    ],
    magnification: '5.0х',
    weight: 'Не указан',
    fullDescription: 'Эрго линзы из оптического стекла Glance (Корея). Конструкция бинокуляров, расположенная под углом, позволяет держать голову прямо, благодаря чему снижается нагрузка на спину и шею. Асинхронная настройка межзрачкового расстояния. Высокая прочность и легкость оправы + дополнительный адаптер для компенсирования диоптрий. Высокое разрешение, чистое и четкое поле обзора без размытия и виньетирования.',
    specifications: [
      { label: 'Увеличение', value: '5.0х' },
      { label: 'Рабочее расстояние', value: '350-550 мм регулируемое' },
      { label: 'Настройка', value: 'Асинхронная настройка межзрачкового расстояния' },
      { label: 'Мощность осветителя', value: '5 Вт' },
      { label: 'Емкость батареи', value: '3500 мАч' },
      { label: 'Цветовая температура', value: '5000 К' },
      { label: 'Яркость', value: 'Регулируемая' }
    ],
    package: [
      'Бинокулярные лупы с дополнительным адаптером для компенсирования диоптрий',
      'Осветитель-1',
      'Аккумулятор',
      'Зарядное устройство',
      'Салфетка для чистки',
      'Ключ/Отвертка',
      'Шнурок',
      'Инструкции',
      'Кейс'
    ]
  },
  {
    id: 11,
    name: 'Комплект Бинокулярные лупы Basic + Осветитель',
    description: 'Отличный комплект для начинающих специалистов, которые хотят начать работать с увеличением',
    price: 44000,
    oldPrice: 60000,
    images: [
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/9e2b0577-5dfd-415f-83b9-cb288cd7bd97.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/ea93b4af-cca9-42e2-a981-ca89543534dd.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/efcf7b88-fd47-4fb4-9052-4b8a259c962a.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/e00a2a60-70bc-4ec0-a50f-557eee994711.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/10a8f24a-8c20-42b3-97b8-e3597afe468c.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/ae9272c2-0678-4011-bf36-831960ce847a.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/ecb2d3c4-c80c-40a9-9b8a-18618b4cbc85.jpg'
    ],
    magnification: '3.5х',
    weight: '~300 г',
    fullDescription: 'Отличный комплект для начинающих специалистов, которые хотят начать работать с увеличением. Линзы из оптического стекла Glance (Корея). Асинхронная настройка межзрачкового расстояния. Высокая прочность и легкость оправы + дополнительный адаптер для компенсирования диоптрий. Высокое разрешение, чистое и четкое поле обзора без размытия и виньетирования.',
    specifications: [
      { label: 'Увеличение', value: '3.5х' },
      { label: 'Рабочее расстояние', value: '350-550 мм (регулируемое)' },
      { label: 'Настройка', value: 'Асинхронная регулировка межзрачкового расстояния' },
      { label: 'Оптика', value: 'Оптическое стекло Glance (Корея)' },
      { label: 'Мощность осветителя', value: '5 Вт' },
      { label: 'Емкость батареи', value: '3500 мАч' },
      { label: 'Цветовая температура', value: '5000 К' },
      { label: 'Яркость', value: 'Регулируемая' }
    ],
    package: [
      'Бинокулярные лупы с дополнительным адаптером для компенсирования диоптрий',
      'Осветитель',
      'Аккумулятор',
      'Зарядное устройство',
      'Салфетка для чистки',
      'Ключ/Отвертка',
      'Шнурок',
      'Инструкции',
      'Кейс'
    ]
  }
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setCartCount(getCartCount(getCart()));
  }, []);
  
  const product = productsData.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
          <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
        </div>
      </div>
    );
  }

  const handleOrder = () => {
    navigate('/', { state: { scrollTo: 'purchase', productId: product.id } });
  };

  return (
    <>
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/', { state: { scrollTo: 'catalog' } })}>
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад в каталог
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/cart')}
            >
              <Icon name="ShoppingCart" size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div className="space-y-4">
            <div 
              className="aspect-square overflow-hidden rounded-lg bg-gray-100 relative group cursor-pointer"
              onClick={() => setIsFullscreen(true)}
            >
              <img 
                src={product.images[selectedImageIndex]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <Icon name="Maximize2" size={48} className="text-white opacity-0 group-hover:opacity-70 transition-opacity" />
              </div>
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                    onClick={() => setSelectedImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                  >
                    <Icon name="ChevronLeft" size={24} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                    onClick={() => setSelectedImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                  >
                    <Icon name="ChevronRight" size={24} />
                  </Button>
                </>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-primary shadow-lg scale-105' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex gap-2 mb-4">
                <Badge className="bg-primary text-white">В наличии</Badge>
                {product.oldPrice && <Badge className="bg-red-500 text-white">АКЦИЯ</Badge>}
              </div>
              <h1 className="text-4xl font-display font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <div className={`text-4xl font-bold ${product.oldPrice ? 'text-red-600' : 'text-primary'}`}>
                  {product.pricePrefix && <span className="text-2xl mr-2">{product.pricePrefix}</span>}
                  {product.price.toLocaleString('ru-RU')} ₽
                </div>
                {product.oldPrice && (
                  <div className="text-2xl text-gray-400 line-through">
                    {product.oldPrice.toLocaleString('ru-RU')} ₽
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-gray-600">
                  {(product.id === 5 || product.id === 7 || product.id === 9) ? 'Интенсивность света:' : 'Увеличение:'}
                </span>
                <Badge variant="secondary" className="text-lg">{product.magnification}</Badge>
              </div>
            </div>

            <div className="space-y-3 pt-6">
              <Button 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0]
                  });
                  setCartCount(getCartCount(getCart()));
                  toast({
                    title: "Добавлено в корзину",
                    description: `${product.name} добавлен в корзину`,
                  });
                }}
              >
                <Icon name="ShoppingCart" size={20} className="mr-2" />
                Добавить в корзину
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/', { state: { scrollTo: 'testdrive' } })}
              >
                <Icon name="Calendar" size={20} className="mr-2" />
                Записаться на тест-драйв
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Icon name="Shield" size={24} className="mx-auto mb-2 text-primary" />
                <p className="text-sm text-gray-400">Гарантия качества</p>
              </div>
              <div className="text-center">
                <Icon name="Truck" size={24} className="mx-auto mb-2 text-primary" />
                <p className="text-sm text-gray-400">Доставка по РФ</p>
              </div>
              <div className="text-center">
                <Icon name="Wrench" size={24} className="mx-auto mb-2 text-primary" />
                <p className="text-sm text-gray-400">Сервисное обслуживание</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Описание</TabsTrigger>
            <TabsTrigger value="specifications">Характеристики</TabsTrigger>
            <TabsTrigger value="package">Комплектация</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg text-gray-300">{product.fullDescription}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {product.specifications.map((spec, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                    >
                      <span className="font-medium text-gray-400">{spec.label}</span>
                      <span className="font-semibold">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="package" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {product.package.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Icon name="CheckCircle" size={20} className="text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>

    {isFullscreen && (
      <div 
        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
        onClick={() => setIsFullscreen(false)}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white hover:bg-white/20"
          onClick={() => setIsFullscreen(false)}
        >
          <Icon name="X" size={32} />
        </Button>
        
        <div className="relative max-w-7xl max-h-full" onClick={(e) => e.stopPropagation()}>
          <img 
            src={product.images[selectedImageIndex]} 
            alt={product.name} 
            className="max-w-full max-h-[90vh] object-contain"
          />
          
          {product.images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                onClick={() => setSelectedImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
              >
                <Icon name="ChevronLeft" size={24} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                onClick={() => setSelectedImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
              >
                <Icon name="ChevronRight" size={24} />
              </Button>
            </>
          )}
        </div>
      </div>
    )}
    </>
  );
}