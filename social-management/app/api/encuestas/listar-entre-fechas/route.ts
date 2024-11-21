import { NextRequest, NextResponse } from 'next/server';
import { get_surveys_between_dates } from '@/app/lib/database';
import { Encuesta } from '@/app/lib/types'; // Importa tu tipo Encuesta

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
        return NextResponse.json({ error: 'startDate and endDate are required' }, { status: 400 });
    }

    try {
        const surveys: Encuesta[] = await get_surveys_between_dates(startDate, endDate);
        return NextResponse.json(surveys, { status: 200 });
    } catch (error) {
        console.error('Error fetching surveys between dates:', error);
        return NextResponse.json({ error: 'Failed to fetch surveys between dates' }, { status: 500 });
    }
}

export async function get_creator_by_survey_id(surveyId: string): Promise<string> {
  await connectToDatabase();

  const query = `
    SELECT usuario_id
    FROM Encuestas
    WHERE id = $1
  `;
  const values = [surveyId];

  try {
    const result = await client!.query(query, values);
    return result.rows[0]?.usuario_id || null;
  } catch (error) {
    console.error("Error querying survey creator:", error);
    throw new Error("Database query failed");
  }
}