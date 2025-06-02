import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

import { baseUrl } from '@/lib/api/api';
import { getKelompokKomunitas } from '@/lib/api/kelompokKomunitasApi';
import { KelompokKomunitasType } from '@/types/kelompokKomunitas.type';

export function KelompokKomunitasScreen() {
  const search = '';
  const page = 1;
  const limit = 10;

  const { isPending, error, data } = useQuery({
    queryKey: ['get-kelompok-komunitas', search, page, limit],
    queryFn: () => getKelompokKomunitas({ search, page, limit }),
  });

  if (error) return <div>Error: {error.message}</div>;

  if (isPending) return <div>Loading...</div>;

  return (
    <div className="m-auto mt-6 max-w-6xl flex flex-col gap-6 items-center">
      <h1 className="text-2xl font-bold">Kelompok Komunitas</h1>
      <p className="text-center text-xl text-primary">
        {`Saat ini program kami berfokus kepada ${data?.total ?? '-'} kelompok Perhutanan Sosial yang berada di Kabupaten
        Kotawaringin Barat, Provinsi Kalimantan Tengah`}
      </p>
      {/* Menu for each one row is two item card with image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {((data?.data ?? []) as KelompokKomunitasType[]).map((item) => (
          <div key={item.name} className="relative">
            <Link
              to={`/tentang-kami/kelompok-komunitas/$kelompokKomunitasName`}
              params={{ kelompokKomunitasName: item.name }}
              className="block overflow-hidden rounded-lg shadow-md">
              <div className="relative w-full pb-[56.25%]">
                {' '}
                {/* 16:9 aspect ratio */}
                <img
                  src={
                    item.image
                      ? `${baseUrl}${item.image}`
                      : 'https://place.abh.ai/s3fs-public/placeholder/DSC_0110_400x400.JPG'
                  }
                  alt={item.name}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-2 left-2">
                <h2 className="text-3xl font-bold text-white">{item.name}</h2>
                <p className="text-base text-white">Lihat Lebih Lanjut</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
