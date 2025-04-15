const menuItems = [
  {
    title: 'Adopsi Pohon',
    image: '/images/program-kami/adopsi-pohon.png',
    url: '/program-kami/adopsi-pohon',
  },
  {
    title: 'Pemberdayaan Masyarakat',
    image: '/images/program-kami/pemberdayaan-masyrakat.png',
    url: '/program-kami/pemberdayaan-masyarakat',
  },
  {
    title: 'Patroli and Geo-Tangging',
    image: '/images/program-kami/patroli-and-geo-tangging.png',
    url: '/program-kami/patroli-and-geo-tangging',
  },
  {
    title: 'Monitoring Biodiversity',
    image: '/images/program-kami/monitoring-biodiversity.png',
    url: '/program-kami/monitoring-biodiversity',
  },
];

export function ProgramKamiScreen() {
  return (
    <div className="m-auto mt-6 max-w-6xl flex flex-col gap-6 items-center">
      <h1 className="text-2xl font-bold">Program Kami</h1>
      <p className="text-center text-xl text-primary">
        Kami berkomitment penuh dalam melakukan pemberdayaan masyarakat melalui Kelompok Usaha
        Perkebunan Sosial kepada seluruh komunitas kami
      </p>
      {/* Menu for each one row is two item card with image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {menuItems.map((item) => (
          <div key={item.title} className="relative">
            <a href={item.url} className="block overflow-hidden rounded-lg shadow-md">
              <img src={item.image} alt={item.title} className="w-full h-auto" />
              {/* <h2 className="absolute top-2 left-2 text-3xl font-bold text-white">{item.title}</h2> */}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
