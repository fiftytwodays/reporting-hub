"use client";

import { Amplify } from "aws-amplify";

import { message } from "antd";
import Page from "@/shared/ui/page/ui/Page";
import { CreateYearlyForm } from "@/feature/create-yearly-form";
// import { RegionsList } from "@/widgets/regions-list";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {  useRouter } from "next/navigation";

import outputs from "@root/amplify_outputs.json";
Amplify.configure(outputs);

export default function MyForms() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1, duration: 2 });
  return (
    <>
     {contextHolder}
    <Page
    showPageHeader
      header={{
        title: "Create Yearly Plan",
        breadcrumbs: [
          {
            title: "Home",
            href: "/",
          },

          {
            title: "Create Form",
            href: "/yearly-form/create",
          },
        ],
      }}
      content={<CreateYearlyForm />}
    />
    </>
  );
}
