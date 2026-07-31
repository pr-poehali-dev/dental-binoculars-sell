import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";

export default function Offer() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Публичная оферта</h1>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Общие положения</h2>
            <p>
              Настоящий документ является публичной офертой Индивидуального предпринимателя Вердяна Аршака
              Вагифовича (далее — «Продавец») и содержит все существенные условия продажи товаров,
              представленных на сайте. В соответствии со статьёй 437 Гражданского кодекса Российской
              Федерации данный документ является публичной офертой, и в случае принятия изложенных ниже
              условий (акцепта) физическое или юридическое лицо, производящее акцепт этой оферты, становится
              Покупателем.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Предмет оферты</h2>
            <p>
              Продавец обязуется передать в собственность Покупателя товар, а Покупатель обязуется принять
              и оплатить товар на условиях настоящей оферты. Ассортимент, характеристики и цены товаров
              указаны на сайте и могут изменяться Продавцом в одностороннем порядке.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Оформление заказа</h2>
            <p>
              Заказ оформляется через формы обратной связи на сайте. После получения заявки менеджер
              Продавца связывается с Покупателем для подтверждения заказа, уточнения деталей, стоимости
              и условий доставки.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Цена и оплата товара</h2>
            <p>
              Цены на товары указываются в российских рублях и включают все применимые налоги. Оплата
              производится способом, согласованным с менеджером Продавца при подтверждении заказа.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Доставка</h2>
            <p>
              Способ и сроки доставки согласовываются индивидуально при подтверждении заказа. Право
              собственности и риск случайной гибели или повреждения товара переходят к Покупателю с
              момента передачи товара Покупателю или указанному им лицу.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Возврат товара</h2>
            <p>
              Возврат товара надлежащего и ненадлежащего качества осуществляется в соответствии с Законом
              РФ от 07.02.1992 № 2300-1 «О защите прав потребителей». Для оформления возврата необходимо
              связаться с Продавцом по контактным данным, указанным на сайте.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Ответственность сторон</h2>
            <p>
              Стороны несут ответственность за неисполнение или ненадлежащее исполнение условий настоящей
              оферты в порядке, предусмотренном действующим законодательством Российской Федерации.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Срок действия оферты</h2>
            <p>
              Оферта действует бессрочно с момента размещения на сайте до момента отзыва Продавцом.
              Продавец вправе внести изменения в условия оферты в любое время без предварительного
              уведомления.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Реквизиты Продавца</h2>
            <div className="bg-muted/50 rounded-lg p-4 space-y-1">
              <p><span className="text-foreground font-medium">ИП Вердян Аршак Вагифович</span></p>
              <p>ИНН: 693700761112</p>
              <p>ОГРНИП: 325508100461863</p>
              <p>Адрес: пр-т Королёва 5д, г. Королёв, Московская область</p>
              <p>Телефон: +7 (925) 411-61-83, +7 (936) 229-09-59</p>
              <p>Email: vavdental@yandex.ru</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
