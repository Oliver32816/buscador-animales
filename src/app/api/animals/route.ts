import { NextResponse } from 'next/server';

// Datos de respaldo estáticos por si la API externa falla o está caída
const fallbackPerros = [
  { id: 'labrador', name: 'Labrador Retriever' },
  { id: 'german_shepherd', name: 'Pastor Alemán' },
  { id: 'golden', name: 'Golden Retriever' },
  { id: 'bulldog', name: 'Bulldog' },
  { id: 'poodle', name: 'Poodle (Caniche)' },
  { id: 'beagle', name: 'Beagle' },
  { id: 'chihuahua', name: 'Chihuahua' },
  { id: 'husky', name: 'Husky Siberiano' },
  { id: 'boxer', name: 'Boxer' },
  { id: 'rottweiler', name: 'Rottweiler' }
];

const fallbackGatos = [
  { id: 'persian', name: 'Persa' },
  { id: 'siamese', name: 'Siamés' },
  { id: 'maine_coon', name: 'Maine Coon' },
  { id: 'sphynx', name: 'Esfinge (Sphynx)' },
  { id: 'bengal', name: 'Bengalí' },
  { id: 'british_shorthair', name: 'Británico de Pelo Corto' },
  { id: 'ragdoll', name: 'Ragdoll' },
  { id: 'scottish_fold', name: 'Scottish Fold' }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get('tipo');
  const breedId = searchParams.get('breedId');

  try {
    if (breedId) {
      // Petición de detalle con respaldo de imagen genérica si falla
      const url = tipo === 'cats'
        ? `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
        : `https://api.thedogapi.com/v1/images/search?breed_ids=${breedId}`;
      
      const respuestaExterna = await fetch(url);
      if (respuestaExterna.ok) {
        const data = await respuestaExterna.json();
        if (Array.isArray(data) && data.length > 0) {
          return NextResponse.json(data);
        }
      }

      // Respaldo de detalle si la API externa falla
      return NextResponse.json([{
        url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
        breeds: [{
          id: breedId,
          name: 'Raza Seleccionada (Modo Respaldo)',
          temperament: 'Amigable, enérgico, cariñoso y juguetón.',
          origin: 'Internacional',
          life_span: '10 - 15 años',
          bred_for: 'Compañía'
        }]
      }]);

    } else {
      // Petición de lista de razas
      const url = tipo === 'cats'
        ? 'https://api.thecatapi.com/v1/breeds'
        : 'https://api.thedogapi.com/v1/breeds';
      
      const respuestaExterna = await fetch(url);
      if (respuestaExterna.ok) {
        const data = await respuestaExterna.json();
        if (Array.isArray(data) && data.length > 0) {
          return NextResponse.json(data);
        }
      }

      // Si la API externa falla, devolvemos nuestro respaldo garantizado
      return NextResponse.json(tipo === 'cats' ? fallbackGatos : fallbackPerros);
    }
  } catch (error) {
    console.error('Error en /api/animals (usando respaldo):', error);
    // En caso de excepción de red total, retornamos los datos locales
    return NextResponse.json(tipo === 'cats' ? fallbackGatos : fallbackPerros);
  }
}