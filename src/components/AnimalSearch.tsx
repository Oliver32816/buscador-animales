'use client';

import { useState, useEffect } from 'react';

export default function AnimalSearch() {
  const [tipo, setTipo] = useState<'dogs' | 'cats'>('dogs');
  const [razas, setRazas] = useState<any[]>([]);
  const [breedId, setBreedId] = useState('');
  const [detalle, setDetalle] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Cargar lista de razas desde nuestra propia API route (proxy)
  useEffect(() => {
    async function cargarRazas() {
      setLoading(true);
      setRazas([]);
      setBreedId('');
      setDetalle(null);

      try {
        const res = await fetch(`/api/animals?tipo=${tipo}`);
        if (!res.ok) throw new Error('Error al conectar con el servidor proxy');
        
        const data = await res.json();
        setRazas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar razas:', error);
      } finally {
        setLoading(false);
      }
    }

    cargarRazas();
  }, [tipo]);

  // Cargar detalle de la raza seleccionada
  const obtenerDetalle = async () => {
    if (!breedId) return;
    setLoading(true);
    setDetalle(null);

    try {
      const res = await fetch(`/api/animals?tipo=${tipo}&breedId=${breedId}`);
      if (!res.ok) throw new Error('Error al obtener los detalles');
      
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setDetalle(data[0]);
      }
    } catch (error) {
      console.error('Error al obtener detalle:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Buscador Oficial de Mascotas</h2>
      
      {/* Botones de selección */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setTipo('dogs')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${tipo === 'dogs' ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Perros
        </button>
        <button
          onClick={() => setTipo('cats')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${tipo === 'cats' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Gatos
        </button>
      </div>

      {/* Menú desplegable */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={breedId}
          onChange={(e) => setBreedId(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-800"
        >
          <option value="">{loading ? 'Cargando razas...' : '-- Selecciona una raza --'}</option>
          {razas.map((raza) => (
            <option key={raza.id} value={raza.id}>
              {raza.name}
            </option>
          ))}
        </select>

        <button
          onClick={obtenerDetalle}
          disabled={!breedId || loading}
          className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-all"
        >
          {loading ? 'Buscando...' : 'Ver información'}
        </button>
      </div>

      {/* Resultados */}
      {detalle && (
        <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 flex flex-col md:flex-row gap-6 items-center">
          {detalle.url && (
            <img
              src={detalle.url}
              alt="Mascota"
              className="w-48 h-48 object-cover rounded-lg shadow-md"
            />
          )}
          <div className="flex-1 text-gray-700 space-y-2">
            <h3 className="text-xl font-bold text-gray-900">
              {detalle.breeds?.[0]?.name || 'Información de la raza'}
            </h3>
            <p><strong>Temperamento:</strong> {detalle.breeds?.[0]?.temperament || 'No especificado'}</p>
            <p><strong>Origen:</strong> {detalle.breeds?.[0]?.origin || 'Desconocido'}</p>
            <p><strong>Esperanza de vida:</strong> {detalle.breeds?.[0]?.life_span || 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  );
}