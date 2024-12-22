"use client";

import { Amplify } from "aws-amplify";

import { message } from "antd";
import outputs from "@root/amplify_outputs.json";
import Page from "@/shared/ui/page/ui/Page";
import { OrganizationsList } from "@/widgets/organizations-list";

Amplify.configure(outputs);

export default function OrganizationList() {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });
  return (
    <>
      {contextHolder}
      <Page
        showPageHeader
        header={{
          title: "Oraganization",
          breadcrumbs: [
            {
              title: "Home",
              href: "/",
            },

            {
              title: "Organization",
              href: "/settings/organization",
            },
          ],
        }}
        content={<OrganizationsList />}
      />
    </>
  );
}
