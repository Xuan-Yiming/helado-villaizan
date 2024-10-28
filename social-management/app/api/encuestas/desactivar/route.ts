// app/api/disable-survey/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { disable_survey } from '@/app/lib/database'; // Adjust the import path as needed

export async function POST(req: NextRequest) {
    const { id } = await req.json();

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    try {
        await disable_survey(id);
        return NextResponse.json({ message: 'Survey disabled successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error disabling survey:', error);
        return NextResponse.json({ error: 'Failed to disable survey' }, { status: 500 });
    }
}