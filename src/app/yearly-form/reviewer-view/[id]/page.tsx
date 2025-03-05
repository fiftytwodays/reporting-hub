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
import { ExportYearlyPlan } from "@/feature/export-yealy-plan";
import useProjectDetail from "@/entities/project/api/project-details";
import { useState } from "react";
Amplify.configure(outputs);

interface PlanDetails {
  id: string;
  quarterlyPlanId: string;
  activity: string;
  month: string[];
  functionalAreaId: string;
  department?: string;
  comments?: string;
  isMajorGoal: boolean;
}

interface QuarterlyPlanDetails {
  id: string;
  yearlyPlanId: string;
  status?: string;
  reviewedBy?: string;
  approvedBy?: string;
  plans: PlanDetails[];
}

interface YearlyPlanDetails {
  id: string;
  user: string;
  userId: string;
  projectId?: string;
  comments?: string;
  status?: string;
  year?: string;
  reviewedBy?: string;
  approvedBy?: string;
  quarterlyPlans: Record<number, QuarterlyPlanDetails>; // Change: Key is quarter number
}

export default function ReviewerViewDetail({
  params,
}: {
  params: { id: string };
}) {
  const [yearlyPlanDetails, setyearlyPlanDetails] =
    useState<YearlyPlanDetails>();
  // const router = useRouter();
  const id = params.id;
  console.log("id", id);
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });
  const {
    yearlyPlanDetail,
    isYearlyPlanDetailLoading,
    isYearlyPlanDetailError,
  } = useYearlyPlanDetails({ condition: !!id }, id);

  // Conditionally call useProjectsDetails hook only if id is available
  const { projectData, isProjectsListLoading } = useProjectDetail({
    condition: !!id && !!yearlyPlanDetails?.projectId, // Only call when id and projectId are available
    projectId: yearlyPlanDetails?.projectId ?? "",
  });

  return (
    <>
      {contextHolder}
      <Page
        showPageHeader
        header={{
          title: `${
            yearlyPlanDetail?.projectName + " [" + yearlyPlanDetail?.year + "]"
          }`,
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
                    key: "/yearly-form/my-forms",
                    label: "My Yearly Plans",
                  },
                  {
                    key: "/yearly-form/reviewer-view",
                    label: "Reviewer view",
                  },
                  {
                    key: "/yearly-form/approver-view",
                    label: "Approver view",
                  },
                ],
              },
            },
            {
              title: "Reviewer view",
              href: "/yearly-form/my-forms",
            },
          ],
          extra: (
            <ExportYearlyPlan
              yearlyPlanDetails={yearlyPlanDetails}
              projectDetails={projectData}
            />
          ),
          // extra: <Button onClick={() => router.push("/yearly-form/create") } type="primary" icon={<PlusOutlined />} > Create Yearly Form  </Button>,
          // extra: <Button onClick={() => router.push("/yearly-form/new-my-form") } type="primary" icon={<PlusOutlined />} > Create Yearly Form  </Button>,
        }}
        content={
          <CreateYearlyFormNew
            setyearlyPlanDetails={setyearlyPlanDetails}
            id={id}
            messageApi={messageApi}
            type="reviewer"
          />
        }
      />
    </>
  );
}
