"use client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { Container } from "~/components/shared/Container";
import ClientTable from "~/components/workspace/ClientTable";

import InviteForm from "~/components/workspace/InviteForm";
import NewPasswordForm from "~/components/workspace/NewPasswordForm";
import PasswordForm from "~/components/workspace/PasswordForm";
import { api } from "~/utils/api";

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: user } = useSession();
  const { data } = api.account.passwordStatus.useQuery();

  return (
    <div className="w-full px-24 pt-10">
      <Head>
        <title>Workspace</title>
      </Head>
      <Container>
        {data?.hasPassword ? <NewPasswordForm /> : <PasswordForm />}
      </Container>
      {user?.user.isWorkspaceOwner && (
        <Container>
          <h1 className="text-custom scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-2xl">
            Invite Client
          </h1>
          <InviteForm />
        </Container>
      )}
      <ClientTable />
    </div>
  );
};

export default page;
