'use server';

import { NextResponse } from "next/server";
import { authenticate_user } from "@/app/lib/database";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await authenticate_user(email, password);

    const response = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        token: user.token,
        token_expiration: user.token_expiration,
      },
    });

    // Establecer la cookie `user_id`
    response.cookies.set("user_id", user.id, {
      httpOnly: false, // Cambiar a true en producción
      path: "/",
      maxAge: 3600, // 1 hora
    });

    return response;
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 401 }
    );
  }
}
