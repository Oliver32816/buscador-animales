export interface AnimalBreed {
  id: string;
  name: string;
  temperament?: string;
  origin?: string;
  life_span?: string;
  bred_for?: string;
}

export interface AnimalImageResponse {
  url: string;
  breeds: AnimalBreed[];
}

export async function obtenerRazas(tipo: 'dogs' | 'cats'): Promise<AnimalBreed[]> {
  const url = tipo === 'dogs' 
    ? 'https://api.thedogapi.com/v1/breeds' 
    : 'https://api.thecatapi.com/v1/breeds';

  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error('Error al conectar con la API');
    return await respuesta.json();
  } catch (error) {
    console.error("Error en obtenerRazas:", error);
    return [];
  }
}

export async function obtenerDetalleAnimal(tipo: 'dogs' | 'cats', breedId: string): Promise<AnimalImageResponse | null> {
  const url = tipo === 'dogs'
    ? `https://api.thedogapi.com/v1/images/search?breed_ids=${breedId}`
    : `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`;

  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error('Error al obtener los detalles');
    const datos: AnimalImageResponse[] = await respuesta.json();
    return datos.length > 0 ? datos[0] : null;
  } catch (error) {
    console.error("Error en obtenerDetalleAnimal:", error);
    return null;
  }
}