"use client";

import { Amplify } from "aws-amplify";

import { message } from "antd";
import outputs from "@root/amplify_outputs.json";
import Page from "@/shared/ui/page/ui/Page";
import { CreateFunctionalAreaModal } from "@/feature/create-functional-area";
import { FunctionalAreasList } from "@/widgets/functional-areas-list";

Amplify.configure(outputs);

export default function ClusterList() {
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1, duration: 2 });
  return (
    <>
     {contextHolder}
    <Page
    showPageHeader
      header={{
        title: "Functional areas",
        breadcrumbs: [
          {
            title: "Home",
            href: "/",
          },

          {
            title: "Functional areas",
            href: "/settings/function-areas",
          },
        ],
        extra: <CreateFunctionalAreaModal messageApi={messageApi} />,
      }}
      content={<FunctionalAreasList />}
    />
    </>
  );
}
