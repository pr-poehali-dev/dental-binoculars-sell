import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/6baa0592-59d1-4656-a16c-50daa08feb3f";

interface DealerConfig {
  company_name?: string;
  company_description?: string;
  address?: string;
  phone?: string;
  email?: string;
  hero_title?: string;
  hero_subtitle?: string;
  margin_info?: string;
  min_order?: string;
  delivery_info?: string;
}

const Dealer = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<DealerConfig>({});
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    city: "",
    phone: "",
    email: "",
    comment: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((data) => setConfig(data))
      .catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 100);
  };

  const c = config;
  const companyName = c.company_name || "VAV DENTAL";
  const heroTitle = c.hero_title || "Коммерческое предложение для дилеров";
  const heroSubtitle = c.hero_subtitle || "Приглашаем региональных партнёров к сотрудничеству в сфере профессиональной стоматологической оптики";
  const companyDesc = c.company_description || "VAV DENTAL — российская компания с более чем 15-летним опытом в разработке и поставке профессиональной оптики для стоматологов.";
  const phone = c.phone || "+7 (495) 000-00-00";
  const email = c.email || "dealer@vavdental.ru";
  const address = c.address || "пр-т Королёва 5д, г.Королёв, Московская область";
  const marginInfo = c.margin_info || "Маржинальность 25–40%";
  const minOrder = c.min_order || "Первый заказ от 1 единицы";
  const deliveryInfo = c.delivery_info || "Доставка за 1–3 дня по всей России";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 py-4 px-6 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-white hover:text-[hsl(var(--primary))] transition-colors">
            <Icon name="ChevronLeft" size={20} />
            <span className="text-sm">На главную</span>
          </a>
          <div className="text-xl font-bold tracking-widest">
            VAV<span className="text-[hsl(var(--primary))]">DENTAL</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/dealer/edit")}
              className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm px-3 py-2 rounded-lg hover:bg-white/5"
            >
              <Icon name="Pencil" size={15} />
              Редактировать
            </button>
            <button
              onClick={handlePrint}
              disabled={printing}
              className="flex items-center gap-2 bg-[hsl(var(--primary))] text-black font-semibold text-sm px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
            >
              <Icon name="Download" size={15} />
              Скачать КП
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary)/0.08)] to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-[hsl(var(--primary)/0.15)] border border-[hsl(var(--primary)/0.3)] rounded-full px-4 py-1.5 text-sm text-[hsl(var(--primary))] mb-6">
            <Icon name="Handshake" size={14} />
            Партнёрская программа {companyName}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {heroTitle.includes("для дилеров") ? (
              <>
                {heroTitle.replace(" для дилеров", "")}<br />
                <span className="text-[hsl(var(--primary))]">для дилеров</span>
              </>
            ) : (
              <span>{heroTitle}</span>
            )}
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">{heroSubtitle}</p>
        </div>
      </section>

      {/* О компании */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">О компании</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "Award", value: "15+ лет", label: "на рынке стоматологической оптики" },
              { icon: "MapPin", value: "По всей России", label: "сервисное обслуживание и доставка" },
              { icon: "Star", value: "5 звёзд", label: "средняя оценка от врачей-стоматологов" },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-[hsl(var(--primary)/0.15)] flex items-center justify-center">
                  <Icon name={item.icon} size={20} className="text-[hsl(var(--primary))]" />
                </div>
                <div className="text-3xl font-bold text-[hsl(var(--primary))]">{item.value}</div>
                <div className="text-white/60 text-sm">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-8">
            <p className="text-white/80 leading-relaxed text-lg">
              <strong className="text-white">{companyName}</strong> — {companyDesc.replace(companyName + " — ", "").replace(companyName + "— ", "")}
            </p>
          </div>
        </div>
      </section>

      {/* Продуктовый портфель */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Продуктовый портфель</h2>
          <p className="text-white/60 mb-10">Полная линейка профессиональных бинокулярных луп и осветителей</p>

          <div className="space-y-4">
            {/* Бинокулярные лупы */}
            <div>
              <h3 className="text-[hsl(var(--primary))] font-semibold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                <Icon name="Eye" size={16} />
                Бинокулярные лупы
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    name: "Titanium Ergo Pro Max",
                    price: "139 000 ₽",
                    oldPrice: "160 000 ₽",
                    tag: "Флагман",
                    tagColor: "bg-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))]",
                    image: "https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/df669c6d-77e0-4f86-a642-433ca1cd77b1.jpeg",
                    specs: ["Оптика Schott (Германия)", "Оправа из титанового сплава", "Увеличение: 3.0x — 6.0x", "Поле обзора: 50–105 мм"],
                  },
                  {
                    name: "Ergo Pro Max",
                    price: "119 000 ₽",
                    oldPrice: "140 000 ₽",
                    tag: "Хит продаж",
                    tagColor: "bg-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))]",
                    image: "https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/8c764786-55fd-4183-8882-8e8977c53595.jpg",
                    specs: ["Оптика Schott (Германия)", "Алюминиевый сплав аэрокосм. класса", "Увеличение: 3.0x — 6.0x", "Антибликовое покрытие"],
                  },
                  {
                    name: "Individual Ergo Pro Max",
                    price: "от 120 000 ₽",
                    tag: "Индивидуальный",
                    tagColor: "bg-[hsl(var(--secondary)/0.2)] text-[hsl(var(--secondary))]",
                    image: "https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/0d0fca71-5b7a-4bd8-aa46-c5f2590eed59.jpg",
                    specs: ["5 цветов оправы на выбор", "Оптика Schott (Германия)", "Настройка под диоптрии", "Увеличение: 3.0x — 6.0x"],
                  },
                  {
                    name: "Ergo Pro",
                    price: "91 000 ₽",
                    oldPrice: "120 000 ₽",
                    tag: "Оптимальный",
                    tagColor: "bg-white/10 text-white/70",
                    image: "https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/7ed2c9b5-10e2-4b14-b729-5b9755a3e3d5.jpg",
                    specs: ["Оптика HOYA (Япония)", "Алюминиевый сплав", "Увеличение: 4.0x — 6.0x", "Поле обзора: 50 мм"],
                  },
                  {
                    name: "Комплект Ergo + Осветитель",
                    price: "64 000 ₽",
                    oldPrice: "80 000 ₽",
                    tag: "Комплект",
                    tagColor: "bg-white/10 text-white/70",
                    image: "https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/81e572ea-b705-4e77-984a-4c56607870d9.jpg",
                    specs: ["Оптика Glance (Корея)", "Увеличение: 5.0x", "Осветитель в комплекте", "Угловая конструкция"],
                  },
                  {
                    name: "Комплект Basic + Осветитель",
                    price: "44 000 ₽",
                    oldPrice: "60 000 ₽",
                    tag: "Стартовый",
                    tagColor: "bg-white/10 text-white/70",
                    image: "https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/5a3c934a-3d76-44d3-ab37-8fbd0fa349dd.jpg",
                    specs: ["Увеличение: 3.5x", "Осветитель в комплекте", "Идеально для начинающих", "Доступная цена входа"],
                  },
                ].map((product, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[hsl(var(--primary)/0.4)] transition-colors">
                    <div className="h-44 overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-white">{product.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[hsl(var(--primary))] font-bold">{product.price}</span>
                            {product.oldPrice && (
                              <span className="text-white/40 text-sm line-through">{product.oldPrice}</span>
                            )}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.tagColor}`}>
                          {product.tag}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {product.specs.map((spec, j) => (
                          <li key={j} className="text-white/55 text-sm flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[hsl(var(--primary))] flex-shrink-0" />
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Осветители */}
            <div className="mt-8">
              <h3 className="text-[hsl(var(--accent))] font-semibold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                <Icon name="Lightbulb" size={16} />
                Головные осветители
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    name: "Беспроводной Pro Max",
                    price: "59 000 ₽",
                    oldPrice: "65 000 ₽",
                    image: "https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/703a6f7a-c7ca-44c5-b547-29adc2572176.jpg",
                    specs: ["35 000 ЛК", "3 аккумулятора", "Вес 10,8 г", "Срок службы 10 000 ч"],
                  },
                  {
                    name: "Универсальный беспроводной",
                    price: "39 000 ₽",
                    oldPrice: "45 000 ₽",
                    image: "https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/87cdae99-d4e3-4196-8cfd-c57f4e3a2ae6.jpg",
                    specs: ["20 000–60 000 ЛК", "Магнитные аккумуляторы", "Крепление-прищепка", "Оранжевый фильтр"],
                  },
                  {
                    name: "Осветитель Pro",
                    price: "29 000 ₽",
                    oldPrice: "40 000 ₽",
                    image: "https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/092db74a-716a-4f9c-8a1b-a5f3f372ea05.jpg",
                    specs: ["90 000 ЛК", "CRI > 90%", "5000 К", "Плавная яркость"],
                  },
                ].map((product, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[hsl(var(--accent)/0.4)] transition-colors">
                    <div className="h-44 overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5">
                      <div className="font-semibold text-white mb-1">{product.name}</div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[hsl(var(--accent))] font-bold">{product.price}</span>
                        {product.oldPrice && (
                          <span className="text-white/40 text-sm line-through">{product.oldPrice}</span>
                        )}
                      </div>
                      <ul className="space-y-1">
                        {product.specs.map((spec, j) => (
                          <li key={j} className="text-white/55 text-sm flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[hsl(var(--accent))] flex-shrink-0" />
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Почему стать дилером */}
      <section className="py-16 px-6 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Почему выгодно быть дилером VAV DENTAL</h2>
          <p className="text-white/60 mb-10">Условия сотрудничества, которые работают на ваш бизнес</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "TrendingUp",
                title: "Высокая маржинальность",
                desc: "Дилерские скидки от 20% до 35% от розничной цены в зависимости от объёма. Широкая ценовая линейка — продукты для любого сегмента клиник.",
              },
              {
                icon: "Package",
                title: "Готовая продуктовая линейка",
                desc: "9 SKU — от стартового комплекта за 44 000 ₽ до премиального флагмана за 139 000 ₽. Закрываем все сегменты рынка.",
              },
              {
                icon: "ShieldCheck",
                title: "Сильный продукт с доказанным качеством",
                desc: "Оптика Schott и HOYA, сертифицированное оборудование, расширенная гарантия. Врачи выбирают VAV DENTAL повторно.",
              },
              {
                icon: "HeadphonesIcon",
                title: "Техподдержка и обучение",
                desc: "Обучение вашего персонала. Консультации по подбору оборудования для клиента. Сервисное обслуживание — наша забота.",
              },
              {
                icon: "Truck",
                title: "Быстрая доставка",
                desc: "Доставка по всей России. Отправка в день заказа при наличии на складе. Надёжная упаковка, страховка груза.",
              },
              {
                icon: "BarChart3",
                title: "Маркетинговая поддержка",
                desc: "Готовые материалы для продаж: каталоги, презентации, фото и видео продуктов. Совместные маркетинговые активности.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-[hsl(var(--primary)/0.15)] flex items-center justify-center mb-4">
                  <Icon name={item.icon} size={22} className="text-[hsl(var(--primary))]" />
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Условия */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">Условия партнёрства</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-4 flex items-center gap-2">
                <Icon name="CheckCircle" size={18} />
                Что получает дилер
              </h3>
              <ul className="space-y-3">
                {[
                  "Дилерские цены с фиксированной скидкой от РРЦ",
                  "Приоритетное резервирование товара на складе",
                  "Персональный менеджер для работы с партнёрами",
                  "Доступ к обучающим материалам и вебинарам",
                  "Готовые рекламные материалы (офлайн и онлайн)",
                  "Возможность демонстрации оборудования клиентам",
                  "Гарантийное и постгарантийное обслуживание",
                  "Поддержка при участии в тендерах и выставках",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/75 text-sm">
                    <Icon name="Check" size={16} className="text-[hsl(var(--primary))] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[hsl(var(--accent))] mb-4 flex items-center gap-2">
                <Icon name="ClipboardList" size={18} />
                Требования к партнёру
              </h3>
              <ul className="space-y-3">
                {[
                  "Наличие ИП или ООО с опытом работы в медтехнике",
                  "Готовность к минимальному объёму заказа от 2 ед./мес.",
                  "Активная клиентская база стоматологических клиник в регионе",
                  "Наличие продавцов/представителей для работы с клиентами",
                  "Готовность к обучению по продукту (онлайн, 2–3 часа)",
                  "Соблюдение рекомендованных розничных цен (РРЦ)",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/75 text-sm">
                    <Icon name="ArrowRight" size={16} className="text-[hsl(var(--accent))] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 bg-[hsl(var(--primary)/0.08)] border border-[hsl(var(--primary)/0.2)] rounded-xl">
                <p className="text-sm text-white/80">
                  <strong className="text-[hsl(var(--primary))]">Расчёт выгоды:</strong> при продаже 5 единиц Ergo Pro Max (119 000 ₽) в месяц с дилерской скидкой 25% — маржа составит <strong className="text-white">~148 750 ₽/мес.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Отзывы врачей */}
      <section className="py-16 px-6 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Что говорят врачи</h2>
          <p className="text-white/60 mb-10">Реальные отзывы — ваш главный инструмент продаж</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Максим Пономарев",
                role: "Хирург-имплантолог, Санкт-Петербург",
                product: "Осветитель Pro Max",
                text: "Беспроводной, лёгкий, 35 000 ЛК — достаточно для любой операции. Заряда 3 аккумуляторов хватает на весь рабочий день.",
              },
              {
                name: "Никита Щетинкин",
                role: "Эндодонтист, Екатеринбург",
                product: "Titanium Ergo Pro Max",
                text: "Лучшее вложение за последние 5 лет. Титановая оправа невесомая, оптика Schott даёт чёткость без единого намёка на виньетирование.",
              },
              {
                name: "Роман Фомичев",
                role: "Пародонтолог, Краснодар",
                product: "Ergo Pro Max 6.0x",
                text: "Поле обзора 105 мм, глубина резкости отличная. Через 2 месяца использования — никаких нареканий.",
              },
            ].map((review, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Icon key={j} name="Star" size={14} className="text-[hsl(var(--accent))] fill-current" />
                  ))}
                </div>
                <p className="text-white/75 text-sm leading-relaxed mb-4">«{review.text}»</p>
                <div>
                  <div className="font-semibold text-white text-sm">{review.name}</div>
                  <div className="text-white/50 text-xs">{review.role}</div>
                  <div className="text-[hsl(var(--primary))] text-xs mt-1">{review.product}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Форма заявки */}
      <section className="py-16 px-6 border-t border-white/10" id="contact">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Стать дилером VAV DENTAL</h2>
            <p className="text-white/60">Оставьте заявку — свяжемся в течение 24 часов и обсудим условия сотрудничества</p>
          </div>

          {submitted ? (
            <div className="bg-[hsl(var(--primary)/0.1)] border border-[hsl(var(--primary)/0.3)] rounded-2xl p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--primary)/0.2)] flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={32} className="text-[hsl(var(--primary))]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Заявка отправлена!</h3>
              <p className="text-white/60">Наш менеджер свяжется с вами в течение 24 часов для обсуждения условий партнёрства.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Ваше имя *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[hsl(var(--primary)/0.6)] transition-colors"
                    placeholder="Иван Иванов"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Компания *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[hsl(var(--primary)/0.6)] transition-colors"
                    placeholder="ООО «МедТех»"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Город / Регион *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[hsl(var(--primary)/0.6)] transition-colors"
                    placeholder="Новосибирск"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Телефон *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[hsl(var(--primary)/0.6)] transition-colors"
                    placeholder="+7 (999) 000-00-00"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[hsl(var(--primary)/0.6)] transition-colors"
                  placeholder="ivan@company.ru"
                />
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">Комментарий</label>
                <textarea
                  rows={3}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[hsl(var(--primary)/0.6)] transition-colors resize-none"
                  placeholder="Расскажите о вашей компании, регионе присутствия, опыте в медтехнике..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.85)] text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="Send" size={18} />
                Отправить заявку на партнёрство
              </button>

              <p className="text-white/40 text-xs text-center">
                Нажимая кнопку, вы соглашаетесь с{" "}
                <a href="/privacy" className="underline hover:text-white/60 transition-colors">
                  политикой конфиденциальности
                </a>
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-sm">
          <div className="font-bold text-white/60">
            VAV<span className="text-[hsl(var(--primary))]">DENTAL</span>
          </div>
          <div>{address}</div>
          <div className="flex items-center gap-4">
            <a href={`tel:${phone.replace(/\D/g, "")}`} className="hover:text-white/70 transition-colors flex items-center gap-1">
              <Icon name="Phone" size={14} />
              {phone}
            </a>
            <a href={`mailto:${email}`} className="hover:text-white/70 transition-colors flex items-center gap-1">
              <Icon name="Mail" size={14} />
              {email}
            </a>
          </div>
        </div>
      </footer>

      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Dealer;