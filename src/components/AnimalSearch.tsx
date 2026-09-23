'use client';

import { useState, useEffect } from 'react';

export default function AnimalSearch() {
  const [razas, setRazas] = useState<string[]>([]);
  const [breed, setBreed] = useState('');
  const [detalle, setDetalle] = useState<{ image: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRazasReales() {
      setLoading(true);
      try {
        const response = await fetch('https://dog.ceo/api/breeds/list/all');
        const data = await response.json();
        
        if (data.status === 'success') {
          const listaRazas = Object.keys(data.message);
          setRazas(listaRazas);
        }
      } catch (error) {
        console.error('Error al conectar con la API:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRazasReales();
  }, []);

  const obtenerDetalleReal = async () => {
    if (!breed) return;
    setLoading(true);
    setDetalle(null);

    try {
      const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
      const data = await response.json();

      if (data.status === 'success') {
        setDetalle({
          image: data.message,
          name: breed.toUpperCase()
        });
      }
    } catch (error) {
      console.error('Error al obtener la imagen de la API:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-indigo-50/50 mt-6 transform transition-all duration-500 hover:shadow-indigo-100">
      
      {/* Encabezado interno con animación de entrada */}
      <div className="text-center mb-8 animate-fade-in">
        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
          🐶 Dog CEO Live API
        </span>
        <h3 className="text-2xl font-black text-gray-800 mt-3 tracking-tight">
          Buscador de Perritos
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          Explora razas y obtén fotografías reales mediante peticiones asíncronas
        </p>
      </div>
      
      {/* Controles de selección */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <select
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="w-full p-4 pl-5 pr-10 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 bg-gray-50/50 text-gray-700 font-medium uppercase transition-all duration-300 appearance-none cursor-pointer"
          >
            <option value="">{loading ? 'Cargando catálogo...' : '✨ Selecciona una raza'}</option>
            {razas.map((r) => (
              <option key={r} value={r} className="text-gray-800 font-normal">
                {r}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            ▼
          </div>
        </div>

        <button
          onClick={obtenerDetalleReal}
          disabled={!breed || loading}
          className="px-7 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Buscando
            </span>
          ) : (
            'Consultar'
          )}
        </button>
      </div>

      {/* Tarjeta de resultados animada */}
      {detalle && (
        <div className="relative overflow-hidden border border-indigo-100 rounded-2xl bg-gradient-to-br from-gray-50/80 to-indigo-50/30 p-5 flex flex-col sm:flex-row gap-6 items-center shadow-xl animate-scale-up transition-all duration-500">
          <div className="relative group w-40 h-40 flex-shrink-0">
            <img
              src={detalle.image}
              alt={detalle.name}
              className="w-full h-full object-cover rounded-xl shadow-md transform transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-indigo-900/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>

          <div className="flex-1 text-gray-700 space-y-2.5 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Resultado Exitoso</span>
              <h4 className="text-xl font-black text-gray-900 tracking-tight">
                {detalle.name}
              </h4>
            </div>
            
            <div className="text-xs space-y-1.5 bg-white/80 p-3 rounded-xl border border-indigo-50 shadow-inner">
              <p className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Estatus de Red: Conectado (HTTP 200 OK)
              </p>
              <p className="text-gray-500">
                <strong className="text-gray-700">Consumo:</strong> Petición Asíncrona Fetch API
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}