import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthForm from "~/components/AuthForm";
import { getSession } from "~/utils/session";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to use application",
};

export default async function Login() {
  const session = await getSession()
  if(session?.user){
    redirect("/inbox");
  }

  return (
    <>
      <div className="flex">
        <div className="flex h-[100vh] w-[1080px] items-center justify-center bg-primary p-10">
          <Image
            alt="logo"
            src="Freelanzooo.svg"
            width={1000}
            height={100}
          />
          {/* <Image
            src={"/assets/working.svg"}
            width={200}
            height={200}
            alt="Freelancer working"
            className="block"
          /> */}
        </div>

        <div className="flex w-[800px] items-center justify-center">
          <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6">
            <Link href={"/"}>
              <Image
                alt="logo"
                src="Freelanzooo.svg"
                className="text-white"
                width={150}
                height={100}
              />
            </Link>

            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">
                Welcome to our login page
              </h1>
            </div>
            <AuthForm />
          </div>
        </div>
      </div>
    </>
  );
}
