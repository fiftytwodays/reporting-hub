"use client";

import { Amplify } from "aws-amplify";

import { message } from "antd";
import outputs from "@root/amplify_outputs.json";
import Page from "@/shared/ui/page/ui/Page";
import { RolesList } from "@/widgets/roles-list";

Amplify.configure(outputs);

export default function RoleList() {
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1, duration: 2 });
  return (
    <>
     {contextHolder}
    <Page
    showPageHeader
      header={{
        title: "Roles",
        breadcrumbs: [
          {
            title: "Home",
            href: "/",
          },

          {
            title: "Roles",
            href: "/settings/roles",
          },
        ],
      }}
      content={<RolesList />}
    />
    </>
  );
}
