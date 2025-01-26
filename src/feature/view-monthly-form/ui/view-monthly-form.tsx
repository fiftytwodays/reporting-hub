import React from "react";
import { Form, Input, Row, Col, Select, Button, Space } from "antd";
import { values as data } from "../api/dummy-data";

interface Goal {
  goal: string;
  majorGoal: boolean;
  achieved: boolean;
  whyNotAchieved: string | null;
  comments: string;
}

interface Activity {
  activity: string;
  majorGoal: boolean;
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
        <div
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            padding: "10px",
            marginTop: "16px",
          }}
        >
          <h3>Outcomes from the Month Just Ended</h3>
          {data.goalsList.map((goal, index) => (
            <Row gutter={24} key={index}>
              <Col xs={24} sm={4}>
                <Form.Item
                  label={index === 0 ? "Goal" : ""}
                  name={["goalsList", index, "goal"]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={4}>
                <Form.Item
                  label={index === 0 ? "Major goal" : ""}
                  name={["goalsList", index, "majorGoal"]}
                >
                  <Select>
                    <Select.Option value={true}>Yes</Select.Option>
                    <Select.Option value={false}>No</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={4}>
                <Form.Item
                  label={index === 0 ? "Achieved" : ""}
                  name={["goalsList", index, "achieved"]}
                >
                  <Select>
                    <Select.Option value={true}>Yes</Select.Option>
                    <Select.Option value={false}>No</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={4}>
                <Form.Item
                  label={index === 0 ? "Reason for not achieving" : ""}
                  name={["goalsList", index, "whyNotAchieved"]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={4}>
                <Form.Item
                  label={index === 0 ? "Comments" : ""}
                  name={["goalsList", index, "comments"]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          ))}
        </div>

        {/* Additional Activities */}
        <div
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            padding: "10px",
            marginTop: "16px",
          }}
        >
          <h3>Additional Activities</h3>
          {data.additionalActivities.map((activity, index) => (
            <Row gutter={24} key={index}>
              <Col xs={24} sm={4}>
                <Form.Item
                  label={index === 0 ? "Activity" : ""}
                  name={["additionalActivities", index, "activity"]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={4}>
                <Form.Item
                  label={index === 0 ? "Major goal" : ""}
                  name={["goalsList", index, "majorGoal"]}
                >
                  <Select>
                    <Select.Option value={true}>Yes</Select.Option>
                    <Select.Option value={false}>No</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={4}>
                <Form.Item
                  label={index === 0 ? "Functional area" : ""}
                  name={["additionalActivities", index, "functionalArea"]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={4}>
                <Form.Item
                  label={index === 0 ? "Comments" : ""}
                  name={["additionalActivities", index, "comments"]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          ))}
        </div>

        {/* Next Month Goals */}
        <div
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            padding: "10px",
            marginTop: "16px",
          }}
        >
          <h3>Goals for Next Month</h3>
          {data.nextMonthGoals.map((goal, index) => (
            <Row gutter={24} key={index}>
              <Col xs={24} sm={4}>
                <Form.Item
                  label={index === 0 ? "Activity" : ""}
                  name={["nextMonthGoals", index, "activity"]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={4}>
                <Form.Item
                  label={index === 0 ? "Major goal" : ""}
                  name={["goalsList", index, "majorGoal"]}
                >
                  <Select>
                    <Select.Option value={true}>Yes</Select.Option>
                    <Select.Option value={false}>No</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={4}>
                <Form.Item
                  label={index === 0 ? "Functional area" : ""}
                  name={["nextMonthGoals", index, "functionalArea"]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={4}>
                <Form.Item
                  label={index === 0 ? "Comments" : ""}
                  name={["nextMonthGoals", index, "comments"]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          ))}
        </div>

        {/* Praise Points */}
        <h3>Praise Points</h3>
        <div
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            padding: "10px",
            marginTop: "16px",
          }}
        >
          <Form.Item name="praisePoints">
            <ul>
              {data.praisePoints.map((point, index) => (
                <li key={index}>{point.point}</li>
              ))}
            </ul>
          </Form.Item>
        </div>

        {/* Prayer Requests */}
        <div
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            padding: "10px",
            marginTop: "16px",
          }}
        >
          <h3>Prayer Requests</h3>
          <Form.Item name="prayerRequests">
            <ul>
              {data.prayerRequests.map((request, index) => (
                <li key={index}>{request.request}</li>
              ))}
            </ul>
          </Form.Item>
        </div>

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
