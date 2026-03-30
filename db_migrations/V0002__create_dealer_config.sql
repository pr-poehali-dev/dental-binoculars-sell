CREATE TABLE t_p27497026_dental_binoculars_se.dealer_config (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO t_p27497026_dental_binoculars_se.dealer_config (key, value) VALUES
('company_name', 'VAV DENTAL'),
('company_description', 'VAV DENTAL — российская компания с более чем 15-летним опытом в разработке и поставке профессиональной оптики для стоматологов. Мы работаем с лучшими производителями оптики: Schott (Германия), HOYA (Япония), Glance (Корея). Наши изделия используют более 3000 врачей по всей России.'),
('address', 'пр-т Королёва 5д, г.Королёв, Московская область'),
('phone', '+7 (495) 000-00-00'),
('email', 'dealer@vavdental.ru'),
('hero_title', 'Коммерческое предложение для дилеров'),
('hero_subtitle', 'Станьте официальным партнёром VAV DENTAL и получите доступ к эксклюзивным условиям на профессиональную стоматологическую оптику'),
('margin_info', 'Маржинальность 25–40%'),
('min_order', 'Первый заказ от 1 единицы'),
('delivery_info', 'Доставка за 1–3 дня по всей России'),
('admin_password', 'vavdental2024');
