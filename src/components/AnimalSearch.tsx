'use client';

import { useState, useEffect } from 'react';

export default function AnimalSearch() {
  const [razas, setRazas] = useState<string[]>([]);
  const [breed, setBreed] = useState('');
  const [detalle, setDetalle] = useState<{ image: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Consumo real de la API pública Dog CEO al montar el componente
  useEffect(() => {
    async function fetchRazasReales() {
      setLoading(true);
      try {
        const response = await fetch('https://dog.ceo/api/breeds/list/all');
        const data = await response.json();
        
        if (data.status === 'success') {
          // La API regresa un objeto de llaves, las convertimos en un arreglo de nombres
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

  // Consumo real del endpoint de imágenes aleatorias por raza seleccionada
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Buscador de Razas (Dog CEO API en Vivo)
      </h2>
      
      {/* Selector dinámico poblado por el fetch de la API */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-800 uppercase"
        >
          <option value="">{loading ? 'Consultando servidor...' : '-- Selecciona una raza --'}</option>
          {razas.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <button
          onClick={obtenerDetalleReal}
          disabled={!breed || loading}
          className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-all"
        >
          {loading ? 'Cargando...' : 'Consultar API'}
        </button>
      </div>

      {/* Tarjeta de resultados basada netamente en la respuesta del servidor */}
      {detalle && (
        <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 flex flex-col md:flex-row gap-6 items-center">
          <img
            src={detalle.image}
            alt={detalle.name}
            className="w-48 h-48 object-cover rounded-lg shadow-md"
          />
          <div className="flex-1 text-gray-700 space-y-2">
            <h3 className="text-xl font-bold text-gray-900">
              Raza: {detalle.name}
            </h3>
            <p><strong>Estatus de Red:</strong> Conectado a Dog CEO API (HTTP 200 OK)</p>
            <p><strong>Tipo de consumo:</strong> Petición Asíncrona (Fetch / JSON)</p>
          </div>
        </div>
      )}
    </div>
  );
}