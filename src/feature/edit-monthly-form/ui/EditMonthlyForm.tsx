import {
  achieved,
  goals,
  months,
  projects,
  functionalAreas,
  years,
} from "@/widgets/monthly-forms-list/config/projects";
import {
  DeleteTwoTone,
  MinusCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Form,
  Input,
  Row,
  Col,
  Select,
  Button,
  Space,
  message,
  Collapse,
  Divider,
} from "antd";
import { useEffect, useState } from "react";

const { Panel } = Collapse;

interface EditMonthlyFormProps {
  messageApi: any;
  initialValues: FormValues; // Updated to accept the full structure of FormValues
}

interface Goal {
  goal: string;
  majorGoal: boolean;
  achieved: boolean;
  whyNotAchieved?: string | null; // Allow `null` in addition to `string` and `undefined`
  comments?: string;
}

interface Activity {
  activity: string;
  majorGoal: boolean;
  functionalArea: string;
  comments?: string;
}

interface NextMonthGoal {
  goal: string;
  majorGoal: boolean;
  functionalArea: string;
  comments?: string;
}

interface PrayerRequest {
  prayerRequest: string;
}
interface PraisePoint {
  praise: string;
}

interface FormValues {
  projectName: string;
  month: string;
  goalsList: Goal[];
  additionalActivities: Activity[];
  additionalActivitiesNextMonth: Activity[];
  nextMonthGoals: NextMonthGoal[];
  praisePoints: PraisePoint[];
  prayerRequests: PrayerRequest[];
  storyTestimony: string;
  concernsStruggles: string;
}

const EditMonthlyForm: React.FC<EditMonthlyFormProps> = ({
  messageApi,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [isGoalsListEnabled, setIsGoalsListEnabled] = useState(false);

  useEffect(() => {
    // Populate the form with initial values when the component loads
    form.setFieldsValue(initialValues);

    const { projectName, month } = initialValues;
    if (projectName && month) {
      setIsGoalsListEnabled(true);
    }
  }, [form, initialValues]);

  const handleAchievedChange = (value: FormValues, index: number) => {
    const currentGoals = form.getFieldValue("goalsList");
    currentGoals[index].achieved = value;

    // If "No" is selected, we enable the 'whyNotAchieved' field
    form.setFieldsValue({
      goalsList: currentGoals,
    });
  };

  // const handleMajorGoalChange = (value: FormValues, index: number) => {
  //   const currentGoals = form.getFieldValue("goalsList");
  //   currentGoals[index].majorGoal = value;
  //   form.setFieldsValue({
  //     goalsList: currentGoals,
  //   });
  // };

  const handleValuesChange = (
    changedValues: any,
    allValues: { projectName: any; month: any }
  ) => {
    const { projectName, month } = allValues;
    setIsGoalsListEnabled(!!(projectName && month));
  };

  const handleSubmit = (values: FormValues) => {
    const incompleteFields = values.goalsList.some(
      (goal) =>
        goal.achieved === undefined ||
        (goal.achieved === false && !goal.whyNotAchieved)
    );

    if (incompleteFields) {
      messageApi.error(
        "All achieved fields must be filled, and reasons must be provided for goals not achieved."
      );
      return;
    }
    messageApi.success("Monthly form updated successfully");
    console.log("Form submitted successfully", values);
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      onValuesChange={handleValuesChange}
    >
      {/* Project and Month Section */}
      <Row gutter={24}>
        <Col xs={24} sm={6}>
          <Form.Item
            label="Project"
            name="projectName"
            rules={[{ required: true, message: "Project is required" }]}
          >
            <Select options={projects} placeholder="Select Project" disabled />
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>
          <Form.Item label="Month" name="month">
            <Select options={months} disabled />
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>
          <Form.Item label="Year" name="year">
            <Select options={years} disabled />
          </Form.Item>
        </Col>
      </Row>

      {isGoalsListEnabled && (
        <Collapse defaultActiveKey={["1", "2", "3", "4", "5", "6", "7", "8"]}>
          {/* Goals Section */}
          {/* <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              padding: "10px",
              marginTop: "16px",
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>
              Outcomes from the Month Just Ended
            </h3> */}

          <Panel header="Outcomes from the Month Just Ended" key="1">
            {/* Goals Section */}
            <Row gutter={24}>
              <Col span={1}>Sl. No</Col>
              <Col span={4}>Goal</Col>
              <Col span={4}>
                Achieved <span style={{ color: "red" }}>*</span>
              </Col>
              <Col span={4}>Reason for not achieving</Col>
              <Col span={4}>Major Goal</Col>
              <Col span={4}>Comments</Col>
              <Col span={2}></Col>
            </Row>
            <Divider></Divider>
            <Form.List name="goalsList">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Row gutter={24} key={key}>
                      <Col span={1}>
                        <div>{name + 1}</div>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item name={[name, "goal"]}>
                          <Input placeholder="Enter goal" disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          name={[name, "achieved"]}
                          rules={[
                            {
                              required: true,
                              message: "Please select if achieved",
                            },
                          ]}
                        >
                          <Select
                            options={achieved}
                            placeholder="Goal achieved or not"
                            onChange={(value) =>
                              handleAchievedChange(value, name)
                            } // Handle change here
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          name={[name, "whyNotAchieved"]}
                          dependencies={[name, "achieved"]}
                          required={false}
                          rules={[
                            ({ getFieldValue }) => ({
                              required:
                                getFieldValue([
                                  "goalsList",
                                  name,
                                  "achieved",
                                ]) === false,
                              message:
                                "Reason is required if goal is not achieved",
                            }),
                          ]}
                        >
                          <Input
                            disabled={
                              form.getFieldValue([
                                "goalsList",
                                name,
                                "achieved",
                              ]) !== false
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item name={[name, "majorGoal"]}>
                          <Select
                            options={achieved}
                            placeholder="Major goal or not"
                            disabled
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item name={[name, "comments"]}>
                          <Input placeholder="Add comments" />
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                </>
              )}
            </Form.List>
          </Panel>
          {/* </div> */}

          {/* Additional Activities Section */}
          {/* Additional Activities Section */}
          {/* <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              padding: "10px",
              marginTop: "16px",
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>
              Additional activities other than that is planned
            </h3> */}

          <Panel
            header="Additional activities other than that is planned"
            key="2"
          >
            {/* Additional Activities Section */}
            <Row gutter={24}>
              <Col span={1}>Sl. No</Col>
              <Col span={4}>
                Activity <span style={{ color: "red" }}>*</span>
              </Col>
              <Col span={4}>
                Functional area <span style={{ color: "red" }}>*</span>
              </Col>
              <Col span={4}>
                Major Goal <span style={{ color: "red" }}>*</span>
              </Col>
              <Col span={4}>Comments</Col>
              <Col span={2}></Col>
            </Row>
            <Divider></Divider>
            <Form.List name="additionalActivities">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Row gutter={24} key={key}>
                      <Col span={1}>
                        <div>{name + 1}</div>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          name={[name, "activity"]}
                          rules={[
                            { required: true, message: "Activity is required" },
                          ]}
                        >
                          <Input placeholder="Enter activity" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          name={[name, "functionalArea"]}
                          rules={[
                            {
                              required: true,
                              message: "Functional Area is required",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select functional area"
                            options={functionalAreas}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          name={[name, "majorGoal"]}
                          rules={[
                            {
                              required: true,
                              message: "Please whether its major goal or not",
                            },
                          ]}
                        >
                          <Select
                            options={achieved}
                            placeholder="Major goal or not"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item name={[name, "comments"]}>
                          <Input placeholder="Add comments" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        {/* <Button
                          onClick={() => remove(name)}
                          icon={<MinusOutlined />}
                        /> */}
                        <DeleteTwoTone
                          onClick={() => remove(name)}
                          twoToneColor="#FF0000"
                        />
                      </Col>
                    </Row>
                  ))}

                  <Button type="dashed" onClick={() => add()} block>
                    Add additional activity
                  </Button>
                </>
              )}
            </Form.List>
          </Panel>
          {/* </div> */}

          {/* Goals for Next Month */}
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
            {/* Goals for Next Month Section */}
            <Row gutter={24}>
              <Col span={1}>Sl. No</Col>
              <Col span={4}>Activity</Col>
              <Col span={4}>Functional area</Col>
              <Col span={4}>Major Goal</Col>
              <Col span={4}>Comments</Col>
              <Col span={2}></Col>
            </Row>
            <Divider></Divider>
            <Form.List name="nextMonthGoals">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Row gutter={24} key={key}>
                      <Col span={1}>
                        <div>{name + 1}</div>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item name={[name, "goal"]}>
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item name={[name, "functionalArea"]}>
                          <Select options={functionalAreas} disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item name={[name, "majorGoal"]}>
                          <Select
                            options={achieved}
                            placeholder="Major goal or not"
                            disabled
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item name={[name, "comments"]}>
                          <Input disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                </>
              )}
            </Form.List>
          </Panel>
          {/* </div> */}

          {/* Additional Activities for Next Month */}
          {/* <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              padding: "10px",
              marginTop: "16px",
              marginBottom: "24px",
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>
              Additional activities for next month
            </h3> */}

          <Panel header="Additional activities for next month" key="4">
            {/* Additional Activities for Next Month Section */}
            <Row gutter={24}>
              <Col span={1}>Sl. No</Col>
              <Col span={4}>
                Activity <span style={{ color: "red" }}>*</span>
              </Col>
              <Col span={4}>
                Functional area <span style={{ color: "red" }}>*</span>
              </Col>
              <Col span={4}>
                Major Goal <span style={{ color: "red" }}>*</span>
              </Col>
              <Col span={4}>Comments</Col>
              <Col span={2}></Col>
            </Row>
            <Divider></Divider>
            <Form.List name="additionalActivitiesNextMonth">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Row gutter={24} key={key}>
                      <Col span={1}>
                        <div>{name + 1}</div>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          name={[name, "activity"]}
                          rules={[
                            { required: true, message: "Activity is required" },
                          ]}
                        >
                          <Input placeholder="Enter activity" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          name={[name, "functionalArea"]}
                          rules={[
                            {
                              required: true,
                              message: "Functional Area is required",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select functional area"
                            options={functionalAreas}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          name={[name, "majorGoal"]}
                          rules={[
                            {
                              required: true,
                              message: "Please whether its major goal or not",
                            },
                          ]}
                        >
                          <Select
                            options={achieved}
                            placeholder="Major goal or not"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item name={[name, "comments"]}>
                          <Input placeholder="Add comments" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        {/* <Button
                          onClick={() => remove(name)}
                          icon={<MinusOutlined />}
                        /> */}
                        <DeleteTwoTone
                          onClick={() => remove(name)}
                          twoToneColor="#FF0000"
                        />
                      </Col>
                    </Row>
                  ))}

                  <Button type="dashed" onClick={() => add()} block>
                    Add additional activity
                  </Button>
                </>
              )}
            </Form.List>
          </Panel>
          {/* </div> */}

          {/* Praise Points */}
          {/* <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              padding: "10px",
              marginTop: "16px",
              marginBottom: "24px",
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>Praise points</h3> */}

          <Panel header="Praise points" key="5">
            {/* Praise/Prayer Request Section */}
            <Row gutter={24}>
              <Col xs={24}>
                <Form.Item required>
                  <Form.List name="praisePoints">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name }) => (
                          <Row key={key} gutter={24}>
                            <Col span={1}>
                              <div>{name + 1}</div>
                            </Col>
                            <Col xs={16}>
                              <Form.Item
                                name={[name, "praise"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input a praise point",
                                  },
                                ]}
                              >
                                <Input placeholder="Enter Praise Point" />
                              </Form.Item>
                            </Col>
                            <Col xs={4}>
                              <DeleteTwoTone
                                onClick={() => remove(name)}
                                twoToneColor="#FF0000"
                              />
                            </Col>
                          </Row>
                        ))}
                        <Form.Item>
                          {/* <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => add()} // Add another input field
                          >
                            Add Praise Point
                          </Button> */}
                          <Button type="dashed" onClick={() => add()} block>
                            Add praise point
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Form.Item>
              </Col>
            </Row>
          </Panel>
          {/* </div> */}

          {/* Prayer Requests Section */}
          {/* <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              padding: "10px",
              marginTop: "16px",
              marginBottom: "24px",
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>Prayer requests</h3> */}
          <Panel header="Prayer requests" key="6">
            {/* Praise/Prayer Request Section */}
            <Row gutter={24}>
              <Col xs={24}>
                <Form.Item required>
                  <Form.List name="prayerRequests">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name }) => (
                          <Row key={key} gutter={24}>
                            <Col span={1}>
                              <div>{name + 1}</div>
                            </Col>
                            <Col xs={16}>
                              <Form.Item
                                name={[name, "prayerRequest"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input a prayer request",
                                  },
                                ]}
                              >
                                <Input placeholder="Enter Prayer Request" />
                              </Form.Item>
                            </Col>
                            <Col xs={4}>
                              <DeleteTwoTone
                                onClick={() => remove(name)}
                                twoToneColor="#FF0000"
                              />
                            </Col>
                          </Row>
                        ))}
                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block>
                            Add praise point
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Form.Item>
              </Col>
            </Row>
          </Panel>
          {/* </div> */}

          {/* <div
            style={{
              marginTop: "16px",
            }}
          > */}

          <Panel header="Story and Concerns" key="7">
            {/* Story and Concerns */}
            <Form.Item
              label="Story/Testimony"
              name="storyTestimony"
              rules={[
                { required: true, message: "Story/Testimony is required" },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Panel>
          {/* </div> */}
          {/* <div
            style={{
              marginTop: "16px",
            }}
          > */}

          <Panel header="Concerns/Struggles" key="8">
            {/* Story and Concerns */}

            <Form.Item
              label="Concerns/Struggles"
              name="concernsStruggles"
              rules={[
                { required: true, message: "Concerns/Struggles is required" },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Panel>
          {/* </div> */}
        </Collapse>
      )}

      <Space style={{ marginTop: "24px" }}>
        <Button type="default" href="/monthly-form/my-forms">
          Cancel
        </Button>
        <Button type="primary" htmlType="submit">
          Save as draft
        </Button>
        <Button type="primary" htmlType="submit">
          Submit for approval
        </Button>
      </Space>
    </Form>
  );
};

export default EditMonthlyForm;
