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

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  magnification: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'ProVision X3',
    description: 'Профессиональные бинокуляры с увеличением 3.5x и LED подсветкой',
    price: 89900,
    image: 'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/files/04e000fb-3d6f-472a-a8e7-258bf89f49dd.jpg',
    magnification: '3.5x'
  },
  {
    id: 2,
    name: 'MasterView Elite',
    description: 'Премиум бинокуляры с регулируемым углом и титановой оправой',
    price: 124900,
    image: 'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/files/15c078bd-817b-4e48-8e88-7225f499093b.jpg',
    magnification: '4.5x'
  },
  {
    id: 3,
    name: 'UltraZoom Pro',
    description: 'Инновационная оптика с расширенным полем зрения',
    price: 149900,
    image: 'https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/files/ff5e5d35-bc58-4373-abb8-5856e0b4feba.jpg',
    magnification: '5.5x'
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
        description: 'Ищем активного менеджера с грамотной речью. Опыт в медицинской сфере не обязателен.',
        requirements: ['Грамотная речь', 'Активность', 'Ответственность'],
        benefits: ['Премия', 'Обучение']
      },
      {
        title: 'Региональный менеджер',
        salary: 'От 120 000 ₽',
        location: 'Удаленно / Разъездной',
        type: 'Полная занятость / Частичная занятость',
        description: 'Развитие регионального представительства компании.',
        requirements: ['Опыт продаж', 'Коммуникабельность', 'Готовность к командировкам'],
        benefits: ['Обучение', 'Корпоративный транспорт']
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
      const response = await fetch('https://functions.poehali.dev/b6b1b640-cbfc-4bbd-b23e-801608792b39', {
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
            <div className="hidden md:flex space-x-6">
              {['about', 'catalog', 'testdrive', 'contacts', 'jobs', 'partnership'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`font-medium transition-colors hover:text-primary ${
                    activeSection === section ? 'text-primary' : 'text-gray-400'
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
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">Профессиональное оборудование</Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-white via-gray-400 to-gray-800 bg-clip-text text-transparent animate-gradient">
              Стоматологические бинокуляры нового поколения
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Высокоточная оптика для профессионалов. Комфорт и точность в каждой процедуре.
            </p>
            <Button size="lg" onClick={() => scrollToSection('catalog')} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0">
              <Icon name="Eye" size={20} className="mr-2" />
              Смотреть каталог
            </Button>
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
                <p className="text-gray-400">Более 15 лет в стоматологической сфере. Мы разрабатываем и производим продукт используя высококачественные линзы Schott (Германия), Glance (Корея), HOYA (Япония) и предлагаем только проверенные решения.</p>
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
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h2 className="text-4xl font-display font-bold">Каталог бинокуляров</h2>
              <Button 
                onClick={handleDownloadProductPDF}
                variant="outline"
                size="lg"
              >
                <Icon name="Download" size={20} className="mr-2" />
                Скачать PDF
              </Button>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Профессиональное оборудование с гарантией качества и технической поддержкой
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <CardHeader>
                  <CardTitle className="font-display">{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Увеличение:</span>
                      <Badge variant="secondary">{product.magnification}</Badge>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="text-3xl font-bold text-primary">{product.price.toLocaleString('ru-RU')} ₽</div>
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
                  <p className="text-gray-300">+7 (495) 123-45-67</p>
                  <p className="text-sm text-gray-500 mt-2">Пн-Пт: 9:00-18:00</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Icon name="Mail" size={40} className="mx-auto mb-4 text-secondary" />
                  <h3 className="font-bold mb-2">Email</h3>
                  <p className="text-gray-300">info@dentaloptics.ru</p>
                  <p className="text-sm text-gray-500 mt-2">Ответим в течение часа</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Icon name="MapPin" size={40} className="mx-auto mb-4 text-accent" />
                  <h3 className="font-bold mb-2">Адрес</h3>
                  <p className="text-gray-300">Москва, ул. Ленина, 10</p>
                  <p className="text-sm text-gray-500 mt-2">Офис и шоурум</p>
                </CardContent>
              </Card>
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
                  <CardDescription>Тип занятости-Полная занятость / Частичная занятость. 

Формат работы- Удаленно / Разъездной</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">Ищем активного менеджера с грамотной речью. Опыт в медицинской сфере не обязателен.</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">От 120 000 ₽</Badge>
                    <Badge variant="outline">Премия</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Региональный менеджер</span>
                    <Badge className="bg-primary text-white"></Badge>
                  </CardTitle>
                  <CardDescription>Тип занятости-Полная занятость / Частичная занятость. Формат работы- Удаленно / Разъездной</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4"></p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">От 120 000 ₽</Badge>
                    <Badge variant="outline">Обучение</Badge>
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
                <li>+7 (495) 123-45-67</li>
                <li>info@dentaloptics.ru</li>
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