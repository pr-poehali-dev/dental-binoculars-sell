import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { productsData } from '@/pages/product-detail/productsData';

export interface SelectedItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface ProductPickerProps {
  value: SelectedItem[];
  onChange: (items: SelectedItem[]) => void;
}

const EXCLUDED_IDS = [1, 2];
const pickerProducts = productsData.filter(p => !EXCLUDED_IDS.includes(p.id));

const formatPrice = (price: number) => `${price.toLocaleString('ru-RU')} ₽`;

const ProductPicker = ({ value, onChange }: ProductPickerProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<SelectedItem[]>(value);

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(value);
    setOpen(next);
  };

  const toggle = (product: (typeof productsData)[number]) => {
    setDraft(prev =>
      prev.some(i => i.id === product.id)
        ? prev.filter(i => i.id !== product.id)
        : [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }]
    );
  };

  const changeQty = (id: number, delta: number) => {
    setDraft(prev =>
      prev.map(i => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))
    );
  };

  const confirm = () => {
    onChange(draft);
    setOpen(false);
  };

  const removeItem = (id: number) => onChange(value.filter(i => i.id !== id));

  const total = value.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="space-y-2">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className="w-full justify-start">
            <Icon name="ShoppingBag" size={18} className="mr-2" />
            {value.length > 0 ? 'Изменить выбор товаров' : 'Выбрать товары'}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Выберите товары</DialogTitle>
            <DialogDescription>Отметьте позиции, которые хотите купить</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {pickerProducts.map(product => {
              const selected = draft.find(i => i.id === product.id);
              return (
                <div
                  key={product.id}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${selected ? 'border-primary bg-primary/5' : 'border-border'}`}
                >
                  <Checkbox
                    id={`pick-${product.id}`}
                    checked={!!selected}
                    onCheckedChange={() => toggle(product)}
                  />
                  <label htmlFor={`pick-${product.id}`} className="flex flex-1 items-center gap-3 cursor-pointer min-w-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-12 w-12 rounded object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-medium leading-snug">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.pricePrefix ? `${product.pricePrefix} ` : ''}{formatPrice(product.price)}
                      </div>
                    </div>
                  </label>
                  {selected && (
                    <div className="flex items-center gap-1 shrink-0">
                      <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => changeQty(product.id, -1)}>
                        <Icon name="Minus" size={14} />
                      </Button>
                      <span className="w-6 text-center text-sm">{selected.quantity}</span>
                      <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => changeQty(product.id, 1)}>
                        <Icon name="Plus" size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button type="button" onClick={confirm} className="w-full sm:w-auto">
              Готово{draft.length > 0 ? ` (${draft.length})` : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {value.length > 0 && (
        <div className="rounded-lg border border-border p-3 space-y-2">
          {value.map(item => (
            <div key={item.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="min-w-0">
                {item.name} <span className="text-muted-foreground">× {item.quantity}</span>
              </span>
              <span className="flex items-center gap-2 shrink-0">
                {formatPrice(item.price * item.quantity)}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Убрать"
                >
                  <Icon name="X" size={14} />
                </button>
              </span>
            </div>
          ))}
          <div className="flex justify-between border-t border-border pt-2 text-sm font-semibold">
            <span>Итого</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPicker;