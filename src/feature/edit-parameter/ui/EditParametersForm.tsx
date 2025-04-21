import useParameters from "@/entities/parameters/api/parameters-list";
import { Button, Col, Form, Input, Row, Skeleton, Space } from "antd";
import useUpdateParameters from "../api/update-parameters";
import { Parameters } from "@/entities/parameters/config/types";

interface EditParameterFormProps {
  setIsEditing: (status: boolean) => void;
  isEditing: boolean;
  isLoading: boolean;
  parameters: Parameters;
  messageApi: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

interface FormValues {
  monthlyFormStartDate: string;
  quarterlyPlanResetDate: string;
  startYear: string; // Added startYear property
}

const EditParametersForm: React.FC<EditParameterFormProps> = ({
  setIsEditing,
  isEditing,
  isLoading,
  parameters,
  messageApi,
}) => {
  const [form] = Form.useForm<FormValues>();

  const { reloadParametersList } = useParameters({ condition: true });
  const { updateParameters, isUpdating } = useUpdateParameters();

  const validateDayNotGreaterThan28 = (_: any, value: string) => {
    const day = parseInt(value, 10);
    if (day > 28) {
      return Promise.reject(new Error("The date cannot be greater than 28."));
    }
    return Promise.resolve();
  };

  const handleFinish = async (values: FormValues) => {
    const payload = {
      ...values,
      id: parameters.id,
    };
    try {
      const data = await updateParameters(payload);
      if (data) {
        messageApi.success("Parameters has been updated successfully.");
        reloadParametersList();
        form.resetFields();
        setIsEditing(false);
      }
    } catch (error) {
      messageApi.error("Unable to update the parameters. Please try again.");
    }
  };

  const renderTextField = (
    label: string,
    name: keyof FormValues,
    rules: any[] = []
  ) => (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input />
    </Form.Item>
  );

  const renderTextAreaField = (label: string, name: keyof FormValues) => (
    <Form.Item
      label={label}
      name={name}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input.TextArea />
    </Form.Item>
  );

  return (
    <Skeleton loading={isLoading}>
      <Form
        disabled={!isEditing}
        form={form}
        initialValues={parameters}
        onFinish={handleFinish}
        onAbort={() => {
          form.resetFields();
        }}
      >
        <Row gutter={24}>
          <Col xs={24} sm={6}>
            {renderTextField(
              "Start date for monthly form submission",
              "monthlyFormStartDate",
              [
                {
                  required: true,
                  message:
                    "Please enter the start date for monthly form submission.",
                },
                {
                  validator: validateDayNotGreaterThan28,
                },
              ]
            )}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={6}>
            {renderTextField(
              "Date to reset quarterly plan status to draft",
              "quarterlyPlanResetDate",
              [
                {
                  required: true,
                  message:
                    "Please enter the reset date for the quarterly plan.",
                },
                {
                  validator: validateDayNotGreaterThan28,
                },
              ]
            )}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={6}>
            {renderTextField("Start year", "startYear", [
              {
                required: true,
                message: "Please enter the start year.",
              },
            ])}
          </Col>
        </Row>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            type="default"
            onClick={() => {
              form.resetFields();
            }}
          >
            Reset
          </Button>
          <Space>
            <Button
              type="default"
              onClick={() => {
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              Save
            </Button>
          </Space>
        </div>
      </Form>
    </Skeleton>
  );
};

export default EditParametersForm;
