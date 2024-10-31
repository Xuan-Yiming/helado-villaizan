import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROLE_ALLOWED_PATHS } from './app/lib/constants';

function can_access_path(role: string, path: string) {

    console.log
    (`Checking access for role: ${role} and path: ${path}`);

    if (role === "admin")
        return true;

    const allowedPaths = ROLE_ALLOWED_PATHS[role];
    if (!allowedPaths) {
        throw new Error('Invalid role');
    }
    console.log("Result: ", allowedPaths.includes(path))
    return allowedPaths.includes(path);
}

export function middleware(req: NextRequest) {
    const token = req.cookies.get('auth_token')?.value;
    const rol = req.cookies.get('rol')?.value;


    // Protect specific routes (e.g., /dashboard)
    if (req.nextUrl.pathname.startsWith('/pages')) {
        if (!token || !rol) {
            return NextResponse.redirect(new URL('/login', req.url));
        }else if (!can_access_path(rol, req.nextUrl.pathname)){
            return NextResponse.redirect(new URL('/pages', req.url));
        }
    }

    return NextResponse.next();
}


export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|legales|encuestas).*)'],
};