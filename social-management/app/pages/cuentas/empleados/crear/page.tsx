"use client";

import { Suspense, useState, useEffect } from "react";
import { UserAccount } from "@/app/lib/types";
import { useSearchParams } from "next/navigation";
import { get_user_by_id } from "@/app/lib/database";
import CuentasForm from "@/app/ui/cuentas/cuentas-form";
import { useError } from "@/app/context/errorContext";

const DEFAULT_PROFILE_PHOTO = "https://bap4ouaenh9ktlwp.public.blob.vercel-storage.com/default-profile-account-unknown-icon-black-silhouette-free-vector-lOfodT0L1kfsKmIpBeof3vKeWBhmr6.jpg";


function UserPage() {
  const { showError } = useError();

  const [user, setUSer] = useState<UserAccount>(
    {
      id: "",
      username: "",
      password: "",
      nombre: "",
      apellido: "",
      role: "user",
      active: true,
      photo: DEFAULT_PROFILE_PHOTO
    }
  );

  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchUser = async () => {
      const id = searchParams.get("id") || "";
      if (id) {
        try {
          const fetchedUser = await get_user_by_id(id);
          if (fetchedUser) {
            setUSer(fetchedUser);
          }
            //console.log("User fetched successfully:", fetchedUser);
        } catch (error) {
          // console.error("Failed to fetch user:", error);
          showError("Failed to fetch user:"+error);
        }
      }
    };

    fetchUser();
  }, [searchParams]);

  return (
    <main>
      <div className="w-full max-w-9xl bg-white rounded-lg shadow-lg p-8 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8 overflow-hidden">
        <div className="w-full flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Detalle de la Cuenta</h1>
          </div>
          <CuentasForm user={user!} setUser={setUSer!}/>
        </div>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserPage />
    </Suspense>
  );
}