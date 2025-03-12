// "use client"
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  CollapseProps,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Spin,
} from "antd";
import Projects from "./Projects";
import FunctionalArea from "./FunctionalArea";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import QuarterlyPlan from "./QuarterlyPlan";
import { useState, useEffect, useRef } from "react";
import { DeleteTwoTone } from "@ant-design/icons";
import useCreateYearlyPlan from "../api/create-yearly-form";
import useCreateQuarterlyPlan from "../api/create-quarter-plan";
import useCreatePlan from "../api/create-plan";
import { useRouter, usePathname } from "next/navigation";
import useQuarterlyPlanList from "@/entities/yearly-form/api/quarterlyplan-list";
import useYearlyPlanFullDetails from "@/entities/yearly-form/api/yearlyplan-full";
import useUpdateYearlyPlan from "../api/update-yearly-form";
import useUpdateQuarterlyPlan from "../api/update-quarter-plan";
import useUpdatePlan from "../api/update-plan";
import useDeletePlan from "@/feature/delete-plan/delete-plan";
import useDeleteYearlyForm from "../../delete-yearly-form/delete-yearly-form";
import CommentModal from "@/shared/ui/comment/CommentModal";
import { AuthUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";
import { ExportYearlyPlan } from "@/feature/export-yealy-plan";
import useProjectsDetails from "@/entities/project/api/project-details";

const { Panel } = Collapse;

interface CreateYearlyFormNewProps {
  // onCreateYearlyFormNewModalClose: () => void;
  id: string | undefined;
  type: string;
  messageApi: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
  setyearlyPlanDetails?: (
    yearlyPlanDetails: YearlyPlanDetails | undefined
  ) => void;
}

interface PlanDetails {
  id: string;
  quarterlyPlanId: string;
  activity: string;
  month: string[];
  functionalAreaId: string;
  department?: string;
  comments?: string;
  isMajorGoal: boolean;
}

interface QuarterlyPlanDetails {
  id: string;
  yearlyPlanId: string;
  status?: string;
  reviewedBy?: string;
  approvedBy?: string;
  plans: PlanDetails[];
}

interface YearlyPlanDetails {
  id: string;
  user: string;
  userId: string;
  projectId?: string;
  comments?: string;
  status?: string;
  year?: string;
  reviewedBy?: string;
  approvedBy?: string;
  quarterlyPlans: Record<number, QuarterlyPlanDetails>; // Change: Key is quarter number
}

interface FormValues {
  // year: string;
  project: string | undefined;
}
interface CustomError {
  statusCode: number;
  message: string;
}

export default function CreateYearlyFormNew({
  messageApi,
  id,
  type,
  setyearlyPlanDetails,
}: CreateYearlyFormNewProps) {
  const { createYearlyPlan, isCreatingYearlyPlan } = useCreateYearlyPlan();
  const { createQuarterlyPlan, isCreatingQuarterlyPlan } =
    useCreateQuarterlyPlan();
  const { createPlan, isCreatingPlan } = useCreatePlan();
  const { updateYearlyPlan, isUpdatingYearlyPlan } = useUpdateYearlyPlan();
  const { updateQuarterlyPlan, isUpdatingQuarterlyPlan } =
    useUpdateQuarterlyPlan();
  const { updatePlan, isUpdatingPlan } = useUpdatePlan();
  const { deletePlan, isDeleting } = useDeletePlan();
  const [quarterPlans, setQuarterPlans] = useState<
    Record<number, QuarterlyPlanDetails>
  >({});
  const [plansToDelete, setPlansToDelete] = useState<string[]>([]);
  let currentYear: number = new Date().getFullYear();
  let nextYear: number = currentYear + 1;
  const [form] = Form.useForm();
  const { Option } = Select;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState("");
  const [projectFacilitator, setProjectFacilitator] = useState("");
  const [loggedUser, setLoggedUser] = useState("");
  const client = generateClient<Schema>();
  // const [isDirty, setIsDirty] = useState(false);
  const isDirty = useRef(false);
  const pathname = usePathname();
  const [originalPush, setOriginalPush] = useState<
    ((href: string) => void) | null
  >(null);
  // const [draftSaved, setDraftSaved] = useState("");
  const [draftSaved, setDraftSaved] = useState<string | undefined>(undefined);


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
      label: "Apr - Jun",
      // children: <QuarterlyPlan form={form} quarter={1}/>,
    },
    {
      key: 2,
      label: "Jul - Sep",
      // children: <QuarterlyPlan form={form} quarter={1}/>,
    },
    {
      key: 3,
      label: "Oct - Dec",
      // children: <QuarterlyPlan form={form} quarter={1}/>,
    },
    {
      key: 4,
      label: "Jan - Mar",
      // children: <QuarterlyPlan form={form} quarter={1}/>,
    },
  ];

  const resolvedId = draftSaved || id;
  const {
    yearlyPlanDetail,
    isYearlyPlanDetailLoading,
    isYearlyPlanDetailError,
  } = useYearlyPlanFullDetails({ condition: !!resolvedId }, resolvedId);

  if (yearlyPlanDetail && setyearlyPlanDetails) {
    setyearlyPlanDetails(yearlyPlanDetail);
  }

  const getFutureQuarter = () => {
    const month = new Date().getMonth() + 1;

    if (month >= 1 && month <= 3) return 1;
    if (month >= 4 && month <= 6) return 2;
    if (month >= 7 && month <= 9) return 3;
    return 4;
  };
  useEffect(() => {
    if (!id) {
      setUserDetails();
      setLoggedUserDetails();
    }
    if ((id || draftSaved) && yearlyPlanDetail) {
      // console.log("yearlyPlanDetail inside useEffect", yearlyPlanDetail);
      setLoggedUserDetails();
      setProjectFacilitator(yearlyPlanDetail.user);
      form.setFieldsValue({
        year: yearlyPlanDetail.year,
        project: yearlyPlanDetail.projectId,
      });
      const mappedQuarterPlans: Record<number, QuarterlyPlanDetails> = {};
      Object.entries(yearlyPlanDetail.quarterlyPlans).forEach(
        ([key, quarterData]) => {
          const quarterKey = Number(key); // Convert key to number

          // Store the entire quarterly plan object, ensuring `plans` is an array
          mappedQuarterPlans[quarterKey] = {
            id: quarterData.id,
            yearlyPlanId: quarterData.yearlyPlanId,
            status: quarterData.status,
            reviewedBy: quarterData.reviewedBy,
            approvedBy: quarterData.approvedBy,
            plans: quarterData.plans.map((plan) => ({
              id: plan.id,
              quarterlyPlanId: plan.quarterlyPlanId,
              activity: plan.activity,
              month: plan.month,
              functionalAreaId: plan.functionalAreaId,
              comments: plan.comments,
              isMajorGoal: plan.isMajorGoal,
            })),
          };
        }
      );

      // Update state
      setQuarterPlans(mappedQuarterPlans);
      setDraftSaved(undefined);
    }
  }, [yearlyPlanDetail]);
  useEffect(() => {
    // Warn user before closing or reloading the page
    const handleWindowClose = (event: BeforeUnloadEvent) => {
      if (isDirty.current) {
        event.preventDefault();
        event.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleWindowClose);

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
    };
  }, [isDirty.current]);
  // useEffect(() => {
  //   // Override router.push

  //   if (!originalPush) {
  //     console.log("Inside originalPsuh")
  //     setOriginalPush(() => router.push);
  //     router.push = (href: string) => handleInterceptedNavigation(href);
  //   }

  //   return () => {
  //     if (originalPush) {
  //       router.push = originalPush; // Restore original push function on unmount
  //     }
  //   };
  // }, [router, originalPush, isDirty]);

  // const handleInterceptedNavigation = (href: string) => {
  //   if (isDirty.current) {
  //     const confirmLeave = window.confirm("You have unsaved changes. Do you really want to leave?");
  //     if (!confirmLeave) return; // Stop navigation if user cancels
  //   }
  //   console.log("Proceed with navigation", href)
  //   originalPush?.(href); // Proceed with navigation if confirmed
  //   console.log("Proceed after roginalPush")
  // };

  useEffect(() => {
    const originalPush = router.push; // Capture original push method

    router.push = (href: string) =>
      handleInterceptedNavigation(href, originalPush);

    return () => {
      router.push = originalPush; // Restore original push when unmounting
    };
  }, []);

  const handleInterceptedNavigation = (
    href: string,
    originalPush: (url: string) => void
  ) => {
    if (isDirty.current) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Do you really want to leave?"
      );
      if (!confirmLeave) return;
    }

    originalPush(href);
  };
  const showCommentPrompt = (status: string) => {
    setStatus(status);
    if (status != "draft") {
      setModalVisible(true);
    } else {
      handleSave("draft", "");
    }
  };

  const setUserDetails = async () => {
    const attributes = await fetchUserAttributes();
    setProjectFacilitator(
      attributes["given_name"] + " " + attributes["family_name"]
    );
  };

  const setLoggedUserDetails = async () => {
    const { username, userId, signInDetails } = await getCurrentUser();
    setLoggedUser(userId);
  };

  const handleSave = async (status: string, comment: string) => {
    try {
      if (!form.getFieldValue("project"))
        messageApi.error("Please select the project");
      else {
        for (const quarter of [1, 2, 3, 4]) {
          const quarterlyPlanData = quarterPlans[quarter];
          console.log("quarterlyPlanData", quarterlyPlanData);
          if (quarterlyPlanData) {
            for (const plan of quarterlyPlanData.plans) {
              if (!plan.activity)
                throw {
                  statusCode: 400,
                  message: "Activity is required",
                } as CustomError;
              else if (!plan.functionalAreaId)
                throw {
                  statusCode: 400,
                  message: "Function area is required",
                } as CustomError;
              else if (!(plan.month.length > 0))
                throw {
                  statusCode: 400,
                  message: "Month is required",
                } as CustomError;
            }
          } else {
            if (status === "waiting for review")
              throw {
                statusCode: 400,
                message: "Please add plans for all quarter",
              } as CustomError;
          }
        }
        setLoading(true);
        const { username, userId, signInDetails } = await getCurrentUser();

        const formValues = form.getFieldsValue();
        let yearlyPlanResp;
        const yearlyPlanPayload = {
          user: yearlyPlanDetail?.user ?? projectFacilitator,
          userId: yearlyPlanDetail?.userId ?? userId,
          projectId: formValues.project,
          ...(comment && "" != comment && { comments: comment }),
          status: status,
          year: formValues.year,
          ...(yearlyPlanDetail?.id &&
            yearlyPlanDetail?.id !== "" && { id: yearlyPlanDetail.id }),
        };
        try {
          if (
            (yearlyPlanDetail?.id && "" != yearlyPlanDetail?.id) ||
            (draftSaved != "" && draftSaved != undefined)
          ) {
            yearlyPlanPayload.id =
              yearlyPlanDetail?.id && yearlyPlanDetail?.id !== ""
                ? yearlyPlanDetail.id
                : draftSaved;
            yearlyPlanResp = await updateYearlyPlan(yearlyPlanPayload);
          } else {
            yearlyPlanResp = await createYearlyPlan(yearlyPlanPayload);
          }

        } catch (error: any) {
          throw error;
        }

        if (yearlyPlanResp) {
          for (const quarter of [1, 2, 3, 4]) {
            const quarterlyPlanData = quarterPlans[quarter];

            const quarterlyPlanPayload = {
              // id: quarterlyPlanData.id || undefined,
              yearlyPlanId: yearlyPlanResp.id,
              quarter: quarter,
              status: status,
              ...(quarterlyPlanData?.id &&
                quarterlyPlanData?.id !== "" && { id: quarterlyPlanData.id }),
            };

            let quarterPlanResp;
            if (quarterlyPlanData?.id) {
              quarterPlanResp = await updateQuarterlyPlan(
                quarterlyPlanPayload
              );
            } else {
              quarterPlanResp = await createQuarterlyPlan(
                quarterlyPlanPayload
              );
            }
            if (quarterlyPlanData) {

              if (quarterPlanResp) {
                for (const plan of quarterlyPlanData.plans) {
                  const planPayload = {
                    quarterlyPlanId: quarterPlanResp.id,
                    activity: plan.activity,
                    month: plan.month,
                    functionalAreaId: plan.functionalAreaId,
                    department: plan.department ?? "",
                    comments: plan.comments ?? "",
                    isMajorGoal: plan.isMajorGoal ?? false,
                    ...(plan?.id && plan?.id !== "" && { id: plan.id }),
                  };
                  let planResp;
                  if (plan.id) {
                    planResp = await updatePlan(planPayload);
                  } else {
                    planResp = await createPlan(planPayload);
                  }
                }
              }
            }
          }
          if (type === "createNew" && status === "draft") {
            setDraftSaved(yearlyPlanResp?.id);
          }
        }
        // }
        if (plansToDelete.length > 0) {
          deletePlan({ ids: plansToDelete });
        }
        isDirty.current = false;
        setLoading(false);
        if (status === "waiting for review") {
          await messageApi.success("Yearly Plan submitted for review.");
        } else if (status === "draft") {
          await messageApi.success("Yearly Plan saved as draft.");
        } else if (status === "waiting for approval") {
          await messageApi.success("Yearly Plan submitted for approval.");
        } else if (status === "approved") {
          await messageApi.success("Yearly Plan approved successfully.");
        } else if (status === "resent") {
          await messageApi.success("Yearly Plan has been resent.");
        }
        // if (
        //   (type === "myforms" || type === "createNew") &&
        //   status !== "draft"
        // ) {
        //   router.push("/yearly-form/my-forms");
        // }
        if (
          type === "myforms" || type === "createNew") {
          router.push("/yearly-form/my-forms");
        }
        else if (type === "approver") {
          router.push("/yearly-form/approver-view");
        } else if (type === "reviewer") {
          router.push("/yearly-form/reviewer-view");
        }
      }
    } catch (error: any) {
      console.error("Error saving data:", error);
      if (error?.statusCode === 409) {
        messageApi.error(error.message);
      } else if (error?.statusCode === 400) {
        messageApi.error(error.message);
      } else {
        messageApi.error(
          "Unable to create/update the project. Please try again."
        );
      }
      // messageApi.error("Failed to save data.");
    } finally {
      setLoading(false);
      isDirty.current = false;
    }
  };

  const handlePlanChange = (
    quarter: number,
    index: number,
    field: string,
    value: any
  ) => {
    if (!form.getFieldValue("project"))
      messageApi.error("Please select the project");
    else {
      handleFormChange();
      setQuarterPlans((prev) => ({
        ...prev,
        [quarter]: {
          ...prev[quarter],
          plans: prev[quarter]?.plans.map((plan, i) =>
            i === index ? { ...plan, [field]: value } : plan
          ),
        },
      }));
    }
  };

  const handleDeletePlan = (quarter: number, index: number) => {
    setQuarterPlans((prev) => {
      const updatedQuarterPlans = { ...prev };

      if (updatedQuarterPlans[quarter] && updatedQuarterPlans[quarter].plans) {
        const planToDelete = updatedQuarterPlans[quarter].plans[index]?.id;

        if (planToDelete) {
          setPlansToDelete((prevIds) => [...prevIds, planToDelete]);
        }
        // Filter out the plan at the specified index
        updatedQuarterPlans[quarter] = {
          ...updatedQuarterPlans[quarter],
          plans: updatedQuarterPlans[quarter].plans.filter(
            (_, i) => i !== index
          ),
        };
      }

      return updatedQuarterPlans;
    });
  };

  // const handleDeletePlan = (quarter: number, index: number) => {
  //   setQuarterPlans((prev) => {
  //     const updatedQuarter = prev[quarter] || [];
  //     updatedQuarter.splice(index, 1);
  //     return { ...prev, [quarter]: updatedQuarter };
  //   });
  // };

  const handleAddPlan = (quarter: number) => {
    if (!form.getFieldValue("project"))
      messageApi.error("Please select the project");
    else {
      checkProjectExist(form.getFieldValue("project"), loggedUser);
      setQuarterPlans((prev) => ({
        ...prev,
        [quarter]: {
          ...prev[quarter],
          plans: [
            ...(prev[quarter]?.plans || []),
            {
              activity: "",
              month: [],
              functionalAreaId: "",
              department: "",
              comments: "",
            } as any,
          ],
        },
      }));
    }
  };
  // };

  const checkProjectExist = async (projectId: string, userId: string) => {
    const existingPlan = await client.models.YearlyPlan.list({
      filter: {
        and: [{ projectId: { eq: projectId } }, { userId: { eq: userId } }],
      },
    });
    if (existingPlan?.data.length > 0 && !yearlyPlanDetail && !id && !draftSaved) {
      messageApi.error("The yearly plan for this project already exist");
      // throw { statusCode: 409, message: "The yearly plan for this project already exist" } as CustomError;
    }
  };

  const handleFormChange = () => {
    // setIsDirty(true);
    isDirty.current = true;
  };

  return (
    <div>
      <CommentModal
        status={status}
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />
      {/* <h1>Yearly Planning</h1> */}
      <Form
        form={form}
        onChange={handleFormChange}
        layout="horizontal"
        disabled={
          (type !== "createNew" && type !== "myforms") ||
          (type === "myforms" &&
            yearlyPlanDetail?.status != "draft" &&
            yearlyPlanDetail?.status != "resent" &&
            yearlyPlanDetail?.status != "approved") ||
          (yearlyPlanDetail?.userId
            ? yearlyPlanDetail.userId !== loggedUser
            : false)
        }
        initialValues={{
          year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
          project: "",
        }}
      >
        <Row gutter={24}>
          <Col xs={8}>
            <Form.Item
              label="Project"
              name="project"
              rules={[{ required: true, message: "Project is required" }]}
            >
              <Projects
                form={form}
                fetchAll={
                  (type !== "createNew" && type !== "myforms") ||
                  (type === "myforms" &&
                    yearlyPlanDetail?.status != "draft" &&
                    yearlyPlanDetail?.status != "resent" &&
                    yearlyPlanDetail?.status != "approved") ||
                  (yearlyPlanDetail?.userId
                    ? yearlyPlanDetail.userId !== loggedUser
                    : false)
                }
                setLoading={setLoading}
                id={form.getFieldValue("project") ?? undefined}
              />
            </Form.Item>
          </Col>
          <Col xs={8}>
            <Form.Item label="Project Facilitator">
              <Input disabled value={projectFacilitator} />
            </Form.Item>
          </Col>
          <Col xs={8}>
            <Form.Item label="Year" name="year">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} style={{ padding: "10px" }}>
          <Col xs={8}>
            {yearlyPlanDetail?.comments && (
              <div
                style={{
                  padding: "7px 7px 7px 0px",
                  borderRadius: "5px",
                }}
              >
                Comments:{" "}
                <span
                  style={{
                    background:
                      yearlyPlanDetail.status === "resent"
                        ? "#ffccc7"
                        : "#f0f2f5",
                    padding: "3px 5px",
                    borderRadius: "3px",
                  }}
                >
                  {yearlyPlanDetail.comments}
                </span>
              </div>
            )}
          </Col>
        </Row>
        <>
          {isYearlyPlanDetailLoading || loading ? (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.7)",
                zIndex: 9999,
              }}
            >
              <Spin size="large" />
            </div>
          ) : (
            // <Collapse>  {/* defaultActiveKey={getFutureQuarter()} */}
            <Collapse>
              {items.map((quarter) => (
                <Panel header={`${quarter.label}`} key={quarter.key}>
                  <Row gutter={24}>
                    <Col span={1}>Sl. No</Col>
                    <Col span={5}>
                      Activity <span style={{ color: "red" }}>*</span>
                    </Col>
                    <Col span={4}>
                      Functional Area <span style={{ color: "red" }}>*</span>
                    </Col>
                    <Col span={3}>
                      Months <span style={{ color: "red" }}>*</span>
                    </Col>
                    <Col span={3}>Major Goal</Col>
                    <Col span={6}>Comments</Col>
                    <Col span={2}></Col>
                  </Row>
                  <Divider></Divider>
                  {quarterPlans[quarter.key]?.plans?.map((plan, index) => (
                    // <div key={index} style={{ marginBottom: 16, display: "flex" }}>
                    <Row gutter={24}>
                      <Col span={1}>
                        <div>{index + 1}</div>
                      </Col>
                      <Col span={5}>
                        <Form.Item>
                          <Input
                            value={plan.activity || ""}
                            onChange={(e) =>
                              handlePlanChange(
                                quarter.key,
                                index,
                                "activity",
                                e.target.value
                              )
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item>
                          <FunctionalArea
                            handlePlanChange={handlePlanChange}
                            quarterKey={quarter.key}
                            index={index}
                            functionalAreaId={plan.functionalAreaId}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item>
                          <Select
                            mode="multiple"
                            value={plan.month || []}
                            onChange={(value) =>
                              handlePlanChange(
                                quarter.key,
                                index,
                                "month",
                                value
                              )
                            }
                          >
                            {monthsArray
                              .slice((quarter.key - 1) * 3, quarter.key * 3)
                              .map((month) => (
                                <Option key={month} value={month}>
                                  {month}
                                </Option>
                              ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item>
                          <Checkbox
                            checked={plan.isMajorGoal || false}
                            onChange={(e) =>
                              handlePlanChange(
                                quarter.key,
                                index,
                                "isMajorGoal",
                                e.target.checked
                              )
                            }
                          ></Checkbox>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item>
                          <Input
                            value={plan.comments || ""}
                            onChange={(e) =>
                              handlePlanChange(
                                quarter.key,
                                index,
                                "comments",
                                e.target.value
                              )
                            }
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
                        {(type === "createNew" ||
                          (type === "myforms" &&
                            yearlyPlanDetail?.status === "draft") ||
                          yearlyPlanDetail?.status === "resent" ||
                          yearlyPlanDetail?.status === "approved") &&
                          (yearlyPlanDetail?.userId
                            ? yearlyPlanDetail.userId === loggedUser
                            : true) && (
                            <DeleteTwoTone
                              onClick={() =>
                                handleDeletePlan(quarter.key, index)
                              }
                              twoToneColor="#FF0000"
                            />
                          )}
                        {/* </Button> */}
                      </Col>
                    </Row>
                    // </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => handleAddPlan(quarter.key)}
                    block
                  >
                    Add Planned Activities
                  </Button>
                </Panel>
              ))}
            </Collapse>
          )}
        </>

        <Form.Item style={{ marginTop: 24 }}>
          <Space>
            {(type === "myforms" || type === "createNew") && (
              <>
                <Button
                  type="primary"
                  disabled={
                    (type !== "createNew" &&
                      yearlyPlanDetail?.status !== "draft" &&
                      yearlyPlanDetail?.status !== "resent" &&
                      yearlyPlanDetail?.status !== "approved") ||
                    false ||
                    (yearlyPlanDetail?.userId
                      ? yearlyPlanDetail.userId !== loggedUser
                      : false)
                  }
                  onClick={() => showCommentPrompt("draft")}
                >
                  Save as Draft
                </Button>
                <Button
                  type="primary"
                  disabled={
                    (type !== "createNew" &&
                      yearlyPlanDetail?.status !== "draft" &&
                      yearlyPlanDetail?.status !== "resent" &&
                      yearlyPlanDetail?.status !== "approved") ||
                    false ||
                    (yearlyPlanDetail?.userId
                      ? yearlyPlanDetail.userId !== loggedUser
                      : false)
                  }
                  onClick={() => showCommentPrompt("waiting for review")}
                >
                  Send for Review
                </Button>
              </>
            )}

            {type === "reviewer" && (
              <>
                <Button
                  type="primary"
                  disabled={false}
                  onClick={() => showCommentPrompt("waiting for approval")}
                >
                  Send for Approval
                </Button>
                <Button
                  type="default"
                  disabled={false}
                  danger
                  onClick={() => showCommentPrompt("resent")}
                >
                  Resend
                </Button>
              </>
            )}

            {type === "approver" && (
              <>
                <Button
                  type="primary"
                  disabled={false}
                  onClick={() => showCommentPrompt("approved")}
                >
                  Approve
                </Button>
                <Button
                  type="default"
                  disabled={false}
                  danger
                  onClick={() => showCommentPrompt("resent")}
                >
                  Resend
                </Button>
              </>
            )}
            <Button
              type="primary"
              disabled={false}
              onClick={() => {
                if (type === "myforms") {
                  router.push("/yearly-form/my-forms");
                } else if (type === "approver") {
                  router.push("/yearly-form/approver-view");
                } else if (type === "reviewer") {
                  router.push("/yearly-form/reviewer-view");
                } else {
                  router.push("/yearly-form/my-forms"); // Default fallback
                }
              }}
            >
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}

// export default CreateYearlyFormNew;
