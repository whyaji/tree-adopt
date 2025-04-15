import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/tentang-kami/')({
  component: TentangKami,
});

function TentangKami() {
  return (
    <div className="flex flex-col gap-2 max-w-xl m-auto mt-6">
      <h1 className="text-2xl font-bold">Tentang Kami</h1>
      <p>
        TreeAdopt adalah platform teknologi hijau yang menghubungkan individu, komunitas, dan
        organisasi dengan inisiatif penanaman pohon di dunia nyata. Melalui aplikasi ini, pengguna
        dapat mengadopsi pohon yang ditanam oleh mitra lingkungan di seluruh dunia, melacak
        pertumbuhannya, dan berkontribusi untuk planet yang lebih hijau—semua dari ponsel cerdas
        mereka.
      </p>
    </div>
  );
}
