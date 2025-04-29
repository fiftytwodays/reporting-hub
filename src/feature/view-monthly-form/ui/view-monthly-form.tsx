import React from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Select,
  Button,
  Space,
  Collapse,
  Divider,
} from "antd";
import { values as data } from "../api/dummy-data";

const { Panel } = Collapse;

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
          <Col xs={24} sm={6}>
            <Form.Item label="Year" name="year">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Collapse defaultActiveKey={["1", "2", "3", "4", "5", "6", "7", "8"]}>
          {/* Goals List */}
          {/* <div
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            padding: "10px",
            marginTop: "16px",
          }}
        >
          <h3>Outcomes from the Month Just Ended</h3> */}

          <Panel header="Outcomes from the Month Just Ended" key="1">
            <Row gutter={24}>
              <Col span={1}>Sl. No</Col>
              <Col span={4}>Goal</Col>
              <Col span={4}>Achieved</Col>
              <Col span={4}>Reason for not achieving</Col>
              <Col span={4}>Major Goal</Col>
              <Col span={4}>Comments</Col>
              <Col span={2}></Col>
            </Row>
            <Divider></Divider>
            {data.goalsList.map((goal, index) => (
              <Row gutter={24} key={index}>
                <Col span={1}>
                  <div>{index + 1}</div>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item name={["goalsList", index, "goal"]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item name={["goalsList", index, "achieved"]}>
                    <Select>
                      <Select.Option value={true}>Yes</Select.Option>
                      <Select.Option value={false}>No</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item name={["goalsList", index, "whyNotAchieved"]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item name={["goalsList", index, "majorGoal"]}>
                    <Select>
                      <Select.Option value={true}>Yes</Select.Option>
                      <Select.Option value={false}>No</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item name={["goalsList", index, "comments"]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            ))}
          </Panel>
          {/* </div> */}

          {/* Additional Activities */}
          {/* <div
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            padding: "10px",
            marginTop: "16px",
          }}
        >
          <h3>Additional Activities</h3> */}
          <Panel
            header="Additional activities other than that is planned"
            key="2"
          >
            <Row gutter={24}>
              <Col span={1}>Sl. No</Col>
              <Col span={4}>Activity</Col>
              <Col span={4}>Functional area</Col>
              <Col span={4}>Major Goal</Col>
              <Col span={4}>Comments</Col>
              <Col span={2}></Col>
            </Row>
            <Divider></Divider>
            {data.additionalActivities.map((activity, index) => (
              <Row gutter={24} key={index}>
                <Col span={1}>
                  <div>{index + 1}</div>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item name={["additionalActivities", index, "activity"]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item
                    name={["additionalActivities", index, "functionalArea"]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item
                    name={["additionalActivities", index, "majorGoal"]}
                  >
                    <Select>
                      <Select.Option value={true}>Yes</Select.Option>
                      <Select.Option value={false}>No</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item name={["additionalActivities", index, "comments"]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            ))}
          </Panel>
          {/* </div> */}

          {/* Next Month Goals */}
          {/* <div
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            padding: "10px",
            marginTop: "16px",
          }}
        >
          <h3>Goals for Next Month</h3> */}

          <Panel header="Goals for Next Month" key="3">
            <Row gutter={24}>
              <Col span={1}>Sl. No</Col>
              <Col span={4}>Activity</Col>
              <Col span={4}>Functional area</Col>
              <Col span={4}>Major Goal</Col>
              <Col span={4}>Comments</Col>
              <Col span={2}></Col>
            </Row>
            <Divider></Divider>
            {data.nextMonthGoals.map((goal, index) => (
              <Row gutter={24} key={index}>
                <Col span={1}>
                  <div>{index + 1}</div>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item name={["nextMonthGoals", index, "activity"]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item name={["nextMonthGoals", index, "functionalArea"]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item name={["nextMonthGoals", index, "majorGoal"]}>
                    <Select>
                      <Select.Option value={true}>Yes</Select.Option>
                      <Select.Option value={false}>No</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item name={["nextMonthGoals", index, "comments"]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            ))}
          </Panel>
          {/* </div> */}

          {/* Additional Activities for Next Month */}
          {/* <div
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            padding: "10px",
            marginTop: "16px",
          }}
        >
          <h3>Additional activities for next month</h3> */}

          <Panel header="Additional activities for next month" key="4">
            <Row gutter={24}>
              <Col span={1}>Sl. No</Col>
              <Col span={4}>Activity</Col>
              <Col span={4}>Functional area</Col>
              <Col span={4}>Major Goal</Col>
              <Col span={4}>Comments</Col>
              <Col span={2}></Col>
            </Row>
            <Divider></Divider>
            {data.additionalActivitiesNextMonth.map((goal, index) => (
              <Row gutter={24} key={index}>
                <Col span={1}>
                  <div>{index + 1}</div>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item
                    name={["additionalActivitiesNextMonth", index, "activity"]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item
                    name={[
                      "additionalActivitiesNextMonth",
                      index,
                      "functionalArea",
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item
                    name={["additionalActivitiesNextMonth", index, "majorGoal"]}
                  >
                    <Select>
                      <Select.Option value={true}>Yes</Select.Option>
                      <Select.Option value={false}>No</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item
                    name={["additionalActivitiesNextMonth", index, "comments"]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            ))}
          </Panel>
          {/* </div> */}

          {/* Praise Points */}
          {/* <h3>Praise Points</h3> */}
          <Panel header="Praise Points" key="5">
            {/* <div
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            padding: "10px",
            marginTop: "16px",
          }}
        > */}
            <Form.Item name="praisePoints">
              <ul>
                {data.praisePoints.map((point, index) => (
                  <li key={index}>{point.point}</li>
                ))}
              </ul>
            </Form.Item>
          </Panel>
          {/* </div> */}

          {/* Prayer Requests */}
          {/* <div
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            padding: "10px",
            marginTop: "16px",
          }}
        >

          <h3>Prayer Requests</h3> */}
          <Panel header="Prayer Requests" key="6">
            <Form.Item name="prayerRequests">
              <ul>
                {data.prayerRequests.map((request, index) => (
                  <li key={index}>{request.request}</li>
                ))}
              </ul>
            </Form.Item>
          </Panel>
          {/* </div> */}

          {/* Story Testimony */}
          {/* <h3>Story Testimony</h3> */}
          <Panel header="Story Testimony" key="7">
            <Form.Item name="storyTestimony">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Panel>
          {/* Concerns and Struggles */}
          {/* <h3>Concerns & Struggles</h3> */}
          <Panel header="Concerns & Struggles" key="8">
            <Form.Item name="concernsStruggles">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Panel>
        </Collapse>
      </Form>

      <Space style={{ marginTop: "16px" }}>
        <Button type="default" href="/monthly-plans/my-plans">
          Back
        </Button>
      </Space>
    </>
  );
};

export default ViewMonthlyForm;
