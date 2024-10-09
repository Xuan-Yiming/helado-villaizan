import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center h-screen">
        <div>
          <h1 className="font-bold text-8xl mb-4">Gestión de </h1>
          <h1 className="font-bold text-8xl mb-10">Redes Sociales </h1>
          <h1 className="font-bold text-5xl mb-20">Paletas Villaizán</h1>

          <a href="/login" className="font-bold bg-[#BD181E] text-white px-4 py-2 rounded-md border-none text-xl">
            Iniciar Sesión
          </a>
        </div>
        <div>
          <Image
            src="/images/Community-Management.jpg"
            alt="Social Dashboard"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
