'use server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    return NextResponse.json({ error: 'Recived.' }, { status: 200 });
};

