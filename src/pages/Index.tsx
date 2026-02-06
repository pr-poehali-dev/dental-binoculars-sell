import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CatalogQRCode from '@/components/CatalogQRCode';
import ProductMarquee from '@/components/ProductMarquee';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  pricePrefix?: string;
  forcePrimaryColor?: boolean;
  image: string;
  magnification: string;
  category: 'loupes' | 'lights' | 'accessories';
}

const products: Product[] = [
  {
    id: 4,
    name: 'Бинокулярные лупы Ergo Pro Max',
    description: 'Апохроматические линзы из оптического стекла. Немецкая оптика Schott',
    price: 119000,
    oldPrice: 140000,
    image: 'https://cdn.poehali.dev/files/IMG_5018.png',
    magnification: '3.0х / 4.0х / 5.0х / 6.0х',
    category: 'loupes'
  },
  {
    id: 5,
    name: 'Беспроводной головной осветитель Pro Max',
    description: 'Беспроводной головной осветитель Pro Max обеспечивает непрерывную работу без необходимости подключения к кабелю. Высокое качество света, имеются два уровня яркости, переключаемые сенсорным нажатием',
    price: 59000,
    oldPrice: 65000,
    image: 'https://cdn.poehali.dev/files/624.JPG',
    magnification: '35000 ЛК',
    category: 'lights'
  },
  {
    id: 6,
    name: 'Бинокулярные лупы Individual Ergo Pro Max',
    description: '5 цветов оправы (на выбор). Апохроматические линзы из оптического стекла. Немецкая оптика Schott',
    price: 120000,
    pricePrefix: 'от',
    forcePrimaryColor: true,
    image: 'https://cdn.poehali.dev/files/ges.jpg',
    magnification: '3.0х / 4.0х / 5.0х / 6.0х',
    category: 'loupes'
  },
  {
    id: 7,
    name: 'Универсальный Осветитель Беспроводной',
    description: 'Быстросъемные аккумуляторы на магнитном креплении. Универсальное крепление с прищепкой для бинокуляров и очков',
    price: 39000,
    oldPrice: 45000,
    image: 'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/snapedit_1768035650133.jpeg',
    magnification: '20 000-60 000 Люкс',
    category: 'lights'
  },
  {
    id: 8,
    name: 'Бинокулярные лупы Ergo Pro',
    description: 'Апохроматические линзы из оптического стекла HOYA (Япония). Многослойное покрытие с антибликовым эффектом и защитой от запотевания и царапин',
    price: 91000,
    oldPrice: 120000,
    image: 'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/bf90173f-3608-4e00-8398-b1d89b4e4cec.jpg',
    magnification: '4.0х / 5.0х / 6.0х',
    category: 'loupes'
  },
  {
    id: 9,
    name: 'Осветитель Pro',
    description: 'Светодиодный стоматологический осветитель с цветовой температурой 5000 К и индексом цветопередачи CRI>90%',
    price: 29000,
    oldPrice: 40000,
    image: 'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/52f5eee2-fd60-43b8-a6e9-854b318031fb.jpeg',
    magnification: '90 000 лк',
    category: 'lights'
  },
  {
    id: 10,
    name: 'Комплект Бинокулярные лупы Ergo + Осветитель',
    description: 'Эрго линзы из оптического стекла Glance (Корея). Конструкция бинокуляров, расположенная под углом, позволяет держать голову прямо',
    price: 64000,
    oldPrice: 80000,
    image: 'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/69e2b1b6-cc8f-4aba-b3ff-e52b655e9806.jpg',
    magnification: '5.0х',
    category: 'loupes'
  },
  {
    id: 11,
    name: 'Комплект Бинокулярные лупы Basic + Осветитель',
    description: 'Отличный комплект для начинающих специалистов, которые хотят начать работать с увеличением',
    price: 44000,
    oldPrice: 60000,
    image: 'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/13abc5a6-583f-4b68-a114-9fcb6ec844fa.JPG',
    magnification: '3.5х',
    category: 'loupes'
  }
];

const Index = () => {
  const [activeSection, setActiveSection] = useState('catalog');
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    specialty: '',
    phone: '',
    message: '',
    productId: ''
  });

  const [testDriveForm, setTestDriveForm] = useState({
    fullName: '',
    phone: '',
    specialty: '',
    city: ''
  });

  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'magnification'>('default');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'loupes' | 'lights' | 'accessories'>('all');

  const filteredProducts = categoryFilter === 'all' 
    ? products 
    : products.filter(p => p.category === categoryFilter);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'magnification':
        return parseFloat(a.magnification) - parseFloat(b.magnification);
      default:
        return 0;
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Заявка отправлена!",
      description: "Мы свяжемся с вами в ближайшее время.",
    });
    setFormData({ name: '', city: '', specialty: '', phone: '', message: '', productId: '' });
  };

  const handleTestDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Заявка на тест-драйв отправлена!",
      description: "Мы свяжемся с вами для оговорения деталей.",
    });
    setTestDriveForm({ fullName: '', phone: '', specialty: '', city: '' });
  };

  const handleDownloadPDF = async () => {
    const vacancies = [
      {
        title: 'Менеджер по продажам (г.Москва)',
        salary: 'От 120 000 ₽',
        location: 'Москва',
        type: 'Полная занятость / Частичная занятость',
        format: 'Удаленно / Разъездной',
        description: 'Ищем активного менеджера с грамотной речью. Опыт в медицинской сфере не обязателен.',
        requirements: ['Грамотная речь', 'Активность'],
        benefits: ['Ежемесячная Премия', 'Обучение'],
        payments: 'Выплаты два раза в месяц',
        contacts: {
          phone: '+7 (925) 411-61-83',
          email: 'vavdental@yandex.ru',
          messenger: 'WhatsApp, Telegram'
        }
      },
      {
        title: 'Региональный Менеджер по продажам (Все регионы)',
        salary: 'От 120 000 ₽',
        location: 'Все регионы',
        type: 'Полная занятость / Частичная занятость',
        format: 'Удаленно / Разъездной',
        description: 'Ищем активного менеджера с грамотной речью. Опыт в медицинской сфере не обязателен.',
        requirements: ['Грамотная речь', 'Активность'],
        benefits: ['Премия', 'Обучение'],
        payments: 'Выплаты два раза в месяц',
        contacts: {
          phone: '+7 (925) 411-61-83',
          email: 'vavdental@yandex.ru',
          messenger: 'WhatsApp, Telegram'
        }
      }
    ];

    try {
      const response = await fetch('https://functions.poehali.dev/14385140-d03c-4787-8637-b0a99957dfb3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vacancies })
      });

      const data = await response.json();
      
      const linkSource = `data:application/pdf;base64,${data.pdf}`;
      const downloadLink = document.createElement('a');
      downloadLink.href = linkSource;
      downloadLink.download = data.filename;
      downloadLink.click();

      toast({
        title: "PDF успешно сгенерирован!",
        description: "Файл загружен на ваше устройство.",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сгенерировать PDF. Попробуйте еще раз.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadProductPDF = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/52445cab-ac30-4ec2-a01d-b249eea14ff9', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ products })
      });

      const data = await response.json();
      
      const linkSource = `data:application/pdf;base64,${data.pdf}`;
      const downloadLink = document.createElement('a');
      downloadLink.href = linkSource;
      downloadLink.download = data.filename;
      downloadLink.click();

      toast({
        title: "PDF успешно сгенерирован!",
        description: "Каталог товаров загружен на ваше устройство.",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сгенерировать PDF. Попробуйте еще раз.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = location.state.scrollTo;
      const productId = location.state.productId;
      
      setActiveSection(section);
      const element = document.getElementById(section);
      element?.scrollIntoView({ behavior: 'smooth' });
      
      if (productId) {
        setFormData(prev => ({...prev, productId: productId.toString()}));
      }
    }
  }, [location.state]);

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-border">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="https://cdn.poehali.dev/files/b241c320-0fc6-4325-861e-db45258a83a7.jpg" alt="VAV DENTAL" className="h-32" />
            </div>
            <div className="hidden md:flex space-x-3">
              {['about', 'catalog', 'testdrive', 'contacts', 'jobs', 'partnership'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all border ${
                    activeSection === section 
                      ? 'bg-primary/20 text-primary border-primary/50' 
                      : 'text-gray-400 border-gray-700 hover:text-white hover:bg-white/5 hover:border-gray-500'
                  }`}
                >
                  {section === 'about' && 'О нас'}
                  {section === 'catalog' && 'Каталог'}
                  {section === 'testdrive' && 'Тест-драйв'}
                  {section === 'purchase' && 'Заказать'}
                  {section === 'contacts' && 'Контакты'}
                  {section === 'jobs' && 'Вакансии'}
                  {section === 'partnership' && 'Сотрудничество'}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <section className="relative py-20 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <ProductMarquee products={products} />
          </div>
        </div>
      </section>

      <section id="about" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl font-display font-bold mb-4">О нас</h2>
              <p className="text-xl text-gray-400">Эксперты в области стоматологической оптики</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Icon name="Award" size={32} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Опыт и качество</h3>
                <p className="text-gray-400">Более 15 лет в стоматологической сфере. Мы разрабатываем и производим продукт используя высококачественные оптические компоненты / линзы Schott (Германия), Glance (Корея), HOYA (Япония) и предлагаем только проверенные решения.</p>
              </Card>
              <Card className="p-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Icon name="Shield" size={32} className="text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Гарантия качества</h3>
                <p className="text-gray-400">Все наши бинокуляры сертифицированы и имеют расширенную гарантию. Полная техническая поддержка и сервисное обслуживание по всей России.</p>
              </Card>
              <Card className="p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Icon name="Users" size={32} className="text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Индивидуальный подход</h3>
                <p className="text-gray-400">Помогаем подобрать оптимальное решение под ваши задачи. Консультируем, обучаем, настраиваем оборудование под каждого специалиста.</p>
              </Card>
              <Card className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Icon name="TrendingUp" size={32} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Инновации</h3>
                <p className="text-gray-400">Следим за новейшими разработками в области оптики и первыми предлагаем инновационные решения российским специалистам.</p>
              </Card>
            </div>
            <div className="mt-12 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Наша миссия</h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Предоставить стоматологам лучшие инструменты для точной и комфортной работы, чтобы каждый пациент получал высококлассное лечение. Мы верим, что качественная оптика — это инвестиция в здоровье и успех вашей практики.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-4xl font-display font-bold mb-4">Каталог</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-3">
                <Label className="text-sm text-gray-400">Категория:</Label>
                <Select value={categoryFilter} onValueChange={(value: any) => setCategoryFilter(value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все товары</SelectItem>
                    <SelectItem value="loupes">Бинокулярные лупы</SelectItem>
                    <SelectItem value="lights">Осветители</SelectItem>
                    <SelectItem value="accessories">Аксессуары</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <Label className="text-sm text-gray-400">Сортировать:</Label>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">По умолчанию</SelectItem>
                    <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
                    <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                    <SelectItem value="magnification">Увеличение</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {sortedProducts.map((product, index) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-scale-in product-card-hover relative" style={{ animationDelay: `${index * 100}ms` }}>
                {product.oldPrice && (
                  <Badge className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white">
                    АКЦИЯ
                  </Badge>
                )}
                <div className="aspect-square overflow-hidden bg-gray-100" onClick={() => navigate(`/product/${product.id}`)}>
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <CardHeader>
                  <CardTitle className="font-display">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {product.category === 'lights' ? 'Интенсивность света:' : 'Увеличение:'}
                      </span>
                      <Badge variant="secondary">{product.magnification}</Badge>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-3">
                        <div className={`text-3xl font-bold ${product.forcePrimaryColor ? 'text-primary' : product.oldPrice ? 'text-red-600' : 'text-primary'}`}>
                          {product.pricePrefix && <span className="text-xl mr-1">{product.pricePrefix} </span>}
                          {product.price.toLocaleString('ru-RU')} ₽
                        </div>
                        {product.oldPrice && (
                          <div className="text-xl text-gray-400 line-through">
                            {product.oldPrice.toLocaleString('ru-RU')} ₽
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    Подробнее
                  </Button>
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary/90" 
                    onClick={() => {
                      setFormData({...formData, productId: product.id.toString()});
                      scrollToSection('purchase');
                    }}
                  >
                    <Icon name="ShoppingCart" size={18} className="mr-2" />
                    Заказать
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="testdrive" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <Badge className="mb-6 bg-accent text-white">Бесплатно</Badge>
              <h2 className="text-4xl font-display font-bold mb-4">Тест-драйв</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">Проведем презентацию и обучение по эргономике в вашей клинике, в удобное для вас время, чтобы вы смогли оценить все преимущества бинокуляров и осветителей .</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Presentation" size={32} className="text-primary" />
                </div>
                <h3 className="font-bold mb-2">Презентация</h3>
                <p className="text-sm text-gray-400">Покажем все возможности оборудования</p>
              </Card>
              <Card className="text-center p-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="GraduationCap" size={32} className="text-secondary" />
                </div>
                <h3 className="font-bold mb-2">Обучение</h3>
                <p className="text-sm text-gray-400">Проведем тренинг по эргономике</p>
              </Card>
              <Card className="text-center p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircle" size={32} className="text-accent" />
                </div>
                <h3 className="font-bold mb-2">Тестирование</h3>
                <p className="text-sm text-gray-400">Опробуйте в реальных условиях</p>
              </Card>
            </div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-display">Записаться на тест-драйв</CardTitle>
                <CardDescription>Заполните форму, и мы свяжемся с вами для согласования даты и времени</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTestDriveSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">ФИО *</Label>
                    <Input
                      id="fullName"
                      required
                      value={testDriveForm.fullName}
                      onChange={(e) => setTestDriveForm({...testDriveForm, fullName: e.target.value})}
                      placeholder="Иванов Иван Иванович"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testDrivePhone">Номер телефона *</Label>
                    <Input
                      id="testDrivePhone"
                      type="tel"
                      required
                      value={testDriveForm.phone}
                      onChange={(e) => setTestDriveForm({...testDriveForm, phone: e.target.value})}
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Специальность *</Label>
                    <Input
                      id="specialty"
                      required
                      value={testDriveForm.specialty}
                      onChange={(e) => setTestDriveForm({...testDriveForm, specialty: e.target.value})}
                      placeholder="Стоматолог-терапевт"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Город *</Label>
                    <Input
                      id="city"
                      required
                      value={testDriveForm.city}
                      onChange={(e) => setTestDriveForm({...testDriveForm, city: e.target.value})}
                      placeholder="Москва"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90" size="lg">
                    <Icon name="Calendar" size={20} className="mr-2" />
                    Отправить заявку
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="purchase" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg animate-fade-in">
              <CardHeader>
                <CardTitle className="text-3xl font-display">Заявка на покупку</CardTitle>
                <CardDescription>Заполните форму, и наш менеджер свяжется с вами </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">ФИО *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Иван Иванов"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Город *</Label>
                    <Input
                      id="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="Москва"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Специальность *</Label>
                    <Input
                      id="specialty"
                      type="text"
                      required
                      value={formData.specialty}
                      onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                      placeholder="Стоматолог-терапевт"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Комментарий</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Укажите интересующую модель или задайте вопрос"
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90" size="lg">
                    <Icon name="Send" size={20} className="mr-2" />
                    Отправить заявку
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-display font-bold mb-12 text-center">Контакты</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Icon name="Phone" size={40} className="mx-auto mb-4 text-primary" />
                  <h3 className="font-bold mb-2">Телефон</h3>
                  <p className="text-gray-300">+7 (925) 411-61-83</p>
                  <p className="text-sm text-gray-500 mt-2">Пн-Пт: 10:00-19:00</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Icon name="Mail" size={40} className="mx-auto mb-4 text-secondary" />
                  <h3 className="font-bold mb-2">Email</h3>
                  <p className="text-gray-300">vavdental@yandex.ru</p>
                  <p className="text-sm text-gray-500 mt-2">Ответим в течение часа</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Icon name="MapPin" size={40} className="mx-auto mb-4 text-accent" />
                  <h3 className="font-bold mb-2">Адрес</h3>
                  <p className="text-gray-300">Московская область, г.Королёв, пр-т Королёва 5д</p>
                  <p className="text-sm text-gray-500 mt-2">Офис и шоурум</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-12 flex justify-center">
              <CatalogQRCode />
            </div>
          </div>
        </div>
      </section>

      <section id="jobs" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold">Вакансии</h2>
            </div>
            <div className="space-y-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Менеджер по продажам (г.Москва)</span>
                    <Badge className="bg-primary text-white">Активна</Badge>
                  </CardTitle>
                  <CardDescription>
                    Тип занятости: Полная занятость / Частичная занятость<br/>
                    Формат работы: Удаленно / Разъездной<br/>
                    Выплаты: два раза в месяц
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">Ищем активного менеджера с грамотной речью. Опыт в медицинской сфере не обязателен.</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">От 120 000 ₽</Badge>
                    <Badge variant="outline">Ежемесячная Премия</Badge>
                    <Badge variant="outline">Обучение</Badge>
                  </div>
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <p className="text-sm text-gray-400 mb-2 font-semibold">Отправить резюме:</p>
                    <p className="text-sm text-gray-300">WhatsApp, Telegram, MAX: +7 (925) 411-61-83</p>
                    <p className="text-sm text-gray-300">E-mail: vavdental@yandex.ru</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Региональный Менеджер по продажам (Все регионы)</span>
                    <Badge className="bg-primary text-white">Активна</Badge>
                  </CardTitle>
                  <CardDescription>
                    Тип занятости: Полная занятость / Частичная занятость<br/>
                    Формат работы: Удаленно / Разъездной<br/>
                    Выплаты: два раза в месяц
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">Ищем активного менеджера с грамотной речью. Опыт в медицинской сфере не обязателен.</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">От 120 000 ₽</Badge>
                    <Badge variant="outline">Премия</Badge>
                    <Badge variant="outline">Обучение</Badge>
                  </div>
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <p className="text-sm text-gray-400 mb-2 font-semibold">Отправить резюме:</p>
                    <p className="text-sm text-gray-300">WhatsApp, Telegram, MAX: +7 (925) 411-61-83</p>
                    <p className="text-sm text-gray-300">E-mail: vavdental@yandex.ru</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="partnership" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-display font-bold mb-6">Сотрудничество</h2>
            <p className="text-xl text-gray-400 mb-12">Предлагаем выгодные условия для партнерства</p>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Users" size={32} className="text-primary" />
                </div>
                <h3 className="font-bold mb-2">Дилерам</h3>
                <p className="text-gray-400">Специальные цены и маркетинговая поддержка</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Building" size={32} className="text-secondary" />
                </div>
                <h3 className="font-bold mb-2">Клиникам</h3>
                <p className="text-gray-400">Корпоративные скидки и проведение обучения</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="GraduationCap" size={32} className="text-accent" />
                </div>
                <h3 className="font-bold mb-2">Учебным центрам</h3>
                <p className="text-gray-400">Специальные цены для оснащения учебного класса</p>
              </div>
            </div>
            <Button size="lg" onClick={() => scrollToSection('purchase')} className="bg-secondary hover:bg-secondary/90">
              <Icon name="Handshake" size={20} className="mr-2" />
              Связаться с нами
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="https://cdn.poehali.dev/files/b241c320-0fc6-4325-861e-db45258a83a7.jpg" alt="VAV DENTAL" className="h-20" />
              </div>

            </div>
            <div>
              <h4 className="font-bold mb-4">Навигация</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('catalog')} className="hover:text-white transition-colors">Каталог</button></li>
                <li><button onClick={() => scrollToSection('purchase')} className="hover:text-white transition-colors">Заказать</button></li>
                <li><button onClick={() => scrollToSection('contacts')} className="hover:text-white transition-colors">Контакты</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Компания</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('jobs')} className="hover:text-white transition-colors">Вакансии</button></li>
                <li><button onClick={() => scrollToSection('partnership')} className="hover:text-white transition-colors">Сотрудничество</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Контакты</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+7 (925) 411-61-83</li>
                <li>vavdental@yandex.ru</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VAV DENTAL. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;