import VincularCuenta from "@/app/ui/cuentas/vincular-cuenta"
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/solid"

var accounts = [
    {
        name: 'Facebook',
        linked: true,
    },
    {
        name: 'Instagram',
        linked: true,
    },
    {
        name: 'Tiktok',
        linked: true,
    },
    {
        name: 'Google',
        linked: false,
    },
]

export default async function Page(){

    return (
        <main>
            <h1 className="font-bold text-4xl">Cuentas y Configuraciones</h1>

            <div className="mt-10">
                <h2 className="font-bold text-2xl">Cuentas</h2>
                <p>En esta sección podrás ver las cuentas que tienes vinculadas a tu perfil.</p>
                <div>
                   <VincularCuenta accounts={accounts} />
                </div>
            </div>

            <div className="mt-10">
                <h2 className="font-bold text-2xl">Configuraciones</h2>
                <p>En esta sección podrás configurar tu perfil y tus preferencias.</p>
                <div className="flex justify-end"> {/* Added div with flex justify-end */}
                    <button className="flex bg-[#BD181E] text-white px-4 py-2 rounded-md mt-4 font-bold">
                        <ArrowRightEndOnRectangleIcon className="h-5 w-5 mr-2" />
                        Cerrar sesión</button>
                </div> {/* Added closing div */}
            </div>

        </main>
    )
}