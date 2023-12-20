"use client";
import { Pen } from "lucide-react";
import { useState } from "react";
import StripeDialog from "~/components/checkout/StripeDialog";

import { api } from "~/utils/api";

export default function Services() {
  
  return (
    <div className="w-4/5 px-24 pt-10">
      <h1 className="text-custom scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-2xl">
        Checkout
      </h1>
      <StripeDialog/>
     
    </div>
  );
}
