import { NextResponse } from 'next/server';
import { get_social_account, update_meta_tokens } from '@/app/lib/database';
import axios from 'axios';

// Verificar y renovar los tokens de Meta para todas las cuentas de Facebook e Instagram
export async function POST() {
    try {
        const account = await get_social_account('facebook');
        if (!account) {
            return NextResponse.json(
                { error: 'No se encontró la cuenta principal para renovar el token.' },
                { status: 404 }
            );
        }

        // //console.log(`Cuenta principal obtenida: ${account.usuario}`);

        // 2. Verificar si la cuenta tiene un token válido y fecha de expiración
        if (!account.token_autenticacion || !account.fecha_expiracion_token) {
            return NextResponse.json(
                { error: 'La cuenta principal no tiene token o fecha de expiración válidos.' },
                { status: 400 }
            );
        }

        const fechaExpiracion = new Date(account.fecha_expiracion_token);
        // //console.log(`Fecha de expiración del token: ${fechaExpiracion}`);

        // 3. Si el token está por expirar, hacer la renovación
        const ahoraMas24Horas = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas desde ahora
        if (fechaExpiracion <= ahoraMas24Horas) {
            // //console.log('Renovando token...');

            const newTokenResponse = await axios.get(
                'https://graph.facebook.com/v20.0/oauth/access_token',
                {
                    params: {
                        grant_type: 'fb_exchange_token',
                        client_id: process.env.FACEBOOK_APP_ID,
                        client_secret: process.env.FACEBOOK_APP_SECRET,
                        fb_exchange_token: account.token_autenticacion,
                    },
                }
            );

            const newTokenData = newTokenResponse.data;

            if (!newTokenData.access_token) {
                throw new Error(
                    `Error al renovar el token: ${newTokenData.error?.message || 'Desconocido'}`
                );
            }

            const nuevaFechaExpiracion = new Date(
                Date.now() + 60 * 24 * 60 * 60 * 1000 // +60 días
            ).toISOString();

            //console.log('Nuevo token obtenido:', newTokenData.access_token);

            // 4. Actualizar todas las cuentas de Facebook e Instagram con el nuevo token
            await update_meta_tokens(newTokenData.access_token, nuevaFechaExpiracion);

            //console.log('Tokens de todas las cuentas actualizados correctamente.');

            return NextResponse.json({
                message: 'Tokens renovados exitosamente.',
                nuevoToken: newTokenData.access_token,
                nuevaFechaExpiracion,
            });
        }

        return NextResponse.json({
            message: 'El token todavía es válido. No se requiere renovación.',
        });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
