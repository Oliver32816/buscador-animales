import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get('tipo');
  const breedId = searchParams.get('breedId');

  try {
    if (breedId) {
      // Petición para detalle de una raza
      const url = tipo === 'cats'
        ? `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
        : `https://api.thedogapi.com/v1/images/search?breed_ids=${breedId}`;
      
      const res = await fetch(url);
      const data = await res.json();
      return NextResponse.json(data);
    } else {
      // Petición para listar todas las razas
      const url = tipo === 'cats'
        ? 'https://api.thecatapi.com/v1/breeds'
        : 'https://api.thedogapi.com/v1/breeds';
      
      const res = await fetch(url);
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error al conectar con la API externa' }, { status: 500 });
  }
}