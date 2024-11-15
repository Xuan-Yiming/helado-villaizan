import { NextRequest, NextResponse } from 'next/server';
import { get_all_surveys } from '@/app/lib/database';

export async function GET(req: NextRequest) {
    try {
        const surveys = await get_all_surveys();
        return NextResponse.json(surveys, { status: 200 });
    } catch (error) {
        console.error('Error fetching surveys:', error);
        return NextResponse.json({ error: 'Failed to fetch surveys' }, { status: 500 });
    }
}