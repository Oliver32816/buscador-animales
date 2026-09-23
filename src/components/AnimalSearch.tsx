'use client';

import { useState, useEffect } from 'react';

// Llaves separadas para evitar bloqueos de autenticación cruzada entre APIs
const DOG_API_KEY = 'live_aded9hc0tAhDB0EqnuVz5JNR4Mkffsyr6dADgGtKxJ3k36wTZ7dQlVCgkHRLS1';
const CAT_API_KEY = ''; // Dejar vacío o usar clave propia de The Cat API si se cuenta con ella

export default function AnimalSearch() {
  const [tipo, setTipo] = useState<'dogs' | 'cats'>('dogs');
  const [razas, setRazas] = useState<any[]>([]);
  const [breedId, setBreedId] = useState('');
  const [detalle, setDetalle] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Carga dinámica de todas las razas oficiales al cambiar de pestaña
  useEffect(() => {
    async function cargarRazasOficiales() {
      setLoading(true);
      setRazas([]);
      setBreedId('');
      setDetalle(null);

      try {
        const url = tipo === 'cats'
          ? 'https://api.thecatapi.com/v1/breeds'
          : 'https://api.thedogapi.com/v1/breeds';

        const apiKey = tipo === 'cats' ? CAT_API_KEY : DOG_API_KEY;
        const headers: HeadersInit = {};
        if (apiKey) {
          headers['x-api-key'] = apiKey;
        }

        const res = await fetch(url, { headers });

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        const data = await res.json();
        if (Array.isArray(data)) {
          setRazas(data);
        }
      } catch (error) {
        console.error('Error al cargar razas:', error);
        setRazas([]);
      } finally {
        setLoading(false);
      }
    }

    cargarRazasOficiales();
  }, [tipo]);

  // Obtener el detalle y la imagen oficial garantizando compatibilidad total
  const obtenerDetalle = async () => {
    if (!breedId) return;
    setLoading(true);
    setDetalle(null);

    // Ubicamos primero la raza en nuestro arreglo local para asegurar datos inmediatos
    const razaSeleccionada = razas.find((r) => r.id === breedId);

    try {
      const url = tipo === 'cats'
        ? `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
        : `https://api.thedogapi.com/v1/images/search?breed_ids=${breedId}`;

      const apiKey = tipo === 'cats' ? CAT_API_KEY : DOG_API_KEY;
      const headers: HeadersInit = {};
      if (apiKey) {
        headers['x-api-key'] = apiKey;
      }

      const res = await fetch(url, { headers });
      
      if (!res.ok) throw new Error('Error al consultar imagen');

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0 && data[0].url) {
        // Si la API devuelve la imagen correctamente con su objeto de raza
        setDetalle({
          url: data[0].url,
          breeds: data[0].breeds && data[0].breeds.length > 0 ? data[0].breeds : [razaSeleccionada]
        });
      } else if (razaSeleccionada) {
        // Respaldo inteligente: si el endpoint de imagen viene vacío, usamos los datos de la raza directamente
        setDetalle({
          url: razaSeleccionada.image?.url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
          breeds: [razaSeleccionada]
        });
      }
    } catch (error) {
      // Respaldo de emergencia en caso de caída de red
      if (razaSeleccionada) {
        setDetalle({
          url: razaSeleccionada.image?.url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
          breeds: [razaSeleccionada]
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Buscador Oficial de Mascotas</h2>
      
      {/* Botones de selección de tipo */}
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

      {/* Menú desplegable dinámico */}
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

      {/* Tarjeta de resultados */}
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