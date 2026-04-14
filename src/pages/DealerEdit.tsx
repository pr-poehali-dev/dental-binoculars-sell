import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function DealerEdit() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center px-4">
      <div className="text-center">
        <Icon name="Info" size={48} className="text-white/20 mx-auto mb-4" />
        <p className="text-white/40 mb-6">Редактор недоступен</p>
        <button
          onClick={() => navigate("/dealer")}
          className="text-white/60 hover:text-white transition-colors flex items-center gap-2 mx-auto"
        >
          <Icon name="ArrowLeft" size={16} />
          Назад
        </button>
      </div>
    </div>
  );
}
