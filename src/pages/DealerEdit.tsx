import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/6baa0592-59d1-4656-a16c-50daa08feb3f";

interface Config {
  company_name: string;
  company_description: string;
  address: string;
  phone: string;
  email: string;
  hero_title: string;
  hero_subtitle: string;
  margin_info: string;
  min_order: string;
  delivery_info: string;
  admin_password: string;
}

const FIELD_LABELS: Record<keyof Config, string> = {
  company_name: "Название компании",
  hero_title: "Заголовок КП",
  hero_subtitle: "Подзаголовок КП",
  company_description: "Описание компании",
  margin_info: "Маржинальность",
  min_order: "Минимальный заказ",
  delivery_info: "Условия доставки",
  phone: "Телефон",
  email: "Email",
  address: "Адрес",
  admin_password: "Пароль редактора",
};

const MULTILINE_FIELDS: (keyof Config)[] = ["hero_subtitle", "company_description"];

export default function DealerEdit() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchConfig = async () => {
    setLoading(true);
    const res = await fetch(API_URL);
    const data = await res.json();
    setConfig(data as Config);
    setLoading(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_password: password }),
    });
    const data = await res.json();
    if (res.ok && data.ok !== undefined) {
      setAuthed(true);
      setAuthError("");
      await fetchConfig();
    } else {
      setAuthError("Неверный пароль");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...config, admin_password: password }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateField = (key: keyof Config, value: string) => {
    setConfig((prev) => prev ? { ...prev, [key]: value } : prev);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => navigate("/dealer")} className="text-white/40 hover:text-white transition-colors">
              <Icon name="ArrowLeft" size={20} />
            </button>
            <span className="text-white font-bold text-lg">Редактор КП</span>
          </div>
          <form onSubmit={handleAuth} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-white/60 text-sm block mb-2">Пароль доступа</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[hsl(var(--primary)/0.5)]"
                autoFocus
              />
              {authError && <p className="text-red-400 text-sm mt-2">{authError}</p>}
            </div>
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-[hsl(var(--primary))] text-black font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Проверяю..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dealer")} className="text-white/40 hover:text-white transition-colors">
              <Icon name="ArrowLeft" size={20} />
            </button>
            <span className="text-white font-bold text-xl">Редактор КП</span>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-green-400 text-sm flex items-center gap-1">
                <Icon name="CheckCircle" size={16} /> Сохранено
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[hsl(var(--primary))] text-black font-semibold px-5 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              <Icon name="Save" size={16} />
              {saving ? "Сохраняю..." : "Сохранить"}
            </button>
          </div>
        </div>

        {loading || !config ? (
          <div className="text-white/40 text-center py-20">Загрузка...</div>
        ) : (
          <div className="space-y-4">
            {(Object.keys(FIELD_LABELS) as (keyof Config)[]).map((key) => (
              <div key={key} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <label className="text-white/50 text-xs uppercase tracking-wider block mb-2">
                  {FIELD_LABELS[key]}
                </label>
                {MULTILINE_FIELDS.includes(key) ? (
                  <textarea
                    value={config[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                    rows={4}
                    className="w-full bg-transparent text-white text-sm resize-none focus:outline-none placeholder:text-white/20"
                  />
                ) : (
                  <input
                    type={key === "admin_password" ? "password" : "text"}
                    value={config[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                    className="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-white/20"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
