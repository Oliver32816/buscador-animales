'use client';

import { useState, useEffect } from 'react';

const FALLBACK_DOGS = [
  { 
    id: 'labrador', 
    name: 'Labrador Retriever', 
    temperament: 'Amigable, activo, extrovertido', 
    origin: 'Canadá, Reino Unido', 
    life_span: '10 - 12 años',
    image: { url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1' }
  },
  { 
    id: 'german_shepherd', 
    name: 'Pastor Alemán', 
    temperament: 'Alerta, obediente, confidente, inteligente', 
    origin: 'Alemania', 
    life_span: '7 - 10 años',
    image: { url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95' }
  },
  { 
    id: 'golden', 
    name: 'Golden Retriever', 
    temperament: 'Inteligente, bondadoso, confiable, amable', 
    origin: 'Reino Unido', 
    life_span: '10 - 12 años',
    image: { url: 'https://images.unsplash.com/photo-1552053831-71594a27632d' }
  }
];

const FALLBACK_CATS = [
  { 
    id: 'siamese', 
    name: 'Siamés', 
    temperament: 'Activo, ágil, sociable, vocal, inteligente', 
    origin: 'Tailandia', 
    life_span: '12 - 15 años',
    image: { url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba' }
  },
  { 
    id: 'persian', 
    name: 'Persa', 
    temperament: 'Cariñoso, tranquilo, pacífico, quieto', 
    origin: 'Irán (Persia)', 
    life_span: '10 - 17 años',
    image: { url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006' }
  },
  { 
    id: 'bengal', 
    name: 'Bengalí', 
    temperament: 'Alerta, ágil, independiente, curioso, amigable', 
    origin: 'Estados Unidos', 
    life_span: '12 - 15 años',
    image: { url: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8' }
  }
];

const API_KEY = 'live_aded9hc0tAhDB0EqnuVz5JNR4Mkffsyr6dADgGtKxJ3k36wTZ7dQlVCgkHRLS1';

export default function AnimalSearch() {
  const [tipo, setTipo] = useState<'dogs' | 'cats'>('dogs');
  const [razas, setRazas] = useState<any[]>([]);
  const [breedId, setBreedId] = useState('');
  const [detalle, setDetalle] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function cargarRazas() {
      setLoading(true);
      setRazas([]);
      setBreedId('');
      setDetalle(null);

      try {
        const url = tipo === 'cats'
          ? 'https://api.thecatapi.com/v1/breeds'
          : 'https://api.thedogapi.com/v1/breeds';

        const res = await fetch(url, {
          headers: { 'x-api-key': API_KEY }
        });

        if (!res.ok) throw new Error('API bloqueada');

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setRazas(data);
        } else {
          setRazas(tipo === 'cats' ? FALLBACK_CATS : FALLBACK_DOGS);
        }
      } catch (error) {
        setRazas(tipo === 'cats' ? FALLBACK_CATS : FALLBACK_DOGS);
      } finally {
        setLoading(false);
      }
    }

    cargarRazas();
  }, [tipo]);

  const obtenerDetalle = () => {
    if (!breedId) return;
    setLoading(true);

    // Buscamos directamente la raza seleccionada dentro del arreglo local que ya contiene toda la info
    const razaEncontrada = razas.find((r) => r.id === breedId);

    if (razaEncontrada) {
      setDetalle({
        url: razaEncontrada.image?.url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
        breeds: [
          {
            name: razaEncontrada.name || 'Mascota',
            temperament: razaEncontrada.temperament || 'No especificado',
            origin: razaEncontrada.origin || 'Desconocido',
            life_span: razaEncontrada.life_span || '10 - 15 años'
          }
        ]
      });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Buscador Oficial de Mascotas</h2>
      
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
          Ver información
        </button>
      </div>

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
            <p><strong>Temperamento:</strong> {detalle.breeds?.[0]?.temperament}</p>
            <p><strong>Origen:</strong> {detalle.breeds?.[0]?.origin}</p>
            <p><strong>Esperanza de vida:</strong> {detalle.breeds?.[0]?.life_span}</p>
          </div>
        </div>
      )}
    </div>
  );
}