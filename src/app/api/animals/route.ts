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
      url = `${base}?breed_ids=${breedId}`;
    } else {
      url = tipo === 'cats'
        ? 'https://api.thecatapi.com/v1/breeds'
        : 'https://thedogapi.com/v1/breeds';
    }

    console.log(`[PROXY] Consultando URL externa: ${url} para tipo: ${tipo}`);
    
    const respuesta = await fetch(url, { headers });
    
    if (!respuesta.ok) {
      const errText = await respuesta.text();
      console.error(`[PROXY ERROR] La API externa respondió ${respuesta.status}:`, errText);
      return NextResponse.json({ error: `API externa falló con estado ${respuesta.status}` }, { status: respuesta.status });
    }

    const data = await respuesta.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[PROXY EXCEPTION]:', error);
    return NextResponse.json({ error: 'Error interno en el servidor proxy' }, { status: 500 });
  }
}