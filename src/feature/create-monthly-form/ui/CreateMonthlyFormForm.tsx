import {
  achieved,
  goals,
  months,
  projects,
  functionalAreas,
  nextMonthGoals, // Add this import for the goals for next month
} from "@/widgets/monthly-forms-list/config/projects";
import {
  MinusOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { Form, Input, Row, Col, Select, Button, Space, message } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface CreateMonthlyFormProps {
  messageApi: MessageInstance;
}

interface Goal {
  goal: string;
  majorGoal: boolean;
  achieved: boolean;
  whyNotAchieved?: string;
  comments?: string;
}

interface FormValues {
  projectName: string;
  month: string;
  goalsList: Goal[];
  additionalActivities: Array<{
    activity: string;
    majorGoal: boolean;
    functionalArea: string;
    comments?: string;
  }>;
  nextMonthGoals: Array<{
    activity: string;
    majorGoal: boolean;
    functionalArea: string;
    comments?: string;
  }>;
  praisePrayerRequest: string;
  storyTestimony: string;
  concernsStruggles: string;
}

const CreateMonthlyFormForm: React.FC<CreateMonthlyFormProps> = ({
  messageApi,
}) => {
  const [defaultMonth, setDefaultMonth] = useState<number>();

  const [form] = Form.useForm();

  const [isGoalsListEnabled, setIsGoalsListEnabled] = useState(false);

  const handleValuesChange = (
    changedValues: any,
    allValues: { projectName: any; month: any }
  ) => {
    const { projectName, month } = allValues;
    if (projectName && month) {
      setIsGoalsListEnabled(true);
    } else {
      setIsGoalsListEnabled(false);
    }
  };

  useEffect(() => {
    const currentDate = dayjs();
    const currentDay = currentDate.date();
    const currentMonth = currentDate.month() + 1; // dayjs months are 0-indexed
    const calculatedMonth = currentDay > 25 ? currentMonth : currentMonth - 1;

    // Adjust for January (month 1) when subtracting 1 month
    const finalMonth = calculatedMonth > 0 ? calculatedMonth : 12;

    setDefaultMonth(finalMonth);
    form.setFieldValue("month", finalMonth);
  }, [form]);

  const handleSubmit = (values: FormValues) => {
    const incompleteFields = values.goalsList.some(
      (goal) =>
        goal.achieved === undefined ||
        (goal.achieved === false && !goal.whyNotAchieved)
    );

    if (incompleteFields) {
      message.error(
        "All achieved fields must be filled, and reasons must be provided for goals not achieved."
      );
      return;
    }
    messageApi.success("Monthly form created successfully");
  };

  const handleAchievedChange = (value: FormValues, index: number) => {
    const currentGoals = form.getFieldValue("goalsList");
    currentGoals[index].achieved = value;

    // If "No" is selected, we enable the 'whyNotAchieved' field
    form.setFieldsValue({
      goalsList: currentGoals,
    });
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      initialValues={{ goalsList: goals }}
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
            <Select options={projects} placeholder="Select Project" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>
          <Form.Item label="Month" name="month">
            <Select options={months} value={defaultMonth} disabled />
          </Form.Item>
        </Col>
      </Row>

      {isGoalsListEnabled && (
        <>
          {/* Boxed Section for Goals */}
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              padding: "10px",
              marginTop: "16px",
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>
              Outcomes from the Month Just Ended
            </h3>

            {/* Goals Section */}
            <Form.List name="goalsList">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Row align="middle" gutter={24} key={key}>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          label={name === 0 ? "Goal" : ""}
                          name={[name, "goal"]}
                          initialValue={goals[name]?.goal}
                        >
                          <Input placeholder="Enter goal" disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          label={name === 0 ? "Major goal" : ""}
                          name={[name, "majorGoal"]}
                        >
                          <Select
                            options={achieved}
                            placeholder="Major goal or not"
                            disabled
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          label={name === 0 ? "Achieved" : ""}
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
                          label={name === 0 ? "Reason for not achieving" : ""}
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
                        <Form.Item
                          label={name === 0 ? "Comments" : ""}
                          name={[name, "comments"]}
                        >
                          <Input placeholder="Add comments" />
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                </>
              )}
            </Form.List>
          </div>

          {/* Additional Activities Section */}
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              padding: "10px",
              marginTop: "16px",
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>
              Additional activities other than that is planned
            </h3>

            {/* Additional Activities Section */}
            <Form.List name="additionalActivities">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Row align="middle" gutter={24} key={key}>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          label="Activity"
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
                          label={"Major goal"}
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
                        <Form.Item
                          label="Functional Area"
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
                        <Form.Item label="Comments" name={[name, "comments"]}>
                          <Input placeholder="Add comments" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Button
                          onClick={() => remove(name)}
                          icon={<MinusOutlined />}
                        />
                      </Col>
                    </Row>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add additional activity
                  </Button>
                </>
              )}
            </Form.List>
          </div>

          {/* Goals for Next Month Section */}
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              padding: "10px",
              marginTop: "16px",
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>Goals for next month</h3>

            {/* Goals for next month Section */}
            <Form.List name="nextMonthGoals">
              {(fields) => (
                <>
                  {nextMonthGoals.map((goal, index) => (
                    <Row align="middle" gutter={24} key={index}>
                      <Col xs={24} sm={6}>
                        <Form.Item
                          label={index === 0 ? "Activity" : ""}
                          name={[index, "activity"]}
                          initialValue={goal.activity}
                        >
                          <Input placeholder="Activity" disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          label={index === 0 ? "Major goal" : ""}
                          name={[index, "majorGoal"]}
                          initialValue={goal.majorGoal}
                        >
                          <Select
                            options={achieved}
                            placeholder="Major goal or not"
                            disabled
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={6}>
                        <Form.Item
                          label={index === 0 ? "Functional Area" : ""}
                          name={[index, "functionalArea"]}
                          initialValue={goal.functionalArea}
                        >
                          <Input placeholder="Functional Area" disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={6}>
                        <Form.Item
                          label={index === 0 ? "Comments" : ""}
                          name={[index, "comments"]}
                          initialValue={goal.comments}
                        >
                          <Input placeholder="Comments" disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                </>
              )}
            </Form.List>
          </div>

          {/* Additional Activities for Next Month Section */}
          <div
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
            </h3>

            {/* Additional Activities for Next Month Section */}
            <Form.List name="additionalActivitiesNextMonth">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Row align="middle" gutter={24} key={key}>
                      <Col xs={24} sm={6}>
                        <Form.Item
                          label="Activity"
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
                          label={"Major goal"}
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
                      <Col xs={24} sm={6}>
                        <Form.Item
                          label="Functional Area"
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
                      <Col xs={24} sm={6}>
                        <Form.Item label="Comments" name={[name, "comments"]}>
                          <Input placeholder="Add comments" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={6}>
                        <Button
                          type="text"
                          onClick={() => remove(name)}
                          icon={<MinusOutlined />}
                        />
                      </Col>
                    </Row>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add additional activity
                  </Button>
                </>
              )}
            </Form.List>
          </div>

          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              padding: "10px",
              marginTop: "16px",
              marginBottom: "24px",
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>Praise points</h3>
            {/* Praise/Prayer Request Section */}
            <Row gutter={24}>
              <Col xs={24}>
                <Form.Item required>
                  <Form.List
                    name="praisePoints"
                    initialValue={[{ point: "" }]} // Add initial empty input field
                  >
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name }) => (
                          <Row key={key} gutter={24}>
                            <Col xs={20}>
                              <Form.Item
                                name={[name, "point"]}
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
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                              />
                            </Col>
                          </Row>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => add()} // Add another input field
                          >
                            Add Praise Point
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Prayer Requests Section */}
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              padding: "10px",
              marginTop: "16px",
              marginBottom: "24px",
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>Prayer requests</h3>
            <Row gutter={24}>
              <Col xs={24}>
                <Form.Item required>
                  <Form.List
                    name="prayerRequests"
                    initialValue={[{ request: "" }]} // Add initial empty input field
                  >
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name }) => (
                          <Row key={key} gutter={24}>
                            <Col xs={20}>
                              <Form.Item
                                name={[name, "request"]}
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
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                              />
                            </Col>
                          </Row>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => add()} // Add another input field
                          >
                            Add Prayer Request
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Story/Testimony Section */}
          <Row gutter={24}>
            <Col xs={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please provide an input",
                  },
                ]}
                label="Story/Testimony"
                name="storyTestimony"
              >
                <Input.TextArea
                  placeholder="Please enter your story or testimony. If you don't have one, simply write `none`"
                  rows={4}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Concerns/Struggles Section */}
          <Row gutter={24}>
            <Col xs={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please provide an input",
                  },
                ]}
                label="Concerns/Struggles"
                name="concernsStruggles"
              >
                <Input.TextArea
                  placeholder="Please enter your concerns or struggles. If you don't have one, simply write `none`"
                  rows={4}
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}

      {/* Footer Actions */}
      <Space style={{ marginTop: "24px" }}>
        <Button type="default" onClick={() => form.resetFields()}>
          Reset
        </Button>
        <Button type="default" href="/monthly-form/my-forms">
          Cancel
        </Button>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Space>
    </Form>
  );
};

export default CreateMonthlyFormForm;
