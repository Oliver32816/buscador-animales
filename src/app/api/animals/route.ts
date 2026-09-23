import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get('tipo');
  const breedId = searchParams.get('breedId');

  try {
    if (breedId) {
      // Petición para obtener la imagen y detalles de una raza específica
      const url = tipo === 'cats'
        ? `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
        : `https://api.thedogapi.com/v1/images/search?breed_ids=${breedId}`;
      
      const respuestaExterna = await fetch(url);
      if (!respuestaExterna.ok) throw new Error('Error al conectar con la API externa de detalle');
      const data = await respuestaExterna.json();
      return NextResponse.json(data);
    } else {
      // Petición para listar todas las razas
      const url = tipo === 'cats'
        ? 'https://api.thecatapi.com/v1/breeds'
        : 'https://api.thedogapi.com/v1/breeds';
      
      const respuestaExterna = await fetch(url);
      if (!respuestaExterna.ok) throw new Error('Error al conectar con la API externa de razas');
      const data = await respuestaExterna.json();
      
      // Aseguramos que siempre regrese un arreglo JSON plano
      return NextResponse.json(Array.isArray(data) ? data : []);
    }
  } catch (error) {
    console.error('Error en /api/animals:', error);
    return NextResponse.json({ error: 'Error interno en el servidor proxy' }, { status: 500 });
  }
}