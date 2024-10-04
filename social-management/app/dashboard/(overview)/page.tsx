import FacebookLogin from '@/app/dashboard/(overview)/FacebookLogin'; 
import InstagramLogin from '@/app/dashboard/(overview)/InstagramLogin'; 
export default async function Page(){
    return (
        <main>
            <div className="flex justify-center items-center min-h-screen bg-gray-100 space-x-8">
      {/* Componente de Facebook */}
      <FacebookLogin />
      
      {/* Componente de Instagram */}
      <InstagramLogin />
    </div>
        </main>
    )
}
