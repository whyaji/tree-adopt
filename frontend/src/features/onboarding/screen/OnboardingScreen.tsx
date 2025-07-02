import Autoplay from 'embla-carousel-autoplay';
import { Camera, ChevronDown, Heart, MapPin, Shield, Sprout, TreePine, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

type OnboardingScreenProps = {
  isInHomescreen?: boolean;
};

export function OnboardingScreen({ isInHomescreen = false }: OnboardingScreenProps) {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [carouselCurrent, setCarouselCurrent] = useState(0);
  const [carouselCount, setCarouselCount] = useState(0);
  const [animatedValues, setAnimatedValues] = useState<number[]>([0, 0, 0, 0]);

  const logoImage = '/images/tree-adopt-logo.png';

  const heroImages = [
    '/images/onboard/forest-from-top.jpg',
    '/images/onboard/forest.jpg',
    '/images/onboard/forest-with-orang-utan.jpg',
    '/images/onboard/forest-with-river.jpg',
  ];

  const adoptTreeImages = [
    '/images/onboard/adopt-tree-01.jpg',
    '/images/onboard/adopt-tree-02.jpg',
    '/images/onboard/adopt-tree-03.jpg',
  ];

  const treeImages = [
    '/images/onboard/tree-01.jpg',
    '/images/onboard/tree-02.jpg',
    '/images/onboard/tree-03.jpg',
    '/images/onboard/tree-04.jpg',
  ];

  const carouselItems = [
    { src: '/images/home-carousel-1.png', alt: 'home carousel 1' },
    { src: '/images/home-carousel-2.png', alt: 'home carousel 2' },
    { src: '/images/home-carousel-3.png', alt: 'home carousel 3' },
  ];

  const statsData = [
    {
      value: 200,
      label: 'Donasi Adopsi Pohon Terkumpul',
      unit: 'Pohon',
      icon: <TreePine className="h-8 w-8" />,
      color: '#10b981', // emerald-500
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    {
      value: 300,
      label: 'Orang / Instansi Adopsi Pohon',
      unit: 'Adopters',
      icon: <Heart className="h-8 w-8" />,
      color: '#f59e0b', // amber-500
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    {
      value: 4,
      label: 'Komunitas Lokasi Perhutanan Sosial',
      unit: 'Komunitas',
      icon: <MapPin className="h-8 w-8" />,
      color: '#3b82f6', // blue-500
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      value: 300,
      label: 'Batang Pohon Telah Teradopsi',
      unit: 'Pohon',
      icon: <Sprout className="h-8 w-8" />,
      color: '#22c55e', // green-500
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
  ];

  const partnerItems = [
    { src: '/images/mitra-danau-seluluk-jaya.png', alt: 'Mitra Danau Seluluk Jaya' },
    { src: '/images/mitra-kph.png', alt: 'Mitra KPH' },
    { src: '/images/mitra-kth-mawar-bersemi.png', alt: 'Mitra KTH Mawar Bersemi' },
    { src: '/images/mitra-masoraian.png', alt: 'Mitra Masoraian' },
    { src: '/images/mitra-petak-puti.jpg', alt: 'Mitra Petak Puti' },
    { src: '/images/mitra-tani-sejati.jpg', alt: 'Mitra Tani Sejati' },
    { src: '/images/mitra-ssms.png', alt: 'Mitra SSMS' },
  ];

  // Hero image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Carousel API setup
  useEffect(() => {
    if (!api) {
      return;
    }

    setCarouselCount(api.scrollSnapList().length);
    setCarouselCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCarouselCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id === 'animate-stats') {
            statsData.forEach((item, index) => {
              const targetValue = item.value;
              let currentValue = 0;
              const increment = Math.ceil(targetValue / 60);

              const interval = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                  currentValue = targetValue;
                  clearInterval(interval);
                }
                setAnimatedValues((prev) => {
                  const newValues = [...prev];
                  newValues[index] = currentValue;
                  return newValues;
                });
              }, 30);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsElement = document.getElementById('animate-stats');
    if (statsElement) {
      observer.observe(statsElement);
    }

    return () => observer.disconnect();
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[id^="animate-"]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const fadeInClass = (id: string) =>
    isVisible[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {!isInHomescreen && (
        <header className="absolute z-50 top-0 left-0 w-full bg-[#21392c]/95 backdrop-blur-md shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={logoImage}
                alt="TreeAdopt Logo"
                className="h-12 object-contain rounded-full"
              />
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/10"
                onClick={() => (window.location.href = '/login')}>
                Masuk
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => (window.location.href = '/register')}>
                Daftar
              </Button>
            </div>
          </div>
        </header>
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Slideshow */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-2000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}>
              <img
                src={image}
                alt={`Forest view ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in-up text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
            Lindungi Hutan
            <span className="block text-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
              Untuk Masa Depan
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up animation-delay-300 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
            Bergabunglah dengan misi konservasi hutan Indonesia. Adopsi pohon, pantau pertumbuhan,
            dan berkontribusi untuk kelestarian alam.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
            {!isInHomescreen && (
              <>
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                  onClick={() => (window.location.href = '/register')}>
                  Gabung Sekarang
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 bg-white/20 backdrop-blur border-white/30 text-white hover:bg-white/30 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                  onClick={() => (window.location.href = '/about')}>
                  Pelajari Lebih Lanjut
                </Button>
              </>
            )}
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-4 bg-secondary text-secondary-foreground hover:bg-secondary/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              onClick={() =>
                (window.location.href = isInHomescreen ? '/program-kami/adopsi-pohon' : '/adopt')
              }>
              Adopsi Pohon Sekarang
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white" />
        </div>
      </section>

      {/* Home Carousel Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div
            id="animate-carousel"
            className={`transition-all duration-1000 ${fadeInClass('animate-carousel')}`}>
            <div className="relative">
              <Carousel
                setApi={setApi}
                plugins={[
                  Autoplay({
                    delay: 5000,
                  }),
                ]}
                className="w-full max-w-5xl mx-auto">
                <CarouselContent>
                  {carouselItems.map((item, index) => (
                    <CarouselItem key={index}>
                      <div className="relative overflow-hidden rounded-2xl shadow-lg">
                        <div className="w-full aspect-[16/9] md:aspect-[16/9]">
                          <img
                            src={item.src}
                            alt={item.alt}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {Array.from({ length: carouselCount }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 transition-all duration-300 ${
                      carouselCurrent === index ? 'w-12 bg-white' : 'w-4 bg-white/60'
                    } rounded-full`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div
            id="animate-features"
            className={`text-center mb-16 transition-all duration-1000 ${fadeInClass('animate-features')}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Platform inovatif untuk konservasi hutan dengan teknologi terdepan dan tim ahli
              berpengalaman
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Camera className="h-12 w-12 text-primary" />,
                title: 'Dokumentasi Real-time',
                description:
                  'Tim patrol kami mengambil foto pohon adopsi Anda secara berkala untuk memantau pertumbuhan.',
              },
              {
                icon: <Shield className="h-12 w-12 text-primary" />,
                title: 'Perlindungan Terjamin',
                description:
                  'Setiap pohon yang diadopsi mendapat perlindungan 24/7 dari tim konservasi profesional.',
              },
              {
                icon: <Users className="h-12 w-12 text-primary" />,
                title: 'Komunitas Peduli',
                description:
                  'Bergabung dengan ribuan orang yang peduli lingkungan untuk masa depan yang lebih hijau.',
              },
            ].map((feature, index) => (
              <Card
                key={index}
                id={`animate-feature-${index}`}
                className={`p-6 hover:shadow-lg transition-all duration-1000 ${fadeInClass(`animate-feature-${index}`)} bg-card text-card-foreground`}>
                <CardContent className="text-center">
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="container mx-auto px-4">
          <div
            id="animate-stats"
            className={`transition-all duration-1000 ${fadeInClass('animate-stats')}`}>
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-bold mb-4">
                <span style={{ color: '#237277' }}>Dampak </span>
                <span className="text-foreground">Tree</span>
                <span style={{ color: '#237277' }}> Adopt</span>
              </h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Bersama-sama kita telah menciptakan dampak nyata untuk kelestarian hutan Indonesia
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {statsData.map((item, index) => {
                const animatedValue = animatedValues[index];
                const progressPercentage = (animatedValue / item.value) * 100;

                return (
                  <Card
                    key={index}
                    className={`relative overflow-hidden ${item.bgColor} ${item.borderColor} border-2 hover:shadow-xl transition-all duration-500 group`}>
                    <CardContent className="p-6">
                      {/* Icon with gradient background */}
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                          color: 'white',
                        }}>
                        {item.icon}
                      </div>

                      {/* Animated Counter */}
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span
                            className="text-4xl md:text-5xl font-bold tracking-tight"
                            style={{ color: item.color }}>
                            {Math.floor(animatedValue).toLocaleString()}
                          </span>
                          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            {item.unit}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="w-full bg-white/60 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                            style={{
                              width: `${progressPercentage}%`,
                              background: `linear-gradient(90deg, ${item.color}, ${item.color}cc)`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Label */}
                      <p className="text-sm font-medium text-foreground leading-snug">
                        {item.label}
                      </p>

                      {/* Decorative corner accent */}
                      <div
                        className="absolute top-0 right-0 w-20 h-20 opacity-10 -translate-y-10 translate-x-10 rotate-12"
                        style={{ backgroundColor: item.color }}></div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Additional Impact Statement */}
            <div className="text-center mt-16">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg border border-green-200">
                <TreePine className="h-6 w-6 text-green-600" />
                <span className="text-lg font-semibold text-gray-700">
                  Bersama menjaga{' '}
                  <span className="text-green-600">
                    {animatedValues.reduce((a, b) => a + b, 0).toLocaleString()}
                  </span>{' '}
                  kehidupan di hutan
                </span>
                <TreePine className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Adopt Tree Gallery */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div
            id="animate-adopt"
            className={`text-center mb-16 transition-all duration-1000 ${fadeInClass('animate-adopt')}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pohon Siap Adopsi
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Dokumentasi langsung dari tim patrol kami - setiap pohon telah dipilih dengan cermat
              untuk program adopsi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {adoptTreeImages.map((image, index) => (
              <div
                key={index}
                id={`animate-adopt-${index}`}
                className={`group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-1000 ${fadeInClass(`animate-adopt-${index}`)}`}
                style={{ animationDelay: `${index * 200}ms` }}>
                <div className="aspect-square">
                  <img
                    src={image}
                    alt={`Pohon Adopsi ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold">
                      Pohon #{String(index + 1).padStart(3, '0')}
                    </h3>
                    <p className="text-sm opacity-90">Siap untuk diadopsi</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => (window.location.href = '/adopt')}>
              Adopsi Pohon Sekarang
            </Button>
          </div>
        </div>
      </section>

      {/* Forest Gallery */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div
            id="animate-forest"
            className={`text-center mb-16 transition-all duration-1000 ${fadeInClass('animate-forest')}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Keindahan Hutan Kita
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Koleksi dokumentasi hutan Indonesia yang memukau - habitat yang kita jaga bersama
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {treeImages.map((image, index) => (
              <div
                key={index}
                id={`animate-tree-${index}`}
                className={`group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-1000 ${fadeInClass(`animate-tree-${index}`)}`}
                style={{ animationDelay: `${index * 150}ms` }}>
                <div className="aspect-[4/3]">
                  <img
                    src={image}
                    alt={`Pohon ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-sm font-medium">Koleksi #{index + 1}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div
            id="animate-partners"
            className={`transition-all duration-1000 ${fadeInClass('animate-partners')}`}>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-center gap-1">
                <h3
                  className="text-4xl md:text-5xl font-semibold text-center"
                  style={{ color: '#237277' }}>
                  Mitra Kami
                </h3>
                <p className="text-lg text-muted-foreground">Bersama Membangun Hutan Lestari</p>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-8 mt-8">
                {partnerItems.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="w-32 md:w-40 flex flex-col items-center gap-2 group">
                      <div className="overflow-hidden rounded-lg bg-white p-4 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <img
                          src={item.src}
                          alt={item.alt}
                          className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isInHomescreen && (
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <div
              id="animate-cta"
              className={`transition-all duration-1000 ${fadeInClass('animate-cta')}`}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Mulai Perjalanan Konservasi Anda
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                Setiap pohon yang Anda adopsi berkontribusi untuk masa depan yang lebih hijau.
                Bergabunglah dengan gerakan pelestarian hutan Indonesia hari ini.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-background text-primary hover:bg-gray-100"
                  onClick={() => (window.location.href = '/register')}>
                  Daftar Sekarang
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 bg-white/20 backdrop-blur border-white/30 text-white hover:bg-white/30"
                  onClick={() => (window.location.href = '/login')}>
                  Sudah Punya Akun?
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <img
                src={logoImage}
                alt="TreeAdopt Logo"
                className="h-12 object-contain rounded-full"
              />
            </div>
            <div className="text-center md:text-right">
              <p className="text-muted-foreground">
                © 2025 TreeAdopt. Melindungi hutan untuk generasi mendatang.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <style>
        {`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-up {
            animation: fade-in-up 1s ease-out;
          }

          .animation-delay-300 {
            animation-delay: 300ms;
          }

          .animation-delay-600 {
            animation-delay: 600ms;
          }
        `}
      </style>
    </div>
  );
}
