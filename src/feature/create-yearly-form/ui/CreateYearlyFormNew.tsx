
import { Button, Col, Collapse, CollapseProps, Divider, Flex, Form, Input, Row, Select, Space } from "antd";
import Projects from "./Projects";
import FunctionalArea from "./FunctionalArea";
import { getCurrentUser } from 'aws-amplify/auth';
import QuarterlyPlan from "./QuarterlyPlan";
import { useState, useEffect } from "react";
import { DeleteTwoTone } from '@ant-design/icons';
import useCreateYearlyPlan from "../api/create-yearly-form";
import useCreateQuarterlyPlan from "../api/create-quarter-plan";
import useCreatePlan from "../api/create-plan";
import { useRouter } from "next/navigation";
import useYearlyPlanDetails from "@/entities/yearly-form/api/yearlyplan-details";
import useQuarterlyPlanList from "@/entities/yearly-form/api/quarterlyplan-list";
import useYearlyPlanFullDetails from "@/entities/yearly-form/api/yearlyplan-full";
import useUpdateYearlyPlan from "../api/update-yearly-form";
import useUpdateQuarterlyPlan from "../api/update-quarter-plan";
import useUpdatePlan from "../api/update-plan";
import useDeleteYearlyForm from "../../delete-yearly-form/delete-yearly-form"
const { Panel } = Collapse;

interface CreateYearlyFormNewProps {
  // onCreateYearlyFormNewModalClose: () => void;
  id: string | undefined,
  type: string
  messageApi: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

interface PlanDetails {
  id: string;
  quarterlyPlanId: string;
  activity: string;
  month: string[];
  functionalAreaId: string;
  department?: string;
  comments?: string;
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
  projectId?: string;
  comments?: string;
  status?: string;
  year?: string;
  reviewedBy?: string;
  approvedBy?: string;
  quarterlyPlans: Record<number, QuarterlyPlanDetails>; // Change: Key is quarter number
}


interface FormValues {
  // year: string;
  project: string | undefined;

}

export default function CreateYearlyFormNew({
  messageApi, id, type
}: CreateYearlyFormNewProps) {


  const { createYearlyPlan, isCreatingYearlyPlan } = useCreateYearlyPlan();
  const { createQuarterlyPlan, isCreatingQuarterlyPlan } = useCreateQuarterlyPlan();
  const { createPlan, isCreatingPlan } = useCreatePlan();
  const { updateYearlyPlan, isUpdatingYearlyPlan } = useUpdateYearlyPlan();
  const { updateQuarterlyPlan, isUpdatingQuarterlyPlan } = useUpdateQuarterlyPlan();
  const { updatePlan, isUpdatingPlan } = useUpdatePlan();
  const [quarterPlans, setQuarterPlans] = useState<Record<number, QuarterlyPlanDetails>>({});
  let currentYear: number = new Date().getFullYear();
  let nextYear: number = currentYear + 1;
  const [form] = Form.useForm();
  const { Option } = Select;
  const router = useRouter();

  const monthsArray = [
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
  ];

  const items: { key: number; label: string }[] = [
    {
      key: 1,
      label: 'Apr - Jun',
      // children: <QuarterlyPlan form={form} quarter={1}/>,
    },
    {
      key: 2,
      label: 'Jul - Sep',
      // children: <QuarterlyPlan form={form} quarter={1}/>,
    },
    {
      key: 3,
      label: 'Oct - Dec',
      // children: <QuarterlyPlan form={form} quarter={1}/>,
    },
    {
      key: 4,
      label: 'Jan - Mar',
      // children: <QuarterlyPlan form={form} quarter={1}/>,
    },
  ];

  const { yearlyPlanDetail, isYearlyPlanDetailLoading, isYearlyPlanDetailError } = useYearlyPlanFullDetails({ condition: !!id }, id);

  useEffect(() => {
    if (id && yearlyPlanDetail) {
      form.setFieldsValue({
        year: yearlyPlanDetail.year,
        project: yearlyPlanDetail.projectId,
      });
      const mappedQuarterPlans: Record<number, QuarterlyPlanDetails> = {};
      Object.entries(yearlyPlanDetail.quarterlyPlans).forEach(([key, quarterData]) => {
        const quarterKey = Number(key); // Convert key to number

        // Store the entire quarterly plan object, ensuring `plans` is an array
        mappedQuarterPlans[quarterKey] = {
          id: quarterData.id,
          yearlyPlanId: quarterData.yearlyPlanId,
          status: quarterData.status,
          reviewedBy: quarterData.reviewedBy,
          approvedBy: quarterData.approvedBy,
          plans: quarterData.plans.map((plan) => ({
            id: plan.id,
            quarterlyPlanId: plan.quarterlyPlanId,
            activity: plan.activity,
            month: plan.month,
            functionalAreaId: plan.functionalAreaId,
            department: plan.department,
            comments: plan.comments,
          })),
        };
      });

      // Update state
      setQuarterPlans(mappedQuarterPlans);
    }
  }, [yearlyPlanDetail]);


  // useEffect(() => {
  //   console.log("Inside UseEffect")
  //   if (id && yearlyPlanDetail) {
  //     console.log("Yearly Plan Detail fetched using Yearly plan id", yearlyPlanDetail);
  //   }
  // }, [yearlyPlanDetail]);

  const handleSave = async (status: string) => {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      const formValues = form.getFieldsValue();

      console.log("form details", formValues);
      console.log("qaurter details", quarterPlans)
      let yearlyPlanResp;
      const yearlyPlanPayload = {
        user: userId,
        projectId: formValues.project,
        comments: "",
        status: status,
        year: formValues.year,
        ...(yearlyPlanDetail?.id && yearlyPlanDetail?.id !== "" && { id: yearlyPlanDetail.id })
      }
      try {
        if (yearlyPlanDetail?.id && "" != yearlyPlanDetail?.id) {
          // yearlyPlanPayload
          console.log("yearlyPlanPayload while updating", yearlyPlanPayload)
          yearlyPlanResp = await updateYearlyPlan(yearlyPlanPayload);
        } else {
          yearlyPlanResp = await createYearlyPlan(yearlyPlanPayload);
        }
        if (yearlyPlanResp) {

          console.log("Saved/Updated Yearly Plan Id", yearlyPlanResp.id);
        }
      } catch (error: any) {
        console.log("Yearly Plan save failed");
        // if (error?.status === 409) {
        //   messageApi.error(
        //     "Project name already in use. Please try again with a different project name."
        //   );
        // } else {
        //   messageApi.error("Unable to create the project. Please try again.");
        // }
      }

      for (const quarter of [1, 2, 3, 4]) {

        if (yearlyPlanResp) {
          for (const quarter of [1, 2, 3, 4]) {
            const quarterlyPlanData = quarterPlans[quarter];

            if (quarterlyPlanData) {
              const quarterlyPlanPayload = {
                id: quarterlyPlanData.id || undefined,
                yearlyPlanId: yearlyPlanResp.id,
                quarter: quarter,
                status: status,
                ...(quarterlyPlanData?.id && quarterlyPlanData?.id !== "" && { id: quarterlyPlanData.id })
              };

              let quarterPlanResp;
              if (quarterlyPlanData.id) {
                quarterPlanResp = await updateQuarterlyPlan(quarterlyPlanPayload);
              } else {
                quarterPlanResp = await createQuarterlyPlan(quarterlyPlanPayload);
              }

              if (quarterPlanResp) {
                for (const plan of quarterlyPlanData.plans) {
                  const planPayload = {
                    quarterlyPlanId: quarterPlanResp.id,
                    activity: plan.activity,
                    month: plan.month,
                    functionalAreaId: plan.functionalAreaId,
                    department: plan.department ?? "",
                    comments: plan.comments ?? "",
                    ...(plan?.id && plan?.id !== "" && { id: plan.id })
                  };
                  let planResp;
                  if (plan.id) {
                    planResp = await updatePlan(planPayload);
                  } else {
                    planResp = await createPlan(planPayload);
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error saving data:", error);
      messageApi.error("Failed to save data.");
    }
    console.log("Handle save called");
    messageApi.success("Yearly Plan has been created successfully.");
    router.push('/yearly-form/my-forms');
  };

  const handlePlanChange = (quarter: number, index: number, field: string, value: any) => {
    setQuarterPlans((prev) => ({
      ...prev,
      [quarter]: {
        ...prev[quarter],
        plans: prev[quarter]?.plans.map((plan, i) =>
          i === index ? { ...plan, [field]: value } : plan
        ),
      },
    }));
    console.log("Handle plan change called", quarterPlans);
  };

  const handleDeletePlan = (quarter: number, index: number) => {
    setQuarterPlans((prev) => {
      const updatedQuarter = prev[quarter] || [];
      updatedQuarter.splice(index, 1);
      return { ...prev, [quarter]: updatedQuarter };
    });
  };

  const handleAddPlan = (quarter: number) => {
    setQuarterPlans((prev) => ({
      ...prev,
      [quarter]: {
        ...prev[quarter],
        plans: [
          ...(prev[quarter]?.plans || []),
          {
            activity: "",
            month: [],
            functionalAreaId: "",
            department: "",
            comments: "",
          } as any
        ],
      },
    }));
  };

  console.log("In create", form.getFieldValue("project"));
  // };


  return (
    <div>
      <h1>Yearly Planning</h1>
      <Form form={form} layout="horizontal" disabled={type !== "myforms"} initialValues={{ year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`, project: undefined }}>
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <Form.Item label="Year" name="year">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Projects"
              name="project"
              rules={[{ required: true, message: "Project is required" }]}
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
            >
              <Projects form={form} id={form.getFieldValue("project") ?? undefined} />
            </Form.Item>
          </Col>
        </Row>
        <Collapse>
          {items.map((quarter) => (
            <Panel header={`${quarter.label}`} key={quarter.key}>
              <Row gutter={24}>
                <Col span={1}>Sl. No</Col>
                <Col span={5}>Activity</Col>
                <Col span={4}>
                  Functional Area <span style={{ color: 'red' }}>*</span> 
                </Col>
                <Col span={3}>Months</Col>
                <Col span={3}>Department</Col>
                <Col span={6}>Comments</Col>
                <Col span={2}></Col>
              </Row>
              <Divider></Divider>
              {quarterPlans[quarter.key]?.plans?.map((plan, index) => (
                // <div key={index} style={{ marginBottom: 16, display: "flex" }}>
                <Row gutter={24}>
                  <Col span={1}>
                    <div>{index + 1}</div>
                  </Col>
                  <Col span={5}>
                    <Form.Item >
                      <Input
                        value={plan.activity || ""}
                        onChange={(e) => handlePlanChange(quarter.key, index, "activity", e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item >
                      <FunctionalArea handlePlanChange={handlePlanChange} quarterKey={quarter.key} index={index} functionalAreaId={plan.functionalAreaId} />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item >
                      <Select
                        mode="multiple"
                        value={plan.month || []}
                        onChange={(value) => handlePlanChange(quarter.key, index, "month", value)}
                      >
                        {monthsArray.slice((quarter.key - 1) * 3, quarter.key * 3).map((month) => (
                          <Option key={month} value={month}>
                            {month}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item >
                      <Input
                        value={plan.department || ""}
                        onChange={(e) => handlePlanChange(quarter.key, index, "department", e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item>
                      <Input
                        value={plan.comments || ""}
                        onChange={(e) => handlePlanChange(quarter.key, index, "comments", e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    {/* <Button
                      type="primary"
                      danger
                      onClick={() => handleDeletePlan(quarter.key, index)}
                      style={{ marginLeft: 16 }}
                    > */}
                    <DeleteTwoTone onClick={() => handleDeletePlan(quarter.key, index)} twoToneColor="#FF0000" />
                    {/* </Button> */}
                  </Col>
                </Row>
                // </div>
              ))}
              <Button
                type="dashed"
                onClick={() => handleAddPlan(quarter.key)}
                block
              >
                Add Plan
              </Button>
            </Panel>

          ))}
        </Collapse>

        <Form.Item style={{ marginTop: 24 }}>
          <Space>
            {type === "myforms" && (
              <>
                <Button type="primary" disabled={false} onClick={() => handleSave("draft")}>
                  Save as Draft
                </Button>
                <Button type="primary" disabled={false} onClick={() => handleSave("waiting for review")}>
                  Send to Review
                </Button>
              </>
            )}

            {type === "reviewer" && (
              <>
                <Button type="primary" disabled={false} onClick={() => handleSave("waiting for approval")}>
                  Send for Approval
                </Button>
                <Button type="default" disabled={false} danger onClick={() => handleSave("rejected")}>
                  Reject
                </Button>
              </>
            )}

            {type === "approver" && (
              <>
                <Button type="primary" disabled={false} onClick={() => handleSave("approved")}>
                  Approve
                </Button>
                <Button type="default" disabled={false} danger onClick={() => handleSave("rejected")}>
                  Reject
                </Button>
              </>
            )}
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}

// export default CreateYearlyFormNew;
