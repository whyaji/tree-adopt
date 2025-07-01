import { Camera, ChevronDown, Shield, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function OnboardingScreen() {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const logoImage = '/images/tree-adopt-logo.png';

  const heroImages = [
    '/onboard/forest-from-top.jpg',
    '/onboard/forest.jpg',
    '/onboard/forest-with-orang-utan.jpg',
    '/onboard/forest-with-river.jpg',
  ];

  const adoptTreeImages = [
    '/onboard/adopt-tree-01.jpg',
    '/onboard/adopt-tree-02.jpg',
    '/onboard/adopt-tree-03.jpg',
  ];

  const treeImages = [
    '/onboard/tree-01.jpg',
    '/onboard/tree-02.jpg',
    '/onboard/tree-03.jpg',
    '/onboard/tree-04.jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
            <Button
              size="lg"
              className="text-lg px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              onClick={() => (window.location.href = '/register')}>
              Mulai Sekarang
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 bg-white/20 backdrop-blur border-white/30 text-white hover:bg-white/30 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              onClick={() => (window.location.href = '/about')}>
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
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

      {/* CTA Section */}
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
