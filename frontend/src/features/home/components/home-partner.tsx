const partnerItems = [
  { src: '/images/mitra-danau-seluluk-jaya.png', alt: 'Mitra Danau Seluluk Jaya' },
  { src: '/images/mitra-kph.png', alt: 'Mitra KPH' },
  { src: '/images/mitra-kth-mawar-bersemi.png', alt: 'Mitra KTH Mawar Bersemi' },
  { src: '/images/mitra-masoraian.png', alt: 'Mitra Masoraian' },
  { src: '/images/mitra-ssms.png', alt: 'Mitra SSMS' },
];

export function HomePartner() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-col items-center gap-1">
        <h3 className="text-4xl font-semibold" style={{ color: '#237277' }}>
          Mitra Kami
        </h3>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-6 mt-12 mb-12">
        {partnerItems.map((item, index) => {
          return (
            <div key={index} className="w-40 flex flex-col items-center gap-2">
              <img src={item.src} alt={item.alt} className="w-full h-auto rounded-lg" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
