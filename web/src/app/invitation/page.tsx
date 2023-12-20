"use client";
import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import AuthForm from "~/components/AuthForm";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import { useRouter } from 'next/navigation'

function PageFallback() {
  return <>Loading</>
}

export default function Invitation() {
  const params = useSearchParams();
  const { status } = useSession();
  const router = useRouter();
  const mutation = api.workspace.join.useMutation({
    onSuccess(data) {
      if (data) {
        return redirect("/dashboard");
      }
    },
    onError(error) {
      if (error instanceof TRPCClientError) {
        toast({ title: error.message });
      }
      return router.replace("/")
    },
  });

  useEffect(() => {
    const inviteId = params?.get("inviteId");
    const token = params?.get("token");
    if (!inviteId || !token) {
      return redirect("/");
    }
    if(status!=='loading'&& status === "authenticated") {
    mutation.mutate({ inviteId, token });
    }
  }, [params, status]);

  if (status === "loading" || mutation.isLoading || mutation.isError) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <Head>
        <title>Workspace Invitation</title>
      </Head>
      <Suspense fallback={<PageFallback />}>
      <div className="flex h-screen w-full items-center justify-center">
        <div className="mx-auto flex w-[25%] flex-col items-center justify-center space-y-6 rounded-lg p-3 shadow-custom">
          <Link href={"/"}>
            <Image alt="logo" src="Freelanzooo.svg" width={150} height={100} />
          </Link>

          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {"You've been invited to Freelanzooo workspace"}
            </h1>
            <p className="text-dim text-md">Please login to continue</p>
          </div>
          <AuthForm />
        </div>
      </div>
      </Suspense>
    </>
  );
}
