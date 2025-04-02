import {
  achieved,
  months,
  projects,
  functionalAreas,
  nextMonthGoals,
  years, // Add this import for the goals for next month
} from "@/widgets/monthly-forms-list/config/projects";
import {
  MinusOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  DeleteTwoTone,
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
  Spin,
} from "antd";
import { MessageInstance } from "antd/es/message/interface";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import usePlansFetcher from "../api/get-all-goals";
import { getCurrentUser } from "@aws-amplify/auth";
import Projects from "./Projects";
import useFunctionalAreaList from "../api/functional-area-options";

const { Panel } = Collapse;

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
  project: string;
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
  const [loggedUser, setLoggedUser] = useState("");

  const setLoggedUserDetails = async () => {
    const { username, userId, signInDetails } = await getCurrentUser();
    setLoggedUser(userId);
  };
  const [defaultMonth, setDefaultMonth] = useState<number>();
  const [currentYear, setCurrentYear] = useState<string>();

  const [form] = Form.useForm();
  const [projectId, setProjectId] = useState<string>("");

  // const [isGoalsListEnabled, setIsGoalsListEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // const handleValuesChange = (
  //   changedValues: any,
  //   allValues: { project: any; month: any }
  // ) => {
  //   const { project, month } = allValues;
  //   console.log("Project ID:", project);
  //   console.log("Month:", month);
  //   console.log("All Values:", allValues);
  //   if (project && month) {
  //     console.log("Project ID:", project);
  //     console.log("Month:", month);
  //     setIsGoalsListEnabled(true);
  //   } else {
  //     setIsGoalsListEnabled(false);
  //   }
  // };

  console.log("Plans");
  setLoggedUserDetails();

  const { functionalAreasData, isFunctionalAreaTypesDataLoading } =
    useFunctionalAreaList({ condition: true });

  console.log("Functional Areas Data", functionalAreasData);

  const {
    plans,
    isLoading: isPlanListloading,
    error,
  } = usePlansFetcher({
    condition: true,
    projectId,
    userId: loggedUser,
    month: 6,
    // month: form.getFieldValue("month"),
    // year: form.getFieldValue("year"),
    year: 2025,
  });
  useEffect(() => {
    const currentDate = dayjs();
    const currentYear = currentDate.year();
    const currentDay = currentDate.date();
    const currentMonth = currentDate.month() + 1; // dayjs months are 0-indexed
    const calculatedMonth = currentDay > 25 ? currentMonth : currentMonth - 1;

    // Adjust for January (month 1) when subtracting 1 month
    const finalMonth = calculatedMonth > 0 ? calculatedMonth : 12;

    setDefaultMonth(finalMonth);
    form.setFieldValue("month", finalMonth);
    form.setFieldValue("year", currentYear);
  }, [form]);

  const handleSubmit = (values: FormValues) => {
    console.log("Form values:", values);
    console.log("Form values:", values);

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
    console.log(values);
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
      initialValues={{
        goalsList: Array.isArray(plans) ? [] : plans.CurrentMonthGoals,
        nextMonthGoals:
          !Array.isArray(plans) && plans?.NextMonthGoals
            ? plans.NextMonthGoals
            : [],
      }}
      // onValuesChange={handleValuesChange}
    >
      {/* Project and Month Section */}
      <Row gutter={24}>
        <Col xs={24} sm={6}>
          <Form.Item
            label={!loading && "Project"}
            name="project"
            rules={[{ required: true, message: "Project is required" }]}
          >
            <Projects
              form={form}
              fetchAll={false}
              setLoading={setLoading}
              id={form.getFieldValue("project") ?? undefined}
              setSelectedProject={setProjectId}
            />
          </Form.Item>
        </Col>
        {!loading && (
          <>
            <Col xs={24} sm={6}>
              <Form.Item label="Month" name="month">
                <Select options={months} value={defaultMonth} disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item label="Year" name="year">
                <Select options={years} value={currentYear} disabled />
              </Form.Item>
            </Col>
          </>
        )}
      </Row>

      {/* {isGoalsListEnabled && */}
      {!isPlanListloading &&
        projectId !== "" &&
        plans != null &&
        !isFunctionalAreaTypesDataLoading && (
          <>
            <Collapse
              defaultActiveKey={["1", "2", "3", "4", "5", "6", "7", "8"]}
            >
              {/* Boxed Section for Goals */}
              {/* <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              padding: "10px",
              marginTop: "16px",
            }}
          > */}
              {/* <h3 style={{ marginBottom: "16px" }}>
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
                      {Array.isArray(plans)
                        ? null
                        : plans.CurrentMonthGoals.map((activity, index) => (
                            <Row gutter={24} key={index}>
                              <Col span={1}>
                                <div>{index + 1}</div>
                              </Col>
                              <Col xs={24} sm={4}>
                                <Form.Item
                                  // label={name === 0 ? "Goal" : ""}
                                  name={[index, "goal"]}
                                  initialValue={
                                    plans.CurrentMonthGoals[index]?.activity
                                  }
                                >
                                  <Input placeholder="Enter goal" disabled />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={4}>
                                <Form.Item
                                  // label={name === 0 ? "Achieved" : ""}
                                  name={[index, "achieved"]}
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
                                      handleAchievedChange(value, index)
                                    } // Handle change here
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={4}>
                                <Form.Item
                                  // label={name === 0 ? "Reason for not achieving" : ""}
                                  name={[index, "whyNotAchieved"]}
                                  dependencies={[index, "achieved"]}
                                  required={false}
                                  rules={[
                                    ({ getFieldValue }) => ({
                                      required:
                                        getFieldValue([
                                          "goalsList",
                                          index,
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
                                        index,
                                        "achieved",
                                      ]) !== false
                                    }
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={4}>
                                <Form.Item
                                  // label={name === 0 ? "Major goal" : ""}
                                  name={[index, "majorGoal"]}
                                >
                                  <Select
                                    options={achieved}
                                    defaultValue={
                                      plans.CurrentMonthGoals[index]
                                        ?.isMajorGoal
                                    }
                                    placeholder="Major goal or not"
                                    disabled
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={4}>
                                <Form.Item
                                  // label={name === 0 ? "Comments" : ""}
                                  name={[index, "comments"]}
                                >
                                  <Input
                                    placeholder="Add comments"
                                    defaultValue={
                                      plans.CurrentMonthGoals[index]
                                        ?.comments ?? ""
                                    }
                                  />
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
                {/* Additional Activities Section */}
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
                              // label="Activity"
                              name={[name, "activity"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Activity is required",
                                },
                              ]}
                            >
                              <Input placeholder="Enter activity" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={4}>
                            <Form.Item
                              // label="Functional Area"
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
                                options={functionalAreasData}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={4}>
                            <Form.Item
                              // label={"Major goal"}
                              name={[name, "majorGoal"]}
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Please select whether its major goal or not",
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
                              // label="Comments"
                              name={[name, "comments"]}
                            >
                              <Input placeholder="Add comments" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={4}>
                            {/* <Button
                          type="text"
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

                      {/* <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add additional activity
                  </Button> */}
                      <Button type="dashed" onClick={() => add()} block>
                        Add additional activity
                      </Button>
                    </>
                  )}
                </Form.List>
              </Panel>
              {/* </div> */}

              {/* Goals for Next Month Section */}
              {/* <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              padding: "10px",
              marginTop: "16px",
            }}
          > */}

              {/* <h3 style={{ marginBottom: "16px" }}>Goals for next month</h3> */}

              <Panel header="Goals for next month Section" key="3">
                {/* Goals for next month Section */}

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
                  {(fields) => (
                    <>
                      {!Array.isArray(plans) &&
                        plans.NextMonthGoals.map((goal, index) => (
                          <Row gutter={24} key={index}>
                            <Col span={1}>
                              <div>{index + 1}</div>
                            </Col>
                            <Col xs={24} sm={4}>
                              <Form.Item
                                // label={index === 0 ? "Activity" : ""}
                                name={[index, "activity"]}
                                initialValue={
                                  plans.NextMonthGoals[index].activity
                                }
                              >
                                <Input placeholder="Activity" disabled />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={4}>
                              <Form.Item
                                // label={index === 0 ? "Functional Area" : ""}
                                name={[index, "functionalArea"]}
                                initialValue={
                                  plans.NextMonthGoals[index].functionalAreaId
                                }
                              >
                                <Select
                                  defaultValue={
                                    plans.NextMonthGoals[index].functionalAreaId
                                  }
                                  options={functionalAreasData}
                                  placeholder="Functional Area"
                                  disabled
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={4}>
                              <Form.Item
                                // label={index === 0 ? "Major goal" : ""}
                                name={[index, "majorGoal"]}
                                initialValue={
                                  plans.NextMonthGoals[index].isMajorGoal
                                }
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
                                // label={index === 0 ? "Comments" : ""}
                                name={[index, "comments"]}
                                initialValue={
                                  plans.NextMonthGoals[index].comments ?? ""
                                }
                              >
                                <Input placeholder="Comments" disabled />
                              </Form.Item>
                            </Col>
                          </Row>
                        ))}
                    </>
                  )}
                </Form.List>
              </Panel>
              {/* </div> */}

              {/* Additional Activities for Next Month Section */}
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
                {/* Additional Activities for Next Month Section */}
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
                              // label="Activity"
                              name={[name, "activity"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Activity is required",
                                },
                              ]}
                            >
                              <Input placeholder="Enter activity" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={4}>
                            <Form.Item
                              // label="Functional Area"
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
                                options={functionalAreasData}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={4}>
                            <Form.Item
                              // label={"Major goal"}
                              name={[name, "majorGoal"]}
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Please select whether its major goal or not",
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
                              // label="Comments"
                              name={[name, "comments"]}
                            >
                              <Input placeholder="Add comments" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={4}>
                            {/* <Button
                          type="text"
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

                      {/* <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add additional activity
                  </Button> */}
                      <Button type="dashed" onClick={() => add()} block>
                        Add additional activity
                      </Button>
                    </>
                  )}
                </Form.List>
              </Panel>
              {/* </div> */}

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
                      <Form.List
                        name="praisePoints"
                        initialValue={[{ point: "" }]} // Add initial empty input field
                      >
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(({ key, name }) => (
                              <Row key={key} gutter={24}>
                                <Col span={1}>
                                  <div>{name + 1}</div>
                                </Col>
                                <Col xs={16}>
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
                                {/* <Col xs={4}>
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                              />
                            </Col> */}
                                <Col xs={4}>
                                  {fields.length > 1 && (
                                    <DeleteTwoTone
                                      onClick={() => remove(name)}
                                      twoToneColor="#FF0000"
                                    />
                                  )}
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
                                <Col span={1}>
                                  <div>{name + 1}</div>
                                </Col>
                                <Col xs={16}>
                                  <Form.Item
                                    name={[name, "request"]}
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          "Please input a prayer request",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="Enter Prayer Request" />
                                  </Form.Item>
                                </Col>
                                {/* <Col xs={4}>
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                              />
                            </Col> */}
                                <Col xs={4}>
                                  {fields.length > 1 && (
                                    <DeleteTwoTone
                                      onClick={() => remove(name)}
                                      twoToneColor="#FF0000"
                                    />
                                  )}
                                </Col>
                              </Row>
                            ))}
                            <Form.Item>
                              {/* <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => add()} // Add another input field
                          >
                            Add Prayer Request
                          </Button> */}
                              <Button type="dashed" onClick={() => add()} block>
                                Add prayer request
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

              {/* Story/Testimony Section */}
              <Panel header="Story/Testimony" key="7">
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
              </Panel>

              {/* Concerns/Struggles Section */}
              <Panel header="Concerns/Struggles" key="8">
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
              </Panel>
            </Collapse>

            {/* Footer Actions */}
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
          </>
        )}
    </Form>
  );
};

export default CreateMonthlyFormForm;
