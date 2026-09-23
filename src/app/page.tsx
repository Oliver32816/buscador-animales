import AnimalSearch from '../components/AnimalSearch';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
         Buscador de Perritos (Dog API)
        </h1>
<p className="text-center text-gray-500 mb-6 font-medium">
  Olo olo
</p>
      </div>
      <AnimalSearch />
    </main>
  );
}