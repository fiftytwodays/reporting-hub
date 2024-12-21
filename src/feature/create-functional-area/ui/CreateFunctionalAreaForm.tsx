import useFunctionalAreasList from "@/entities/functional-area/api/functional-areas-list";
import { Button, Col, Flex, Form, Input, Row, Space } from "antd";
import useCreateFunctionalArea from "../api/create-functional-area";

interface CreateFunctionalAreaFormProps {
  onCreateFunctionalAreaModalClose: () => void;
  messageApi: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

interface FormValues {
  functionalAreaName: string;
  functionalAreaDescription?: string;
}

const CreateFunctionalAreaForm: React.FC<CreateFunctionalAreaFormProps> = ({
  onCreateFunctionalAreaModalClose,
  messageApi,
}) => {
  const [form] = Form.useForm<FormValues>();

  const { reloadFunctionalAreasList } = useFunctionalAreasList({condition: true});

  const { createFunctionalArea, isCreating } = useCreateFunctionalArea();

  const handleFinish = async (values: FormValues) => {
    const payload = {
      name: values.functionalAreaName,
      description: values.functionalAreaDescription,
    };

    try {
      const data = await createFunctionalArea(payload);
      if (data) {
        messageApi.success("Functional area has been created successfully.");
        reloadFunctionalAreasList();
        onCreateFunctionalAreaModalClose();
        form.resetFields();
      }
    } catch (error: any) {
      if (error?.status === 409) {
        messageApi.error(
          "Functional area name already in use. Please try again with a different name."
        );
      } else {
        messageApi.error("Unable to create the functional area. Please try again.");
      }
    }
  };

  return (
    <Form form={form} onFinish={handleFinish}>
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Functional area"
            name="functionalAreaName"
            rules={[{ required: true, message: "Functional area name is required" }]}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input />
          </Form.Item>
        </Col>
        </Row>
      <Row>
        <Col xs={24} sm={24}>
          <Form.Item
            label="Description"
            name="functionalAreaDescription"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input.TextArea />
          </Form.Item>
        </Col>
      </Row>

      <Flex justify="space-between">
        <Button type="default" onClick={() => form.resetFields()}>
          Reset
        </Button>
        <Space>
          <Button onClick={onCreateFunctionalAreaModalClose} type="default">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreating}
          >
            Save
          </Button>
        </Space>
      </Flex>
    </Form>
  );
};

export default CreateFunctionalAreaForm;
