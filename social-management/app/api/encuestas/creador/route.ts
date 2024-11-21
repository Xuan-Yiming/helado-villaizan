import { NextRequest, NextResponse } from "next/server";
import { get_creator_by_survey_id } from "@/app/lib/database";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const surveyId = searchParams.get("surveyId");

  if (!surveyId) {
    return NextResponse.json({ error: "Survey ID is required" }, { status: 400 });
  }

  try {
    const creatorId = await get_creator_by_survey_id(surveyId);
    return NextResponse.json({ creatorId }, { status: 200 });
  } catch (error) {
    console.error("Error fetching survey creator:", error);
    return NextResponse.json({ error: "Failed to fetch survey creator" }, { status: 500 });
  }
}