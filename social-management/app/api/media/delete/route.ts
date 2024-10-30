import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { url } = await request.json(); // Extraer la URL del cuerpo de la solicitud

    if (!url) {
      return NextResponse.json(
        { error: 'URL no proporcionada' },
        { status: 400 }
      );
    }

    const blobPath = new URL(url).pathname.substring(1); // Obtener el path desde la URL

    // Llamar al método del de Vercel Blob para eliminar el archivo
    await del(blobPath);

    return NextResponse.json({ message: 'Archivo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el archivo:', error);
    return NextResponse.json(
      { error: 'No se pudo eliminar el archivo' },
      { status: 500 }
    );
  }
}
