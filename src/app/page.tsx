import AnimalSearch from '@/components/AnimalSearch';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Buscador de Mascotas (The Dog & Cat API)
        </h1>
        <p className="text-slate-600 mt-2">
          Proyecto modular optimizado para evaluación de Programación Web Avanzada.
        </p>
      </div>
      <AnimalSearch />
    </main>
  );
}