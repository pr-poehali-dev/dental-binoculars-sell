import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface ProductDetails {
  id: number;
  name: string;
  description: string;
  price: number;
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
    id: 3,
    name: 'UltraZoom Pro',
    description: 'Инновационная оптика с расширенным полем зрения',
    price: 149900,
    images: [
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/files/ff5e5d35-bc58-4373-abb8-5856e0b4feba.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/files/04e000fb-3d6f-472a-a8e7-258bf89f49dd.jpg',
      'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/files/15c078bd-817b-4e48-8e88-7225f499093b.jpg'
    ],
    magnification: '5.5x',
    weight: '265г',
    fullDescription: 'UltraZoom Pro — топовая модель с максимальным увеличением и расширенным полем зрения. Инновационная оптическая схема обеспечивает непревзойденную четкость даже при работе с мельчайшими деталями. Интеллектуальная система подсветки автоматически адаптируется к условиям освещения. Идеальный выбор для сложных процедур, требующих максимальной точности.',
    specifications: [
      { label: 'Увеличение', value: '5.5x' },
      { label: 'Рабочее расстояние', value: '420-520 мм' },
      { label: 'Поле зрения', value: '115 мм' },
      { label: 'Вес', value: '265 г' },
      { label: 'LED подсветка', value: 'Интеллектуальная, 3500-6500K' },
      { label: 'Материал оправы', value: 'Титан + карбон' },
      { label: 'Регулировка угла', value: '0-70° с фиксацией' },
      { label: 'Глубина резкости', value: 'Расширенная, 80-120 мм' },
      { label: 'Гарантия', value: '5 лет' }
    ],
    package: [
      'Бинокуляры UltraZoom Pro',
      'Интеллектуальный LED осветитель',
      'Премиум кейс с индивидуальным номером',
      'Профессиональный набор для чистки',
      'Три типа адаптеров для крепления',
      'Запасные комплектующие',
      'Сертификат качества',
      'Lifetime гарантия на оптику',
      'Год бесплатного сервиса'
    ]
  }
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад в каталог
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 relative group">
              <img 
                src={product.images[selectedImageIndex]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-300"
              />
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
              <Badge className="mb-4 bg-primary text-white">В наличии</Badge>
              <h1 className="text-4xl font-display font-bold mb-4">{product.name}</h1>
              <p className="text-xl text-gray-400 mb-6">{product.description}</p>
              <div className="text-4xl font-bold text-primary mb-6">
                {product.price.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-gray-600">Увеличение:</span>
                <Badge variant="secondary" className="text-lg">{product.magnification}</Badge>
              </div>
            </div>

            <div className="space-y-3 pt-6">
              <Button 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleOrder}
              >
                <Icon name="ShoppingCart" size={20} className="mr-2" />
                Оставить заявку
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
                <p className="text-lg leading-relaxed text-gray-300">
                  {product.fullDescription}
                </p>
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
  );
}