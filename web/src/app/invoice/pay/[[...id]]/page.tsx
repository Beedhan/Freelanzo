"use client";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "~/components/invoice/CheckoutForm";
import CreateForm from "~/components/invoice/CreateForm";
import { api } from "~/utils/api";
import { useState } from "react";
import { toast } from "~/components/ui/use-toast";
import { Icons } from "~/components/Icons";
import { useRouter } from "next/navigation";
const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};

// const load = loadStripe(
//   "pk_test_51LtPfLKb7gMwgquUnbNQS3iWaUGEgMIb2S5OxFief7pjKB90kwg79vsFc8DBAHueegP33QSVfLh5yH0AZ4zzWKbC00ZAYjTa8L"
// );
export default function InvoicePayment({
  params,
}: {
  params: { id: string[] };
}) {
  const [load, setLoad] = useState<Stripe | null>(null);
  const invoiceId = params?.id[0] as string;
  const router = useRouter();
  const { data, isLoading } = api.checkout.createIntent.useQuery(
    {
      invoiceId,
    },
    {
      onSuccess: (data) => {
        if (load === null) {
          void handleStripe(data);
        }
      },
      onError: (error) => {
        if (error.message === "Invoice is already paid") {
          toast({ title: "Error", description: error.message });
          router.push("/invoice/" + invoiceId + "/complete");
        } else {
          toast({ title: "Error", description: error.message });
          router.push("/");
        }
      },
      refetchOnWindowFocus: false,
    }
  );
  const handleStripe = async (data: {
    client_secret: string | null;
    public_key: string;
  }) => {
    const res = await loadStripe(data?.public_key);
    console.log(res);
    if (res) {
      setLoad(res);
    }
  };
  if (!load || isLoading || !data?.invoice) {
    return <Icons.spinner size={32} className="animate-spin" />;
  }
  return (
    <Elements
      stripe={load}
      options={{
        clientSecret: data?.client_secret || "",
      }}
    >
      <CheckoutForm invoiceId={invoiceId} data={data?.invoice} />
    </Elements>
  );
}
