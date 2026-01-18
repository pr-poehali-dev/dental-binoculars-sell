import { useEffect, useRef } from 'react';

interface Product {
  id: number;
  name: string;
  image: string;
}

interface ProductMarqueeProps {
  products: Product[];
}

const ProductMarquee = ({ products }: ProductMarqueeProps) => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    let animationId: number;
    let position = 0;
    const speed = 1;

    const animate = () => {
      position -= speed;
      const itemWidth = 320;
      const totalWidth = itemWidth * products.length;

      if (Math.abs(position) >= totalWidth) {
        position = 0;
      }

      if (marquee) {
        marquee.style.transform = `translateX(${position}px)`;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [products.length]);

  const tripleProducts = [...products, ...products, ...products];

  return (
    <div className="overflow-hidden w-full bg-gradient-to-b from-black via-gray-900 to-black py-8">
      <div 
        ref={marqueeRef}
        className="flex gap-6"
        style={{ width: 'max-content' }}
      >
        {tripleProducts.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="flex-shrink-0 w-[300px] h-[200px] relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg shadow-2xl"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 rounded-b-lg">
              <p className="text-white text-sm font-medium line-clamp-2">{product.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductMarquee;
