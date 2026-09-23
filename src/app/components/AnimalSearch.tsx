'use client';

import { useState, useEffect } from 'react';
import { obtenerRazas, obtenerDetalleAnimal, AnimalBreed, AnimalImageResponse } from '../services/animalApi';

export default function AnimalSearch() {
  const [tipo, setTipo] = useState<'dogs' | 'cats'>('dogs');
  const [razas, setRazas] = useState<AnimalBreed[]>([]);
  const [razaSeleccionada, setRazaSeleccionada] = useState<string>('');
  const [detalle, setDetalle] = useState<AnimalImageResponse | null>(null);
  const [cargandoRazas, setCargandoRazas] = useState<boolean>(false);
  const [cargandoDetalle, setCargandoDetalle] = useState<boolean>(false);
  const [errorRed, setErrorRed] = useState<string | null>(null);

  useEffect(() => {
    async function cargar() {
      setCargandoRazas(true);
      setErrorRed(null);
      setRazaSeleccionada('');
      setDetalle(null);
      try {
        const resultado = await obtenerRazas(tipo);
        setRazas(resultado);
      } catch (err) {
        setErrorRed('No se pudieron cargar las razas. Verifique su conexión.');
      } finally {
        setCargandoRazas(false);
      }
    }
    cargar();
  }, [tipo]);

  const handleBuscar = async () => {
    if (!razaSeleccionada) return;
    setCargandoDetalle(true);
    setErrorRed(null);
    try {
      const resultado = await obtenerDetalleAnimal(tipo, razaSeleccionada);
      setDetalle(resultado);
    } catch (err) {
      setErrorRed('Error al obtener la información de la mascota.');
    } finally {
      setCargandoDetalle(false);
    }
  };

  const breedInfo = detalle?.breeds?.[0];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-slate-100">
      {/* Pestañas de Navegación UI */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setTipo('dogs')}
          className={`px-6 py-2.5 rounded-full font-semibold transition-all cursor-pointer ${
            tipo === 'dogs'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          🐶 Perros
        </button>
        <button
          onClick={() => setTipo('cats')}
          className={`px-6 py-2.5 rounded-full font-semibold transition-all cursor-pointer ${
            tipo === 'cats'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          🐱 Gatos
        </button>
      </div>

      {/* Control de Errores de Red */}
      {errorRed && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
          {errorRed}
        </div>
      )}

      {/* Selector y Botón */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center">
        <select
          value={razaSeleccionada}
          onChange={(e) => setRazaSeleccionada(e.target.value)}
          disabled={cargandoRazas}
          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">
            {cargandoRazas ? 'Cargando razas...' : '-- Selecciona una raza --'}
          </option>
          {razas.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleBuscar}
          disabled={!razaSeleccionada || cargandoDetalle}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium px-8 py-3 rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap"
        >
          {cargandoDetalle ? 'Buscando...' : 'Ver Información'}
        </button>
      </div>

      {/* Resultado con Retroalimentación Visual */}
      {detalle && breedInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200 items-center animate-fadeIn">
          <div className="h-64 sm:h-72 w-full rounded-lg overflow-hidden shadow-inner bg-slate-200">
            <img
              src={detalle.url}
              alt={breedInfo.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">{breedInfo.name}</h2>
            <p className="text-sm text-slate-600">
              <strong className="text-slate-800">Temperamento:</strong> {breedInfo.temperament || 'No especificado'}
            </p>
            <p className="text-sm text-slate-600">
              <strong className="text-slate-800">Origen:</strong> {breedInfo.origin || 'Desconocido'}
            </p>
            <p className="text-sm text-slate-600">
              <strong className="text-slate-800">Esperanza de vida:</strong> {breedInfo.life_span || 'No especificada'}
            </p>
            {breedInfo.bred_for && (
              <p className="text-sm text-slate-600">
                <strong className="text-slate-800">Criado para:</strong> {breedInfo.bred_for}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}