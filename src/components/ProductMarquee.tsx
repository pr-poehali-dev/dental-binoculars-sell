interface Product {
  id: number;
  name: string;
  image: string;
}

interface ProductMarqueeProps {
  products: Product[];
}

const ProductMarquee = ({ products }: ProductMarqueeProps) => {
  return (
    <div className="overflow-hidden w-full h-[400px] flex items-center justify-center">
      <video
        src="https://cdn.poehali.dev/projects/37487b42-26a7-4ea4-bd44-c9a83bc78370/bucket/747b74da-3e97-4614-9f8c-4fea4cac20f4.mov"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover rounded-xl shadow-2xl"
      />
    </div>
  );
};

export default ProductMarquee;