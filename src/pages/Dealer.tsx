import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const companyName = "VAV DENTAL";
const heroTitle = "Коммерческое предложение для дилеров";
const heroSubtitle = "Приглашаем региональных партнёров к сотрудничеству в сфере профессиональной стоматологической оптики";
const companyDesc = "VAV DENTAL — российская компания с более чем 15-летним опытом в разработке и поставке профессиональной оптики для стоматологов.";
const phone = "+7 (925) 411-61-83";
const email = "vavdental@yandex.ru";
const address = "пр-т Королёва 5д, г.Королёв, Московская область";
const marginInfo = "Маржинальность 25–40%";
const minOrder = "Первый заказ от 1 единицы";
const deliveryInfo = "Доставка за 1–3 дня по всей России";

const Dealer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    city: "",
    phone: "",
    email: "",
    comment: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="text-white/50 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
          <p className="mt-10 text-white/60 text-lg max-w-3xl">{companyDesc}</p>
        </div>
      </section>

      {/* Условия */}
      <section className="py-16 px-6 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">Условия партнёрства</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "TrendingUp", title: "Маржинальность", value: marginInfo },
              { icon: "Package", title: "Минимальный заказ", value: minOrder },
              { icon: "Truck", title: "Доставка", value: deliveryInfo },
            ].map((item, i) => (
              <div key={i} className="border border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.05)] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon name={item.icon} size={20} className="text-[hsl(var(--primary))]" />
                  <span className="text-white/50 text-sm">{item.title}</span>
                </div>
                <div className="text-xl font-semibold">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Контакты */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">Контакты</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: "Phone", label: "Телефон", value: phone },
              { icon: "Mail", label: "Email", value: email },
              { icon: "MapPin", label: "Адрес", value: address },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Icon name={item.icon} size={18} className="text-[hsl(var(--primary))]" />
                </div>
                <div>
                  <div className="text-white/40 text-xs mb-1">{item.label}</div>
                  <div className="text-white font-medium">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Форма */}
          {submitted ? (
            <div className="bg-[hsl(var(--primary)/0.1)] border border-[hsl(var(--primary)/0.3)] rounded-2xl p-10 text-center max-w-lg mx-auto">
              <Icon name="CheckCircle" size={48} className="text-[hsl(var(--primary))] mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Заявка отправлена!</h3>
              <p className="text-white/50">Мы свяжемся с вами в течение 24 часов</p>
            </div>
          ) : (
            <div className="max-w-lg mx-auto bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Стать партнёром</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { key: "name", label: "Имя", placeholder: "Ваше имя" },
                  { key: "company", label: "Компания", placeholder: "Название компании" },
                  { key: "city", label: "Город", placeholder: "Ваш город" },
                  { key: "phone", label: "Телефон", placeholder: "+7 (___) ___-__-__" },
                  { key: "email", label: "Email", placeholder: "email@example.com" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1.5">{field.label}</label>
                    <input
                      type={field.key === "email" ? "email" : "text"}
                      placeholder={field.placeholder}
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[hsl(var(--primary)/0.5)] transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-wider block mb-1.5">Комментарий</label>
                  <textarea
                    placeholder="Расскажите о вашем бизнесе..."
                    rows={3}
                    value={formData.comment}
                    onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[hsl(var(--primary)/0.5)] transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[hsl(var(--primary))] text-black font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Отправить заявку
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dealer;
