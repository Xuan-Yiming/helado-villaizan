
// /app/api/getClientIp/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Check common headers to find the client IP address
  const clientIp = 
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||  // Handle proxies
    req.headers.get('x-real-ip') ||  // Common header for real IP
    req.ip || 
    'IP not found';

    // //console.log('Client IP:', clientIp);

    if (clientIp === 'IP not found') {
        return NextResponse.error();
    } else {
      return NextResponse.json({ ip: clientIp });
    }
}