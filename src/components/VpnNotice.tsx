import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const VPN_NOTICE_KEY = "vpn_notice_dismissed";

export default function VpnNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(VPN_NOTICE_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(VPN_NOTICE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="sticky top-0 z-[100] w-full bg-accent text-accent-foreground animate-in slide-in-from-top duration-500">
      <div className="container mx-auto max-w-6xl px-4 py-2.5 flex items-center gap-3">
        <Icon name="Wifi" size={18} className="shrink-0" />
        <p className="text-sm leading-snug flex-1">
          Если у вас включён VPN, некоторые элементы сайта могут работать нестабильно.
          Рекомендуем отключить VPN для корректной работы.
        </p>
        <button
          onClick={dismiss}
          aria-label="Закрыть уведомление"
          className="shrink-0 hover:opacity-70 transition-opacity"
        >
          <Icon name="X" size={18} />
        </button>
      </div>
    </div>
  );
}
