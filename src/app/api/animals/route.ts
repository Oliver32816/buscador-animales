import { NextResponse } from 'next/server';

// PEGA AQUÍ TU API KEY REAL QUE TE LLEGÓ AL CORREO (ej: live_xxxxxxxx...)
const API_KEY = 'live_aded9hc0tAHDb0EQnuVzz5JNR4MkfFsyr6dADgGtkTxJ3k36wTZ7DqlVCgkHRLS1'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get('tipo');
  const breedId = searchParams.get('breedId');

  const headers: Record<string, string> = {
    'x-api-key': API_KEY
  };

  try {
    if (breedId) {
      // Petición real oficial para el detalle de la raza y su imagen
      const url = tipo === 'cats'
        ? `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
        : `https://api.thedogapi.com/v1/images/search?breed_ids=${breedId}`;
      
      const respuesta = await fetch(url, { headers });
      if (!respuesta.ok) throw new Error('Fallo al conectar con la API externa');
      
      const data = await respuesta.json();
      return NextResponse.json(data);
    } else {
      // Petición real oficial para listar todas las razas del mundo
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