import React from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Container } from "../shared/Container";
import { Button } from "../ui/button";
import type{ Invoice, Services, User } from "@prisma/client";
import { HOST_URL } from "~/utils/lib";

const CheckoutForm = ({
  invoiceId,
  data,
}: {
  invoiceId: string;
  data: Invoice & {
    Client: User;
    service: Services;
  };
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (stripe == null || elements == null) return;

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${HOST_URL}/invoice/${invoiceId}/complete`,
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };
  return (
    <Container>
      <h1 className="text-lg font-medium text-gray-500">{data.title}</h1>
      <p className="text-2xl font-bold">${data.amount.toFixed(2)}</p>
      <p className="text-gray-500 text-sm my-4"> To <span className="text-gray-800 ml-8">{data.Client.name}</span></p>
      <p className="text-gray-500 text-sm my-4"> For <span className="text-gray-800 ml-8">{data.service.name}</span></p>
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <Button
          className="mt-2 w-full justify-center"
          type="submit"
          disabled={!stripe}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default CheckoutForm;
