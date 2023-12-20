"use client";
import { cn } from "~/utils/lib";
import { Icons } from "./Icons";
import { buttonVariants, Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";

const AuthForm = () => {
  const [googleLoading, setGoogleLoading] = useState<boolean>();

  const handleLogin = async () => {
    setGoogleLoading(true);
    await signIn("google",{callbackUrl:window.location.href});
  };
  return (
    <div className="grid w-full gap-6 ">
      <div className="mx-auto w-1/2">
        <Button
          type="button"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-12 w-full bg-white text-black gap-4"
          )}
          onClick={handleLogin}
          disabled={googleLoading}
          size="lg"
        >
          {googleLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-3 w-3" />
          )}{" "}
          Login with Google
        </Button>
      </div>
    </div>
  );
};

export default AuthForm;
