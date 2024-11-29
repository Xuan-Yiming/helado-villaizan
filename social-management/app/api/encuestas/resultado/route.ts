import { NextRequest, NextResponse } from 'next/server';
import { load_responses_by_encuesta_id } from '@/app/lib/database'; // Ajusta la ruta de importación si es necesario

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    try {
        const responses = await load_responses_by_encuesta_id(id);
        return NextResponse.json(responses, { status: 200 });
    } catch (error) {
        console.error('Error fetching responses:', error);
        return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
    }
}