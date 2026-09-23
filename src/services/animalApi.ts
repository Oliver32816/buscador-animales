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
  try {
    const respuesta = await fetch(`/api/animals?tipo=${tipo}`);
    if (!respuesta.ok) throw new Error('Error al conectar con el servidor');
    const datos = await respuesta.json();
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error("Error en obtenerRazas:", error);
    return [];
  }
}

export async function obtenerDetalleAnimal(tipo: 'dogs' | 'cats', breedId: string): Promise<AnimalImageResponse | null> {
  try {
    const respuesta = await fetch(`/api/animals?tipo=${tipo}&breedId=${breedId}`);
    if (!respuesta.ok) throw new Error('Error al obtener los detalles');
    const datos: AnimalImageResponse[] = await respuesta.json();
    return datos.length > 0 ? datos[0] : null;
  } catch (error) {
    console.error("Error en obtenerDetalleAnimal:", error);
    return null;
  }
}