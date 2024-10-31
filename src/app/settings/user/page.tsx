"use client";

import { Amplify } from "aws-amplify";

import outputs from "@root/amplify_outputs.json";
import Page from "@/shared/ui/page/ui/Page";
import { UsersList } from "@/widgets/users-list";

Amplify.configure(outputs);

export default function UserList() {
  return (
    <Page
      showPageHeader
      header={{
        title: "Users",
        breadcrumbs: [
          {
            title: "Home",
            href: "/",
          },

          {
            title: "Users",
            href: "/settings/user",
          },
        ],
      }}
      content={<UsersList />}
    />
  );
}
