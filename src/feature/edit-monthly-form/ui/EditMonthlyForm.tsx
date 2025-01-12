import {
  achieved,
  goals,
  months,
  projects,
  functionalAreas,
} from "@/widgets/monthly-forms-list/config/projects";
import {
  MinusCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Form, Input, Row, Col, Select, Button, Space, message } from "antd";
import { useEffect, useState } from "react";

interface EditMonthlyFormProps {
  messageApi: any;
  initialValues: FormValues; // Updated to accept the full structure of FormValues
}

interface Goal {
  goal: string;
  achieved: boolean;
  whyNotAchieved?: string | null; // Allow `null` in addition to `string` and `undefined`
  comments?: string;
}

interface Activity {
  activity: string;
  functionalArea: string;
  comments?: string;
}

interface NextMonthGoal {
  goal: string;
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
            <Select options={projects} placeholder="Select Project" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>
          <Form.Item label="Month" name="month">
            <Select options={months} disabled />
          </Form.Item>
        </Col>
      </Row>

      {isGoalsListEnabled && (
        <>
          {/* Goals Section */}
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
                      <Col xs={24} sm={5}>
                        <Form.Item
                          label={name === 0 ? "Goal" : ""}
                          name={[name, "goal"]}
                          initialValue={goals[name]?.goal}
                        >
                          <Input placeholder="Enter goal" disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={5}>
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
                      <Col xs={24} sm={5}>
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
                      <Col xs={24} sm={5}>
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

          {/* Goals for Next Month */}
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              padding: "10px",
              marginTop: "16px",
            }}
          >
            <h3>Goals for Next Month</h3>
            <Form.List name="nextMonthGoals">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Row align="middle" gutter={24} key={key}>
                      <Col xs={24} sm={8}>
                        <Form.Item
                          label={name === 0 ? "Goal" : ""}
                          name={[name, "goal"]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Form.Item
                          label={name === 0 ? "Functional area" : ""}
                          name={[name, "functionalArea"]}
                        >
                          <Select options={functionalAreas} disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Form.Item
                          label={name === 0 ? "Comments" : ""}
                          name={[name, "comments"]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                </>
              )}
            </Form.List>
          </div>

          {/* Additional Activities for Next Month */}
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

          {/* Praise Points */}
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
                  <Form.List name="praisePoints">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name }) => (
                          <Row key={key} gutter={24}>
                            <Col xs={20}>
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
                              {key !== 0 && (
                                <MinusCircleOutlined
                                  onClick={() => remove(name)}
                                />
                              )}
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
                  <Form.List name="prayerRequests">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name }) => (
                          <Row key={key} gutter={24}>
                            <Col xs={20}>
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
                              {key !== 0 && (
                                <MinusCircleOutlined
                                  onClick={() => remove(name)}
                                />
                              )}
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

          <div
            style={{
              marginTop: "16px",
            }}
          >
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
          </div>
          <div
            style={{
              marginTop: "16px",
            }}
          >
            <Form.Item
              label="Concerns/Struggles"
              name="concernsStruggles"
              rules={[
                { required: true, message: "Concerns/Struggles is required" },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </div>
        </>
      )}

      <Space>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button type="default" onClick={() => form.resetFields()}>
          Reset
        </Button>
      </Space>
    </Form>
  );
};

export default EditMonthlyForm;
