import React from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";

const page = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center  overflow-hidden bg-gradient-to-r from-red-500 to-orange-500 p-2">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle className="text-4xl">401</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Unauthorized</p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button className="w-full">Home</Button>
          <Button className="w-full">Login</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
