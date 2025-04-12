import { Button, Col, Form, Input, Row, Space, Upload } from "antd";
import useParameters from "@/entities/parameters/api/parameters-list";
import useCreateParameters from "../api/create-parameters";

interface CreateParametersFormProps {
  messageApi: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

interface FormValues {
  monthlyFormStartDate: string;
  quarterlyPlanResetDate: string;
}

const CreateParametersForm: React.FC<CreateParametersFormProps> = ({
  messageApi,
}) => {
  const [form] = Form.useForm<FormValues>();

  const { reloadParametersList } = useParameters({ condition: true });
  const { createParameters, isCreating } = useCreateParameters();

  const handleFinish = async (values: FormValues) => {
    const payload = {
      ...values,
    };

    try {
      const data = await createParameters(payload);
      if (data) {
        messageApi.success("Parameters have been added successfully.");
        reloadParametersList();
      }
    } catch (error) {
      messageApi.error("Unable to add the parameters. Please try again.");
    }
  };

  const validateDayNotGreaterThan28 = (_: any, value: string) => {
    const day = parseInt(value, 10);
    if (day > 28) {
      return Promise.reject(new Error("The date cannot be greater than 28."));
    }
    return Promise.resolve();
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

  return (
    <Form form={form} onFinish={handleFinish}>
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
                message: "Please enter the reset date for the quarterly plan.",
              },
              {
                validator: validateDayNotGreaterThan28,
              },
            ]
          )}
        </Col>
      </Row>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Space>
          <Button type="default" onClick={() => form.resetFields()}>
            Reset
          </Button>
          <Button type="primary" htmlType="submit" loading={isCreating}>
            Save
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default CreateParametersForm;
