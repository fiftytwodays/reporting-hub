"use client";

import { Amplify } from "aws-amplify";

import { message } from "antd";
import Page from "@/shared/ui/page/ui/Page";
// import { CreateYearlyFormModal } from "@/feature/create-yearly-form";
import { CreateYearlyFormNew } from "@/feature/create-yearly-form";
import { MyFormsList } from "@/widgets/myforms-list";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useYearlyPlanDetails from "@/entities/yearly-form/api/yearlyplan-details";
// import {  useRouter } from "next/router";

import outputs from "@root/amplify_outputs.json";
Amplify.configure(outputs);

export default  function MyForms({
  params,
}: {
  params: { id: string }
}) {
  // const router = useRouter();
  const  id  =  params.id;
  console.log("id",id);
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1, duration: 2 });
  const { yearlyPlanDetail, isYearlyPlanDetailLoading, isYearlyPlanDetailError } = useYearlyPlanDetails({ condition: !!id }, id);
  return (
    <>
     {contextHolder}
    <Page
    showPageHeader
      header={{
        title: `${id ? id : "---"}`,
        breadcrumbs: [
          {
            title: "Home",
            href: "/",
          },

          {
            title: "Yearly form",
            href: "/yearly-form/my-forms",
            menu: {
              items: [
                {
                  key: '/navigation',
                  label: 'My forms',
                },
              {
                key: '/general',
                label: 'Reviewer view',
              },
              {
                key: '/layout',
                label: 'Approver view',
              },
            ]
            },
          },
          {
            title: "My forms",
            href: "/yearly-form/my-forms",
          },
        ],
        // extra: <Button onClick={() => router.push("/yearly-form/create") } type="primary" icon={<PlusOutlined />} > Create Yearly Form  </Button>,
        // extra: <Button onClick={() => router.push("/yearly-form/new-my-form") } type="primary" icon={<PlusOutlined />} > Create Yearly Form  </Button>,
      }}
      content={<CreateYearlyFormNew id={id} messageApi={messageApi} type="myforms"/>}
    />
    </>
  );
}
