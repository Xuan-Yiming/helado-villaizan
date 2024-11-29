import { NextRequest, NextResponse } from 'next/server';
import { update_answer_sentiment } from '@/app/lib/database'; // Ajusta la ruta según tu estructura

export async function POST(req: NextRequest) {
    const { id, sentimiento } = await req.json();

    // Validación de datos
    if (!id || !sentimiento) {
        return NextResponse.json({ error: 'ID y sentimiento son requeridos' }, { status: 400 });
    }

    try {
        // Llama a la función de actualización
        await update_answer_sentiment(id, sentimiento);
        return NextResponse.json({ message: 'Sentimiento actualizado exitosamente' }, { status: 200 });
    } catch (error) {
        console.error('Error actualizando el sentimiento:', error);
        return NextResponse.json({ error: 'Fallo al actualizar el sentimiento' }, { status: 500 });
    }
}