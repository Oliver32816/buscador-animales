import { NextResponse } from 'next/server';

const DOG_API_KEY = 'live_aded9hc0tAhDB0EqnuVz5JNR4Mkffsyr6dADgGtKxJ3k36wTZ7dQlVCgkHRLS1';
const CAT_API_KEY = 'live_aded9hc0tAhDB0EqnuVz5JNR4Mkffsyr6dADgGtKxJ3k36wTZ7dQlVCgkHRLS1';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get('tipo');
  const breedId = searchParams.get('breedId');

  const apiKey = tipo === 'cats' ? CAT_API_KEY : DOG_API_KEY;
  const headers: Record<string, string> = {
    'x-api-key': apiKey
  };

  try {
    let url = '';
    if (breedId) {
      const base = tipo === 'cats'
        ? 'https://api.thecatapi.com/v1/images/search'
        : 'https://api.thedogapi.com/v1/images/search';
      url = `${base}?breed_ids=${breedId}&api_key=${apiKey}`;
    } else {
      const base = tipo === 'cats'
        ? 'https://api.thecatapi.com/v1/breeds'
        : 'https://api.thedogapi.com/v1/breeds';
      url = `${base}?api_key=${apiKey}`;
    }

    const respuesta = await fetch(url, { headers });
    
    if (!respuesta.ok) {
      const errorText = await respuesta.text();
      console.error(`Error externo (${respuesta.status}):`, errorText);
      throw new Error(`API Externa respondió con estado ${respuesta.status}`);
    }

    const data = await respuesta.json();
    return NextResponse.json(Array.isArray(data) ? data : []);

  } catch (error) {
    console.error('Error detallado en el proxy:', error);
    return NextResponse.json({ error: 'Error al consultar la API oficial' }, { status: 500 });
  }
}