"use client";

import { Amplify } from "aws-amplify";

import { message } from "antd";
import Page from "@/shared/ui/page/ui/Page";
// import { CreateYearlyFormModal } from "@/feature/create-yearly-form";
import { CreateYearlyFormNew } from "@/feature/create-yearly-form";
import { MyFormsList } from "@/widgets/myforms-list";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
// import {  useRouter } from "next/router";

import outputs from "@root/amplify_outputs.json";
import useYearlyPlanDetails from "@/entities/yearly-form/api/yearlyplan-details";
Amplify.configure(outputs);

export default  function ReviewerViewDetail({
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
        title: `${yearlyPlanDetail?.projectName + " [" + yearlyPlanDetail?.year + "]"}`,
        breadcrumbs: [
          {
            title: "Home",
            href: "/",
          },

          {
            title: "Yearly Plans",
            href: "/yearly-form/my-forms",
            menu: {
              items: [
                {
                  key: '/yearly-form/my-forms',
                  label: 'My Yearly Plans',
                },
              {
                key: '/yearly-form/reviewer-view',
                label: 'Reviewer view',
              },
              {
                key: '/yearly-form/approver-view',
                label: 'Approver view',
              },
            ]
            },
          },
          {
            title: "Reviewer view",
            href: "/yearly-form/my-forms",
          },
        ],
        // extra: <Button onClick={() => router.push("/yearly-form/create") } type="primary" icon={<PlusOutlined />} > Create Yearly Form  </Button>,
        // extra: <Button onClick={() => router.push("/yearly-form/new-my-form") } type="primary" icon={<PlusOutlined />} > Create Yearly Form  </Button>,
      }}
      content={<CreateYearlyFormNew id={id} messageApi={messageApi} type="reviewer"/>}
    />
    </>
  );
}
