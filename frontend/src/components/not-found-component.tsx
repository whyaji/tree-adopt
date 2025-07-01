import { ArrowLeft, FileQuestion, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function NotFoundComponent() {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="rounded-full bg-blue-100 p-3">
                <FileQuestion className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            {/* Title and Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Halaman Tidak Ditemukan</h1>
              <p className="text-gray-600">
                Halaman yang Anda cari tidak ditemukan. Mungkin telah dipindahkan, dihapus, atau
                Anda memasukkan URL yang salah.
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button variant="outline" onClick={handleGoBack} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
              <Button onClick={handleGoHome} className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Ke Beranda
              </Button>
            </div>

            {/* Additional Info */}
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">Error Code: 404 - Not Found</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
