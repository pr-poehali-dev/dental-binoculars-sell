import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { getCart, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartCount, CartItem } from '@/lib/cart';

export default function Cart() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    comment: ''
  });

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    const updatedCart = updateQuantity(productId, newQuantity);
    setCart(updatedCart);
  };

  const handleRemove = (productId: number) => {
    const updatedCart = removeFromCart(productId);
    setCart(updatedCart);
    toast({
      title: "Товар удален",
      description: "Товар удален из корзины",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderDetails = cart.map(item => `${item.name} x${item.quantity}`).join(', ');
    const total = getCartTotal(cart);
    
    toast({
      title: "Заказ отправлен!",
      description: `Мы свяжемся с вами в ближайшее время. Сумма заказа: ${total.toLocaleString('ru-RU')} ₽`,
    });

    clearCart();
    setCart([]);
    setFormData({ name: '', phone: '', email: '', comment: '' });
  };

  const total = getCartTotal(cart);
  const itemCount = getCartCount(cart);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              На главную
            </Button>
            <div className="flex items-center space-x-3">
              <img 
                src="https://cdn.poehali.dev/files/b241c320-0fc6-4325-861e-db45258a83a7.jpg" 
                alt="VAV DENTAL" 
                className="h-20 cursor-pointer" 
                onClick={() => navigate('/')}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Корзина</h1>

        {cart.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Icon name="ShoppingCart" size={64} className="mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold mb-2">Корзина пуста</h2>
              <p className="text-gray-400 mb-6">Добавьте товары из каталога</p>
              <Button onClick={() => navigate('/', { state: { scrollTo: 'catalog' } })}>
                Перейти в каталог
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-24 h-24 object-cover rounded cursor-pointer"
                        onClick={() => navigate(`/product/${item.id}`)}
                      />
                      <div className="flex-1">
                        <h3 
                          className="font-bold mb-2 cursor-pointer hover:text-primary"
                          onClick={() => navigate(`/product/${item.id}`)}
                        >
                          {item.name}
                        </h3>
                        <p className="text-2xl font-bold text-primary mb-4">
                          {item.price.toLocaleString('ru-RU')} ₽
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Icon name="Minus" size={16} />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            className="w-20 text-center"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Icon name="Plus" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleRemove(item.id)}
                          >
                            <Icon name="Trash2" size={20} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Оформление заказа</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-lg">
                      <span>Товаров:</span>
                      <span>{itemCount} шт</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold border-t pt-4">
                      <span>Итого:</span>
                      <span className="text-primary">{total.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Имя *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ваше имя"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="example@mail.ru"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comment">Комментарий</Label>
                      <Textarea
                        id="comment"
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        placeholder="Укажите дополнительную информацию"
                        rows={3}
                      />
                    </div>
                    <Button type="submit" className="w-full" size="lg">
                      <Icon name="Send" size={20} className="mr-2" />
                      Оформить заказ
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
