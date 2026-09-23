import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Evita que Vercel guarde en caché estática las peticiones

const DOG_API_KEY = 'live_aded9hc0tAhDB0EqnuVz5JNR4Mkffsyr6dADgGtKxJ3k36wTZ7dQlVCgkHRLS1';
const CAT_API_KEY = 'live_aded9hc0tAhDB0EqnuVz5JNR4Mkffsyr6dADgGtKxJ3k36wTZ7dQlVCgkHRLS1';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const breedId = searchParams.get('breedId');

    const apiKey = tipo === 'cats' ? CAT_API_KEY : DOG_API_KEY;
    const headers: Record<string, string> = {
      'x-api-key': apiKey
    };

    let url = '';
    if (breedId) {
      const base = tipo === 'cats'
        ? 'https://api.thecatapi.com/v1/images/search'
        : 'https://api.thedogapi.com/v1/images/search';
      url = `${base}?breed_ids=${breedId}`;
    } else {
      url = tipo === 'cats'
        ? 'https://api.thecatapi.com/v1/breeds'
        : 'https://api.thedogapi.com/v1/breeds';
    }

    const respuesta = await fetch(url, { headers });
    
    if (!respuesta.ok) {
      const errText = await respuesta.text();
      console.error(`Error externo de la API (${respuesta.status}):`, errText);
      return NextResponse.json({ error: `Fallo externo: ${respuesta.status}` }, { status: respuesta.status });
    }

    const data = await respuesta.json();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Excepción crítica en el proxy route:', error);
    return NextResponse.json({ error: 'Error interno en el servidor' }, { status: 500 });
  }
}