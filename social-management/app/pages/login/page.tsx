import SocialHubLogo from '../../ui/icons/social-hub-logo';
import LoginForm from '@/app/ui/login/login-form';
 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-[#BD181E] p-3 md:h-36">
            <div className="w-100 text-white flex justify-center">
                <SocialHubLogo />
            </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}