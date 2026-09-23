import { NextResponse } from 'next/server';

const DOG_API_KEY = 'live_aded9hc0tAHDb0EQnuVzz5JNR4MkfFsyr6dADgGtkTxJ3k36wTZ7DqlVCgkHRLS1'; // Tu llave de The Dog API
const CAT_API_KEY = 'live_aded9hc0tAHDb0EQnuVzz5JNR4MkfFsyr6dADgGtkTxJ3k36wTZ7DqlVCgkHRLS1; // Tu llave de The Cat API (puedes usar la misma si te sirve, o dejarla abierta con cabecera estándar)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get('tipo');
  const breedId = searchParams.get('breedId');

  const apiKey = tipo === 'cats' ? CAT_API_KEY : DOG_API_KEY;
  const headers: Record<string, string> = {
    'x-api-key': apiKey
  };

  try {
    if (breedId) {
      const url = tipo === 'cats'
        ? `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
        : `https://api.thedogapi.com/v1/images/search?breed_ids=${breedId}`;
      
      const respuesta = await fetch(url, { headers });
      if (!respuesta.ok) throw new Error('Fallo al conectar con la API externa');
      
      const data = await respuesta.json();
      return NextResponse.json(data);
    } else {
      const url = tipo === 'cats'
        ? 'https://api.thecatapi.com/v1/breeds'
        : 'https://api.thedogapi.com/v1/breeds';
      
      const respuesta = await fetch(url, { headers });
      if (!respuesta.ok) throw new Error('Fallo al listar razas desde la API externa');
      
      const data = await respuesta.json();
      return NextResponse.json(Array.isArray(data) ? data : []);
    }
  } catch (error) {
    console.error('Error en la API proxy:', error);
    return NextResponse.json({ error: 'Error al consultar la API oficial' }, { status: 500 });
  }
}