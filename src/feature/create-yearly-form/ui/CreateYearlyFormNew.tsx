
import { Button, Col, Collapse, CollapseProps, Divider, Flex, Form, Input, Row, Select, Space } from "antd";
import Projects from "./Projects";
import FunctionalArea from "./FunctionalArea";
import { getCurrentUser } from 'aws-amplify/auth';
import QuarterlyPlan from "./QuarterlyPlan";
import { useState } from "react";
import { DeleteTwoTone } from '@ant-design/icons';
import useCreateYearlyPlan from "../api/create-yearly-form";
import useCreateQuarterlyPlan from "../api/create-quarter-plan";
import useCreatePlan from "../api/create-plan";
import {  useRouter } from "next/navigation";
// import useProjectsList from "@/entities/project/api/project-list";
// import useRegionsList from "@/entities/region/api/region-list";
// import useCreateRegion from "../api/create-yearly-form";

const { Panel } = Collapse;

interface CreateYearlyFormNewProps {
  // onCreateYearlyFormNewModalClose: () => void;
  messageApi: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

interface FormValues {
  // year: string;
  project: string;

}

// const CreateYearlyFormNew: React.FC<CreateYearlyFormNewProps> = ({
//   // onCreateYearlyFormNewModalClose,
//   messageApi,
// }) => {

export default function CreateYearlyFormNew({
  messageApi,
}: CreateYearlyFormNewProps) {

  const { createYearlyPlan, isCreatingYearlyPlan } = useCreateYearlyPlan();
  const { createQuarterlyPlan, isCreatingQuarterlyPlan } = useCreateQuarterlyPlan();
  const { createPlan, isCreatingPlan } = useCreatePlan();
  const [quarterPlans, setQuarterPlans] = useState<Record<number, any[]>>({});
  let currentYear: number = new Date().getFullYear();
  let nextYear: number = currentYear + 1;
  // const [form] = Form.useForm<FormValues>();
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

  const handleSaveTest = async () => {
    console.log("Quarter plans", quarterPlans);
  }

  const handleSave = async (status: string) => {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      const formValues = form.getFieldsValue();


      console.log("username", username);
      console.log("user id", userId);
      console.log("sign-in details", signInDetails);

      console.log("form details", formValues);
      console.log("qaurter details", quarterPlans)
      let yearlyPlanResp;
      const yearlyPlanPayload = {
        user: userId,
        projectId: formValues.project,
        comments: "",
        status: status,
        year: formValues.year,
      }


      try {
        yearlyPlanResp = await createYearlyPlan(yearlyPlanPayload);
        if (yearlyPlanResp) {
          
          console.log("Saved Yearly Plan Id", yearlyPlanResp.id);
          // form.resetFields();
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
          const quarterlyPlanPayload = {
            yearlyPlanId: yearlyPlanResp.id,
            quarter: quarter,
            status: status,
          }

          const quarterPlan = await createQuarterlyPlan(quarterlyPlanPayload);

          if (quarterPlans[quarter]) {
            for (const plan of quarterPlans[quarter]) {
              const planPayload = {
                quarterlyPlanId: quarterPlan.id,
                activity: plan.activity,
                month: plan.month,
                functionalAreaId: plan.functionalArea,
                department: plan.department,
                comments: plan.comments,
              }

              const planResp = await createPlan(planPayload);
              //         await DataStore.save(
              //           new Plan({
              //             yearlyPlanID: yearlyPlan.id,
              //             quarterPlanID: quarterPlan.id,
              //             ...plan,
              //           })
              //         );
            }
          }
        }
      }

      //   message.success("Data saved successfully.");
    } catch (error) {
      console.error("Error saving data:", error);
      // message.error("Failed to save data.");
    }
    console.log("Handle save called");
    messageApi.success("Yearly Plan has been created successfully.");
    router.push('/yearly-form/my-forms');
  };

  const handlePlanChange = (quarter: number, index: number, field: string, value: any) => {
    console.log("Qauerter", quarter)
    setQuarterPlans((prev) => {
      const updatedQuarter = prev[quarter] || [];
      updatedQuarter[index] = { ...updatedQuarter[index], [field]: value };
      return { ...prev, [quarter]: updatedQuarter };
    });
    console.log("Handle plan change called");
  };

  const handleDeletePlan = (quarter: number, index: number) => {
    setQuarterPlans((prev) => {
      const updatedQuarter = prev[quarter] || [];
      updatedQuarter.splice(index, 1);
      return { ...prev, [quarter]: updatedQuarter };
    });
  };

  // };

  return (
    <div>
      <h1>Yearly Planning</h1>
      <Form form={form} layout="horizontal" initialValues={{ year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}` }}>
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
              <Projects form={form} />
            </Form.Item>
          </Col>
        </Row>
        <Collapse>
          {items.map((quarter) => (
            <Panel header={`${quarter.label}`} key={quarter.key}>
              <Row gutter={24}>
                <Col span={1}>Sl. No</Col>
                <Col span={5}>Activity</Col>
                <Col span={4}>Functional Area</Col>
                <Col span={3}>Months</Col>
                <Col span={3}>Department</Col>
                <Col span={6}>Comments</Col>
                <Col span={2}></Col>
              </Row>
              <Divider></Divider>
              {(quarterPlans[quarter.key] || []).map((plan, index) => (
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
                      <FunctionalArea handlePlanChange={handlePlanChange} quarterKey={quarter.key} index={index} />
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
                onClick={() => handlePlanChange(quarter.key, (quarterPlans[quarter.key] || []).length, {}, {})}
                block
              >
                Add Plan
              </Button>
            </Panel>

          ))}
        </Collapse>

        <Form.Item>
          <Button type="primary" onClick={() => handleSave("draft")}>
          {/* <Button type="primary" onClick={() => handleSaveTest()}> */}
            Save as Draft
          </Button>
          {/* <Button style={{ marginLeft: 8 }} type="default" onClick={() => handleSave("waiting for review")}>
            Send to Review
          </Button> */}
        </Form.Item>
      </Form>
    </div>
  );
};

// export default CreateYearlyFormNew;
