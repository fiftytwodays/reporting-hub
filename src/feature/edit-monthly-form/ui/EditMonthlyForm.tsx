import {
  achieved,
  goals,
  months,
  projects,
  functionalAreas,
} from "@/widgets/monthly-forms-list/config/projects";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
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
              padding: "16px",
              marginTop: "24px",
            }}
          >
            <h3>Outcomes from the Month Just Ended</h3>
            <Form.List name="goalsList">
              {(fields) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Row align="middle" gutter={24} key={key}>
                      <Col xs={24} sm={6}>
                        <Form.Item
                          label={name === 0 ? "Goal" : ""}
                          name={[name, "goal"]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={6}>
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
                          <Select options={achieved} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={6}>
                        <Form.Item
                          label={name === 0 ? "Reason for Not Achieving" : ""}
                          name={[name, "whyNotAchieved"]}
                          dependencies={[name, "achieved"]}
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
                      <Col xs={24} sm={6}>
                        <Form.Item
                          label={name === 0 ? "Comments" : ""}
                          name={[name, "comments"]}
                        >
                          <Input />
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
              padding: "16px",
              marginTop: "24px",
            }}
          >
            <h3>Additional Activities</h3>
            <Form.List name="additionalActivities">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Row align="middle" gutter={24} key={key}>
                      <Col xs={24} sm={8}>
                        <Form.Item
                          label="Activity"
                          name={[name, "activity"]}
                          rules={[
                            { required: true, message: "Activity is required" },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
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
                          <Select options={functionalAreas} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Form.Item label="Comments" name={[name, "comments"]}>
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add Additional Activity
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
              padding: "16px",
              marginTop: "24px",
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
                          label="Goal"
                          name={[name, "goal"]}
                          rules={[
                            { required: true, message: "Goal is required" },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
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
                          <Select options={functionalAreas} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Form.Item label="Comments" name={[name, "comments"]}>
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add Goal for Next Month
                  </Button>
                </>
              )}
            </Form.List>
          </div>

          {/* Additional Activities for Next Month */}
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              padding: "16px",
              marginTop: "24px",
            }}
          >
            <h3>Additional Activities for Next Month</h3>
            <Form.List name="additionalActivitiesNextMonth">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Row align="middle" gutter={24} key={key}>
                      <Col xs={24} sm={8}>
                        <Form.Item
                          label="Activity"
                          name={[name, "activity"]}
                          rules={[
                            { required: true, message: "Activity is required" },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
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
                          <Select options={functionalAreas} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Form.Item label="Comments" name={[name, "comments"]}>
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add Next Month Activity
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
              padding: "16px",
              marginTop: "24px",
            }}
          >
            <h3>Praise Points</h3>
            <Form.List name="praisePoints">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Row align="middle" gutter={24} key={key}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Praise"
                          name={[name, "praise"]}
                          rules={[
                            { required: true, message: "Praise is required" },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add Praise Point
                  </Button>
                </>
              )}
            </Form.List>
          </div>

          {/* Prayer Requests */}
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              padding: "16px",
              marginTop: "24px",
            }}
          >
            <h3>Prayer Requests</h3>
            <Form.List name="prayerRequests">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Row align="middle" gutter={24} key={key}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Prayer Request"
                          name={[name, "prayerRequest"]}
                          rules={[
                            {
                              required: true,
                              message: "Prayer Request is required",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add Prayer Request
                  </Button>
                </>
              )}
            </Form.List>
          </div>

          <div
            style={{
              marginTop: "24px",
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
              marginTop: "24px",
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
