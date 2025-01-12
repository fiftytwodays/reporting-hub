import React from "react";
import { Form, Input, Row, Col, Select, Button, Space } from "antd";
import { values as data } from "../api/dummy-data";

interface Goal {
  goal: string;
  achieved: boolean;
  whyNotAchieved: string | null;
  comments: string;
}

interface Activity {
  activity: string;
  functionalArea: string;
  comments: string;
}

interface PraisePoint {
  point: string;
}

interface PrayerRequest {
  request: string;
}

interface MonthlyFormData {
  projectName: string;
  month: string;
  goalsList: Goal[];
  additionalActivities: Activity[];
  nextMonthGoals: Activity[];
  additionalActivitiesNextMonth: Activity[];
  praisePoints: PraisePoint[];
  prayerRequests: PrayerRequest[];
  storyTestimony: string;
  concernsStruggles: string;
}

interface ViewMonthlyFormProps {
  id: string | string[] | undefined;
}

const ViewMonthlyForm: React.FC<ViewMonthlyFormProps> = ({ id }) => {
  const [form] = Form.useForm();
  console.log("get data based on id", id);

  return (
    <>
      <Form form={form} layout="vertical" initialValues={data} disabled>
        {/* Project and Month */}
        <Row gutter={24}>
          <Col xs={24} sm={6}>
            <Form.Item label="Project" name="projectName">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item label="Month" name="month">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Goals List */}
        <h3>Outcomes from the Month Just Ended</h3>
        {data.goalsList.map((goal, index) => (
          <Row gutter={24} key={index}>
            <Col xs={24} sm={6}>
              <Form.Item label="Goal" name={["goalsList", index, "goal"]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item
                label="Achieved"
                name={["goalsList", index, "achieved"]}
              >
                <Select>
                  <Select.Option value={true}>Yes</Select.Option>
                  <Select.Option value={false}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item
                label="Reason for not achieving"
                name={["goalsList", index, "whyNotAchieved"]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item
                label="Comments"
                name={["goalsList", index, "comments"]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        ))}

        {/* Additional Activities */}
        <h3>Additional Activities</h3>
        {data.additionalActivities.map((activity, index) => (
          <Row gutter={24} key={index}>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Activity"
                name={["additionalActivities", index, "activity"]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Functional Area"
                name={["additionalActivities", index, "functionalArea"]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Comments"
                name={["additionalActivities", index, "comments"]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        ))}

        {/* Next Month Goals */}
        <h3>Goals for Next Month</h3>
        {data.nextMonthGoals.map((goal, index) => (
          <Row gutter={24} key={index}>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Activity"
                name={["nextMonthGoals", index, "activity"]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Functional Area"
                name={["nextMonthGoals", index, "functionalArea"]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Comments"
                name={["nextMonthGoals", index, "comments"]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        ))}

        {/* Praise Points */}
        <h3>Praise Points</h3>
        {data.praisePoints.map((point, index) => (
          <Form.Item
            label={`Praise Point ${index + 1}`}
            key={index}
            name={["praisePoints", index, "point"]}
          >
            <Input />
          </Form.Item>
        ))}

        {/* Prayer Requests */}
        <h3>Prayer Requests</h3>
        {data.prayerRequests.map((request, index) => (
          <Form.Item
            label={`Prayer Request ${index + 1}`}
            key={index}
            name={["prayerRequests", index, "request"]}
          >
            <Input />
          </Form.Item>
        ))}

        {/* Story Testimony */}
        <h3>Story Testimony</h3>
        <Form.Item name="storyTestimony">
          <Input.TextArea rows={3} />
        </Form.Item>

        {/* Concerns and Struggles */}
        <h3>Concerns & Struggles</h3>
        <Form.Item name="concernsStruggles">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>

      <Space>
        <Button type="default" href="/monthly-form/my-forms">
          Back
        </Button>
      </Space>
    </>
  );
};

export default ViewMonthlyForm;
