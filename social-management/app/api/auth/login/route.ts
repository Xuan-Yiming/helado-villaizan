'use server';

import { NextResponse } from "next/server";
import { authenticate_user } from "@/app/lib/database";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  // para pruebas
  // Replace with your external API URL for authentication

  try {
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }
    const data = await authenticate_user(email, password);
    // Successful authentication, return the token or set a cookie

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Authentication failed" },
        { status: 401 }
      );
    }
    // You can set a cookie or send the token to the client
    const res = NextResponse.json({ success: true, data });

    return res;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
