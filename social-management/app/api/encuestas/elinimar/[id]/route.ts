// app/api/disable-survey/route.ts

import { delete_survey } from "@/app/lib/database"; // Adjust the import path as needed

import { NextResponse } from "next/server";
interface Params {
  id: string;
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await delete_survey(id);
    return NextResponse.json(
      { message: "Survey disabled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error disabling survey:", error);
    return NextResponse.json(
      { error: "Failed to disable survey" },
      { status: 500 }
    );
  }
}
