import { NextRequest, NextResponse } from 'next/server';
import { getSurveyById } from '@/app/lib/database'; // Ajusta la ruta de importación si es necesario

export async function GET(req: NextRequest) {
    // Extraer parámetros de búsqueda desde la URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); // Obtiene el ID desde los parámetros

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    try {
        const survey = await getSurveyById(id); // Llama a la función que maneja el query
        return NextResponse.json(survey, { status: 200 });
    } catch (error) {
        console.error('Error fetching survey by ID:', error);
        return NextResponse.json({ error: 'Failed to fetch survey' }, { status: 500 });
    }
}