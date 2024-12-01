import { delete_survey } from "@/app/lib/database"; // Adjust the import path as needed
import { NextResponse } from "next/server";

interface Params {
  id: string;
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "ID is required" },
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins (use cautiously in production)
          "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
        },
      }
    );
  }

  try {
    await delete_survey(id);
    return NextResponse.json(
      { message: "Survey disabled successfully" },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins
          "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
        },
      }
    );
  } catch (error) {
    console.error("Error disabling survey:", error);
    return NextResponse.json(
      { error: "Failed to disable survey" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins
          "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
        },
      }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
