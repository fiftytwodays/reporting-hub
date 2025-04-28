import {
  achieved,
  months,
  years, // Add this import for the goals for next month
} from "@/widgets/monthly-forms-list/config/projects";
import { DeleteTwoTone } from "@ant-design/icons";

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
  Modal,
} from "antd";
import { MessageInstance } from "antd/es/message/interface";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import usePlansFetcher from "../api/get-all-goals";
import { fetchUserAttributes, getCurrentUser } from "@aws-amplify/auth";
import Projects from "./Projects";
import useFunctionalAreaList from "../api/functional-area-options";
import { useSaveMonthlyForm } from "../api/handle-monthly-form";
import { useSaveOutcomes } from "../api/create-outcome";
import { useDeleteMonthlyForm } from "../api/delete-monthly-form";
import { useSaveAdditionalActivity } from "../api/create-additional-activity";
import { useSaveAdditionalActivityNextMonth } from "../api/create-additional-activity-next-month";
import { getOutcomeByMonthlyFormId } from "../api/get-outcomes-specific";
import { useDeleteAdditionalActivity } from "../api/delete-additional-activity";
import { useDeleteAdditionalActivityNextMonth } from "../api/delete-additional-activity-nextMonth";
import { getAdditionalActivitiesByMonthlyFormId } from "../api/get-additionalActivity-specific";
import { getAdditionalActivitiesNextMonthByMonthlyFormId } from "../api/get-additionalActivity-nextMonth-specific";
import useUpdateStatus from "../api/update-monthlyForm-status";
import useParameters from "@/entities/parameters/api/parameters-list";
import { useRouter } from "next/navigation";
import useUsersList from "@/entities/user/api/users-list";

const { Panel } = Collapse;

interface CreateMonthlyFormProps {
  messageApi: MessageInstance;
  monthlyForm: MonthlyForm | null;
  action: "create" | "view" | "edit" | "approver-view"; // Define specific string literal types for action
}

interface Outcome {
  id: string;
  monthlyFormId: string;
  activityId: string;
  reason: string;
  achieved: boolean;
  comments: string;
}

interface MonthlyForm {
  id: string;
  projectId: string;
  month: string;
  clusterId: string;
  year: string;
  status: string;
  facilitator: string;
  praisePoints: (string | null)[]; // Each item may be null
  prayerRequests: (string | null)[]; // Each item may be null
  story: string;
  concerns: string;
  comments: string;
}

interface Goal {
  goal: string;
  majorGoal: boolean;
  achieved: boolean;
  whyNotAchieved?: string;
  comments?: string;
}

interface FormValues {
  id: string;
  project: string;
  month: string;
  goalsList: Goal[];
  additionalActivities: Array<{
    id: string;
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
  comments: string;
}

const CreateMonthlyFormForm: React.FC<CreateMonthlyFormProps> = ({
  messageApi,
  monthlyForm,
  action,
}) => {
  const router = useRouter();
  const [loggedUser, setLoggedUser] = useState("");
  const [loading, setLoading] = useState(true);
  const { parametersList, isParametersListLoading } = useParameters({
    condition: true,
  });
  const [isAdditionalActivityDeleted, setIsAdditionalActivityDeleted] =
    useState(false);
  const [
    isAdditionalActivityNextMonthDeleted,
    setIsAdditionalActivityNextMonthDeleted,
  ] = useState(false);
  const [defaultMonth, setDefaultMonth] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState<string>();
  const [form] = Form.useForm();
  const [projectId, setProjectId] = useState<string>("");
  const [isFormReady, setIsFormReady] = useState(false); // New state to control form rendering

  const setLoggedUserDetails = async () => {
    const { userId } = await getCurrentUser();
    setLoggedUser(userId);
  };

  const [clusters, setClusters] = useState<string[]>([]);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const clustersValue = attributes["custom:clusters"];
        setClusters(stringToArray(clustersValue));
      } catch (error) {
        console.error("Error fetching user attributes:", error);
      }
    };

    fetchAttributes();
  }, []);

  function stringToArray(str: string | undefined) {
    if (str) {
      const cleanedStr = str.replace(/[\[\]]/g, "").trim();
      if (!cleanedStr) {
        return [];
      }
      const arr = cleanedStr.includes(",")
        ? cleanedStr.split(",").map((item) => item.trim())
        : [cleanedStr];
      return arr;
    } else {
      return [];
    }
  }

  setLoggedUserDetails();

  const {
    saveMonthlyForm,
    savedMonthlyForm,
    isMonthlyFormSaving,
    saveMonthlyFormError,
  } = useSaveMonthlyForm();

  const { deleteAdditionalActivity } = useDeleteAdditionalActivity();

  const { deleteAdditionalActivityNextMonth } =
    useDeleteAdditionalActivityNextMonth();

  const { updateStatus, updatedStatus, isStatusUpdating, updateStatusError } =
    useUpdateStatus();

  const { saveOutcome, savedOutcomes, isOutcomesSaving, saveOutcomesError } =
    useSaveOutcomes();

  const {
    outcomes: outcomesFetched,
    isOutcomesLoading,
    isOutcomesError,
  } = getOutcomeByMonthlyFormId({
    condition: true,
    monthlyFormId: monthlyForm?.id || "",
  });

  const {
    additionalActivities: additionalActivitiesFetched,
    isAdditionalActivitiesLoading,
  } = getAdditionalActivitiesByMonthlyFormId({
    condition: true,
    monthlyFormId: monthlyForm?.id || "",
  });

  const {
    additionalActivitiesNextMonth: additionalActivitiesNextMonthFetched,
    isAdditionalActivitiesNextMonthLoading,
  } = getAdditionalActivitiesNextMonthByMonthlyFormId({
    condition: true,
    monthlyFormId: monthlyForm?.id || "",
  });

  const { saveAdditionalActivity } = useSaveAdditionalActivity();

  const { saveAdditionalActivityNextMonth } =
    useSaveAdditionalActivityNextMonth();

  const { functionalAreasData, isFunctionalAreaTypesDataLoading } =
    useFunctionalAreaList({ condition: true });

  const userId = monthlyForm?.facilitator ?? loggedUser;

  const {
    plans,
    isLoading: isPlanListloading,
    error: planListError,
  } = usePlansFetcher({
    condition: !isParametersListLoading,
    projectId,
    userId: loggedUser,
    // month: 6,
    month: form.getFieldValue("month"),
    year: form.getFieldValue("year"),
    action: action,
    facilitatorId: userId,
    // year: 2025,
  });

  const { usersList } = useUsersList({ condition: true });
  let userName = "";
  usersList.find((user) => {
    if (user.Username === userId) {
      userName = `${user.GivenName ?? ""} ${user.FamilyName ?? ""}`.trim();
    }
  });

  useEffect(() => {
    if (planListError) {
      setErrorMessage(planListError.message);
    } else {
      setErrorMessage(null); // Clear error message if no error
    }
  }, [planListError]);

  useEffect(() => {
    const currentDate = dayjs();
    const currentYear = currentDate.year();
    const currentDay = currentDate.date();
    const currentMonth = currentDate.month() + 1; // dayjs months are 0-indexed
    const startDate = Number(parametersList?.monthlyFormStartDate || 0);
    const calculatedMonth =
      currentDay > startDate ? currentMonth : currentMonth - 1;

    // Adjust for January (month 1) when subtracting 1 month
    const finalMonth = calculatedMonth > 0 ? calculatedMonth : 12;

    setDefaultMonth(finalMonth);
    form.setFieldValue("month", finalMonth);
    form.setFieldValue("year", currentYear);
  }, [form, parametersList]);

  useEffect(() => {
    if (
      monthlyForm &&
      !isOutcomesLoading &&
      !isAdditionalActivitiesLoading &&
      !isAdditionalActivitiesNextMonthLoading
    ) {
      setProjectId(monthlyForm.projectId);
      setDefaultMonth(Number(monthlyForm.month));
      setCurrentYear(monthlyForm.year);

      const goalsList = outcomesFetched?.map((outcome: any, index: number) => ({
        id: outcome.id,
        goal: outcome.activityName,
        achieved: outcome.achieved,
        whyNotAchieved: outcome.reason,
        majorGoal: outcome.isMajorGoal,
        comments: outcome.comments,
      }));
      const additionalActivities = additionalActivitiesFetched?.map(
        (additionalActivity: any, index: number) => ({
          id: additionalActivity.id,
          activity: additionalActivity.activity,
          majorGoal: additionalActivity.isMajorGoal,
          functionalArea: additionalActivity.functionalAreaId,
          comments: additionalActivity.comments,
        })
      );
      const additionalActivitiesNextMonth =
        additionalActivitiesNextMonthFetched?.map(
          (additionalActivityNextMonth: any, index: number) => ({
            id: additionalActivityNextMonth.id,
            activity: additionalActivityNextMonth.activity,
            majorGoal: additionalActivityNextMonth.isMajorGoal,
            functionalArea: additionalActivityNextMonth.functionalAreaId,
            comments: additionalActivityNextMonth.comments,
          })
        );

      form.setFieldsValue({
        id: monthlyForm.id,
        project: monthlyForm.projectId,
        praisePoints: monthlyForm.praisePoints.map((point) => ({ point })), // Map each praise point to the form list structure
        prayerRequests: monthlyForm.prayerRequests.map((request) => ({
          request,
        })), // Map each prayer request to the form list structure
        storyTestimony: monthlyForm.story,
        concernsStruggles: monthlyForm.concerns,
        additionalActivitiesNextMonth: additionalActivitiesNextMonth,
        additionalActivities: additionalActivities,
        goalsList: goalsList,
        comments: monthlyForm.comments,
      });
      setIsFormReady(true); // Mark the form as ready after outcomes are fetched
    }
  }, [
    monthlyForm,
    isOutcomesLoading,
    outcomesFetched,
    isAdditionalActivitiesLoading,
    additionalActivitiesFetched,
    isAdditionalActivitiesNextMonthLoading,
    additionalActivitiesNextMonthFetched,
  ]);

  const handleSubmit = (values: any) => {
    const incompleteFields = values.goalsList.some(
      (goal: Goal) =>
        goal.achieved === undefined ||
        (goal.achieved === false && !goal.whyNotAchieved)
    );

    if (incompleteFields) {
      message.error(
        "All achieved fields must be filled, and reasons must be provided for goals not achieved."
      );
      return;
    }
    const formValues = form.getFieldsValue();
    const monthlyFormPayload = {
      id: formValues.id || undefined, // Optional, if editing an existing form
      projectId: formValues.project, // Maps to `projectId`
      month: formValues.month, // Maps to `month`
      year: formValues.year, // Maps to `year`
      status: "submitted", // Assuming "draft" is the status for saving as draft
      facilitator: loggedUser, // Maps to `facilitator`
      praisePoints:
        formValues.praisePoints?.map((point: { point: any }) => point.point) ||
        [], // Maps to `praisePoints`
      prayerRequests:
        formValues.prayerRequests?.map(
          (request: { request: any }) => request.request
        ) || [], // Maps to `prayerRequests`
      story: formValues.storyTestimony || "", // Maps to `story`
      concerns: formValues.concernsStruggles || "", // Maps to `concerns`
      comments: formValues.comments || "", // Assuming comments are not part of the form values
    };

    createMonthlyForm(monthlyFormPayload, formValues);
    router.push("/monthly-form/my-forms");
  };

  const handleAchievedChange = (value: any, index: number) => {
    const currentGoals = form.getFieldValue("goalsList");
    currentGoals[index].achieved = value;

    // If "No" is selected, we enable the 'whyNotAchieved' field
    form.setFieldsValue({
      goalsList: currentGoals,
    });
  };

  async function handleSaveAsDraft(): Promise<void> {
    const formValues = form.getFieldsValue();
    form.validateFields;
    console.log("Form values:", formValues);
    const monthlyFormPayload = {
      id: formValues.id || undefined, // Optional, if editing an existing form
      projectId: formValues.project, // Maps to `projectId`
      month: formValues.month, // Maps to `month`
      year: formValues.year, // Maps to `year`
      status: "draft", // Assuming "draft" is the status for saving as draft
      facilitator: loggedUser, // Maps to `facilitator`
      praisePoints:
        formValues.praisePoints?.map((point: { point: any }) => point.point) ||
        [], // Maps to `praisePoints`
      prayerRequests:
        formValues.prayerRequests?.map(
          (request: { request: any }) => request.request
        ) || [], // Maps to `prayerRequests`
      story: formValues.storyTestimony || "", // Maps to `story`
      concerns: formValues.concernsStruggles || "", // Maps to `concerns`
      comments: formValues.comments || "", // Assuming comments are not part of the form values
    };

    createMonthlyForm(monthlyFormPayload, formValues);
    messageApi.success("Monthly form successfully saved as draft");
  }

  async function approve(): Promise<void> {
    try {
      const response = await updateStatus({
        condition: true, // Replace with your actual condition
        monthlyFormId: monthlyForm?.id || "",
        status: "approved",
      });

      if (response) {
        messageApi.success("Monthly form successfully approved");
      }
    } catch (error) {
      console.error("Error approving monthly form:", error);
      messageApi.error("An error occurred while approving the monthly form.");
    }
  }

  async function reject(comment: string): Promise<void> {
    try {
      const response = await updateStatus({
        condition: true, // Replace with your actual condition
        monthlyFormId: monthlyForm?.id || "",
        status: "resent",
        comment: comment,
      });

      if (response) {
        messageApi.success("Monthly form successfully resent");
      }
    } catch (error) {
      console.error("Error approving monthly form:", error);
      messageApi.error("An error occurred while approving the monthly form.");
    }
  }

  const createMonthlyForm = async (
    monthlyFormPayload: any,
    formValues: any
  ) => {
    if (isAdditionalActivityDeleted && monthlyFormPayload.id) {
      await deleteAdditionalActivity(
        monthlyFormPayload.id,
        formValues.additionalActivities
      ).catch((error) => {
        console.error("Error deleting additional activity:", error);
        messageApi.error(
          "An error occurred while saving monthly form. Not fully updated"
        );
        throw new Error("Error deleting additional activity:.");
      });
    }

    if (isAdditionalActivityNextMonthDeleted && monthlyFormPayload.id) {
      await deleteAdditionalActivityNextMonth(
        monthlyFormPayload.id,
        formValues.additionalActivitiesNextMonth
      ).catch((error) => {
        console.error("Error deleting additional activity next month:", error);
        messageApi.error(
          "An error occurred while saving monthly form. Not fully updated"
        );
        throw new Error("Error deleting additional activity next month.");
      });
    }

    await saveMonthlyForm(monthlyFormPayload)
      .then(async (response) => {
        form.setFieldValue("id", response.id);

        if (response && response.id) {
          const outcomes =
            formValues.goalsList?.map(
              (
                goal: {
                  id: any;
                  whyNotAchieved: any;
                  achieved: any;
                  comments: any;
                  majorGoal: any;
                  goal: any;
                },
                index: string | number
              ) => {
                const correspondingGoal = !Array.isArray(plans)
                  ? plans.CurrentMonthGoals[index as number]
                  : undefined; // Match by index
                return {
                  id: goal.id || undefined, // Maps to `id`
                  monthlyFormId: response.id, // Maps to `monthlyFormId`
                  activityId: correspondingGoal?.id || "", // Take `id` from CurrentMonthGoals
                  reason: goal.whyNotAchieved || "", // Maps to `reason`
                  achieved: goal.achieved, // Maps to `achieved`
                  comments: goal.comments || "", // Maps to `comments`
                  majorGoal: goal.majorGoal, // Maps to `isMajorGoal`
                  goal: goal.goal || "", // Maps to `activity`
                };
              }
            ) || [];
          const additionalActivities =
            formValues.additionalActivities?.map(
              (activity: {
                id: any;
                activity: any;
                majorGoal: any;
                functionalArea: any;
                comments: any;
              }) => {
                return {
                  id: activity.id || undefined, // Maps to `id`
                  monthlyFormId: response.id, // Maps to `monthlyFormId`
                  activity: activity.activity || "", // Maps to `activity`
                  majorGoal: activity.majorGoal, // Maps to `majorGoal`
                  functionalArea: activity.functionalArea || "", // Maps to `functionalAreaId`
                  comments: activity.comments || "", // Maps to `comments`
                };
              }
            ) || [];
          const additionalActivitiesNextMonth =
            formValues.additionalActivitiesNextMonth?.map(
              (activity: {
                id: any;
                activity: any;
                majorGoal: any;
                functionalArea: any;
                comments: any;
              }) => {
                return {
                  id: activity.id || undefined, // Maps to `id`
                  monthlyFormId: response.id, // Maps to `monthlyFormId`
                  quarterlyPlanId: !Array.isArray(plans)
                    ? plans.nextMonthGoalsQuarterlyPlanId
                    : undefined,
                  month: formValues.month,
                  activity: activity.activity || "", // Maps to `activity`
                  majorGoal: activity.majorGoal, // Maps to `majorGoal`
                  functionalArea: activity.functionalArea || "", // Maps to `functionalAreaId`
                  comments: activity.comments || "", // Maps to `comments`
                };
              }
            ) || [];
          for (const outcomePayload of outcomes) {
            try {
              const outcomeResponse = await saveOutcome(outcomePayload);
              console.log("Outcome response:", outcomeResponse);
              console.log("outcome payload:", outcomePayload);
              if (outcomeResponse && outcomeResponse.id) {
                const goalIndex = outcomes.indexOf(outcomePayload);
                if (goalIndex !== -1) {
                  outcomes[goalIndex] = {
                    ...outcomePayload,
                    whyNotAchieved: outcomePayload.reason,
                    id: outcomeResponse.id,
                  }; // Update the ID with the response ID
                }
              }
            } catch (error) {
              console.error("Error saving individual outcome:", error);
              messageApi.error(
                "An error occurred while saving the monthly form."
              );
              throw new Error("Failed to save one or more outcomes.");
            }
          }
          form.setFieldsValue({
            goalsList: outcomes,
          });

          for (const additionalActivity of additionalActivities) {
            try {
              const additionalActivityResponse = await saveAdditionalActivity(
                additionalActivity
              );
              if (additionalActivityResponse && additionalActivityResponse.id) {
                const activityIndex =
                  additionalActivities.indexOf(additionalActivity);
                if (activityIndex !== -1) {
                  additionalActivities[activityIndex] = {
                    ...additionalActivity,
                    id: additionalActivityResponse.id, // Update the ID with the response ID
                  };
                }
              }
            } catch (error) {
              console.error("Error saving additional activity:", error);
              messageApi.error(
                "An error occurred while saving the monthly form."
              );
              throw new Error(
                "Failed to save one or more additional activity."
              );
            }
          }
          form.setFieldsValue({
            additionalActivities: additionalActivities,
          });

          for (const additionalActivityNextMonth of additionalActivitiesNextMonth) {
            try {
              const additionalActivityResponse =
                await saveAdditionalActivityNextMonth({
                  additionalActivityNextMonth: additionalActivityNextMonth,
                });
              if (additionalActivityResponse && additionalActivityResponse.id) {
                const activityIndex = additionalActivitiesNextMonth.indexOf(
                  additionalActivityNextMonth
                );
                if (activityIndex !== -1) {
                  additionalActivitiesNextMonth[activityIndex] = {
                    ...additionalActivityNextMonth,
                    id: additionalActivityResponse.id, // Update the ID with the response ID
                  };
                }
              }
            } catch (error) {
              console.error(
                "Error saving additional activity for next month:",
                error
              );
              messageApi.error(
                "An error occurred while saving the monthly form."
              );
              throw new Error(
                "Failed to save one or more additional activity for next month."
              );
            }
          }
          form.setFieldsValue({
            additionalActivitiesNextMonth: additionalActivitiesNextMonth,
          });
        } else {
          messageApi.error("Failed to save the monthly form.");
        }
      })
      .catch((error) => {
        console.error("Error saving monthly form:", error);
        messageApi.error("An error occurred while saving the monthly form.");
      });
  };

  if (!isFormReady && !loading && action !== "create") {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Spin size="large" />
        <p>Loading form data...</p>
      </div>
    );
  } else if (
    monthlyForm !== null &&
    monthlyForm.facilitator !== loggedUser &&
    action === "edit"
  ) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h3 style={{ color: "red" }}>
          You are not allowed to edit this monthly form.
        </h3>
      </div>
    );
  } else if (
    monthlyForm !== null &&
    monthlyForm.status !== "draft" &&
    monthlyForm.status !== "resent" &&
    action === "edit"
  ) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h3 style={{ color: "red" }}>
          You are not allowed to edit the monthly form unless it is in 'Draft'
          or 'Resent' status.
        </h3>
      </div>
    );
  } else if (
    monthlyForm !== null &&
    action === "approver-view" &&
    !clusters.includes(monthlyForm.clusterId)
  ) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h3 style={{ color: "red" }}>
          You are not allowed to view this monthly form.
        </h3>
      </div>
    );
  } else {
    return (
      <Form
        form={form}
        disabled={action === "view" || action === "approver-view"}
        onFinish={handleSubmit}
        layout="vertical"
      >
        {/* Hidden Form Item for ID */}
        <Form.Item name="id" hidden>
          <Input type="hidden" />
        </Form.Item>
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
                fetchAll={action === "approver-view" ? true : false}
                setLoading={setLoading}
                id={form.getFieldValue("project") ?? undefined}
                setSelectedProject={setProjectId}
                disabled={action !== "create"}
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
              <Col xs={24} sm={6}>
                <Form.Item label="Facilitator" name="facilitatorName">
                  <Input defaultValue={userName} disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={6}>
                <Form.Item label="Comments" name="comments">
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>

        {/* {isGoalsListEnabled && */}
        {!isPlanListloading &&
        projectId !== "" &&
        plans != null &&
        !isFunctionalAreaTypesDataLoading ? (
          errorMessage !== null ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <h3 style={{ color: "red" }}>{errorMessage}</h3>
            </div>
          ) : (
            <>
              <Collapse
                defaultActiveKey={["1", "2", "3", "4", "5", "6", "7", "8"]}
              >
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
                                <Form.Item
                                  name={[index, "id"]}
                                  initialValue={
                                    plans.CurrentMonthGoals[index].id
                                  }
                                  hidden
                                >
                                  <Input type="hidden" />
                                </Form.Item>
                                <Col xs={24} sm={4}>
                                  <Form.Item
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
                                        ]) !== false ||
                                        action === "view" ||
                                        action === "approver-view"
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col xs={24} sm={4}>
                                  <Form.Item
                                    name={[index, "majorGoal"]}
                                    initialValue={
                                      plans.CurrentMonthGoals[index]
                                        ?.isMajorGoal
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
                                    name={[index, "comments"]}
                                    initialValue={
                                      plans.CurrentMonthGoals[index]
                                        ?.comments ?? ""
                                    }
                                  >
                                    <Input placeholder="Add comments" />
                                  </Form.Item>
                                </Col>
                              </Row>
                            ))}
                      </>
                    )}
                  </Form.List>
                </Panel>

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
                        {fields.map((field, index) => (
                          <Row gutter={24} key={index}>
                            <Col span={1}>
                              <div>{index + 1}</div>
                            </Col>
                            <Form.Item name={[index, "id"]} hidden>
                              <Input type="hidden" />
                            </Form.Item>
                            <Col xs={24} sm={4}>
                              <Form.Item
                                name={[index, "activity"]}
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
                                name={[index, "functionalArea"]}
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
                                name={[index, "majorGoal"]}
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      "Please select whether it's a major goal or not",
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
                              <Form.Item name={[index, "comments"]}>
                                <Input placeholder="Add comments" />
                              </Form.Item>
                            </Col>
                            {action === "view" ||
                            action === "approver-view" ? null : (
                              <Col xs={24} sm={4}>
                                <DeleteTwoTone
                                  onClick={() => {
                                    setIsAdditionalActivityDeleted(true);
                                    remove(index);
                                  }}
                                  twoToneColor="#FF0000"
                                />
                              </Col>
                            )}
                          </Row>
                        ))}

                        {action === "view" ||
                        action === "approver-view" ? null : (
                          <Button type="dashed" onClick={() => add()} block>
                            Add additional activity
                          </Button>
                        )}
                      </>
                    )}
                  </Form.List>
                </Panel>

                <Panel header="Goals for next month" key="3">
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
                    {(fields, { add, remove }) => (
                      <>
                        {Array.isArray(plans)
                          ? null
                          : plans.NextMonthGoals.map((goal, index) => (
                              <Row gutter={24} key={index}>
                                <Col span={1}>
                                  <div>{index + 1}</div>
                                </Col>
                                <Form.Item
                                  name={[index, "id"]}
                                  initialValue={plans.NextMonthGoals[index].id}
                                  hidden
                                >
                                  <Input type="hidden" />
                                </Form.Item>
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
                                      plans.NextMonthGoals[index]
                                        .functionalAreaId
                                    }
                                  >
                                    <Select
                                      defaultValue={
                                        plans.NextMonthGoals[index]
                                          .functionalAreaId
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

                <Panel header="Additional goals for next month" key="4">
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
                        {fields.map((field, index) => (
                          <Row gutter={24} key={index}>
                            <Col span={1}>
                              <div>{index + 1}</div>
                            </Col>
                            <Form.Item name={[index, "id"]} hidden>
                              <Input type="hidden" />
                            </Form.Item>
                            <Col xs={24} sm={4}>
                              <Form.Item
                                name={[index, "activity"]}
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
                                name={[index, "functionalArea"]}
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
                                name={[index, "majorGoal"]}
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      "Please select whether it's a major goal or not",
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
                              <Form.Item name={[index, "comments"]}>
                                <Input placeholder="Add comments" />
                              </Form.Item>
                            </Col>
                            {action === "view" ||
                            action === "approver-view" ? null : (
                              <Col xs={24} sm={4}>
                                <DeleteTwoTone
                                  onClick={() => {
                                    setIsAdditionalActivityNextMonthDeleted(
                                      true
                                    );
                                    remove(index);
                                  }}
                                  twoToneColor="#FF0000"
                                />
                              </Col>
                            )}
                          </Row>
                        ))}

                        {action === "view" ||
                        action === "approver-view" ? null : (
                          <Button type="dashed" onClick={() => add()} block>
                            Add additional activity
                          </Button>
                        )}
                      </>
                    )}
                  </Form.List>
                </Panel>

                <Panel header="Praise points" key="5">
                  {/* Praise/Prayer Request Section */}
                  <Row gutter={24}>
                    <Col xs={24}>
                      <Form.Item label="Praise points" required>
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
                                          message:
                                            "Please input a praise point",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="Enter Praise Point" />
                                    </Form.Item>
                                  </Col>
                                  {action === "view" ||
                                  action === "approver-view" ? null : (
                                    <Col xs={4}>
                                      {fields.length > 1 && (
                                        <DeleteTwoTone
                                          onClick={() => remove(name)}
                                          twoToneColor="#FF0000"
                                        />
                                      )}
                                    </Col>
                                  )}
                                </Row>
                              ))}
                              <Form.Item>
                                {action === "view" ||
                                action === "approver-view" ? null : (
                                  <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                  >
                                    Add praise point
                                  </Button>
                                )}
                              </Form.Item>
                            </>
                          )}
                        </Form.List>
                      </Form.Item>
                    </Col>
                  </Row>
                </Panel>
                <Panel header="Prayer requests" key="6">
                  <Row gutter={24}>
                    <Col xs={24}>
                      <Form.Item label="Prayer requests" required>
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
                                  {action === "view" ||
                                  action === "approver-view" ? null : (
                                    <Col xs={4}>
                                      {fields.length > 1 && (
                                        <DeleteTwoTone
                                          onClick={() => remove(name)}
                                          twoToneColor="#FF0000"
                                        />
                                      )}
                                    </Col>
                                  )}
                                </Row>
                              ))}
                              <Form.Item>
                                {action === "view" ||
                                action === "approver-view" ? null : (
                                  <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                  >
                                    Add prayer request
                                  </Button>
                                )}
                              </Form.Item>
                            </>
                          )}
                        </Form.List>
                      </Form.Item>
                    </Col>
                  </Row>
                </Panel>

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
                          placeholder="Please enter your story or testimony."
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
                        label="Concerns/Struggles"
                        name="concernsStruggles"
                      >
                        <Input.TextArea
                          placeholder="Please enter your concerns or struggles."
                          rows={4}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Panel>
              </Collapse>

              {/* Footer Actions */}
              {action === "view" || action === "approver-view" ? null : (
                <Space style={{ marginTop: "24px" }}>
                  <Button type="default" href="/monthly-form/my-forms">
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    // htmlType="submit"
                    onClick={handleSaveAsDraft}
                  >
                    Save as draft
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Space>
              )}
              {action !== "approver-view" ? null : (
                <Space style={{ marginTop: "24px" }}>
                  <Button
                    type="default"
                    disabled={false}
                    onClick={() => router.push("/monthly-form/approver-view")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    disabled={false}
                    onClick={async () => {
                      await approve();
                      router.push("/monthly-form/approver-view");
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    type="primary"
                    disabled={false}
                    onClick={() => {
                      Modal.confirm({
                        title: "Resend Monthly Form",
                        content: (
                          <Input.TextArea
                            placeholder="Please provide a comment for resending"
                            rows={4}
                            id="resend-comment"
                          />
                        ),
                        onOk: async () => {
                          const comment = (
                            document.getElementById(
                              "resend-comment"
                            ) as HTMLTextAreaElement
                          )?.value;
                          if (comment) {
                            await reject(comment);
                            router.push("/monthly-form/approver-view");
                          } else {
                            messageApi.warning(
                              "Resend action canceled. Comment is required."
                            );
                          }
                        },
                        onCancel: () => {
                          messageApi.info("Resend action canceled.");
                        },
                      });
                    }}
                  >
                    Resend
                  </Button>
                </Space>
              )}
            </>
          )
        ) : projectId === "" && !loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h3 style={{ color: "red" }}>
              Please select the project to continue.
            </h3>
          </div>
        ) : (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spin size="large" />
            <p>Loading form data...</p>
          </div>
        )}
      </Form>
    );
  }
};

export default CreateMonthlyFormForm;
