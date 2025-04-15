import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from 'react';

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

const carouselItems = [
  { src: '/images/home-carousel-1.png', alt: 'home carousel 1' },
  { src: '/images/home-carousel-2.png', alt: 'home carousel 2' },
  { src: '/images/home-carousel-3.png', alt: 'home carousel 3' },
];

export function HomeCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative mt-12 mb-12">
      <Carousel
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}>
        <CarouselContent>
          {carouselItems.map((item, index) => (
            <CarouselItem key={index}>
              <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`h-1 ${current === index ? 'w-12 bg-gray-300' : 'w-4 bg-gray-300'} rounded-full`}
          />
        ))}
      </div>
    </div>
  );
}
