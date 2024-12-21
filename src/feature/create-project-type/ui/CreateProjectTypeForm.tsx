import useProjectTypesList from "@/entities/project-type/api/project-types-list";
import { Button, Col, Flex, Form, Input, Row, Space } from "antd";
import useCreateProjectType from "../api/create-project-type";

interface CreateProjectTypeFormProps {
  onCreateProjectTypeModalClose: () => void;
  messageApi: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

interface FormValues {
  projectTypeName: string;
  projectTypeDescription?: string;
}

const CreateProjectTypeForm: React.FC<CreateProjectTypeFormProps> = ({
  onCreateProjectTypeModalClose,
  messageApi,
}) => {
  const [form] = Form.useForm<FormValues>();

  const { reloadProjectTypesList } = useProjectTypesList({condition: true});

  const { createProjectType, isCreating } = useCreateProjectType();

  const handleFinish = async (values: FormValues) => {
    const payload = {
      name: values.projectTypeName,
      description: values.projectTypeDescription,
    };

    try {
      const data = await createProjectType(payload);
      if (data) {
        messageApi.success("Project type has been created successfully.");
        reloadProjectTypesList();
        onCreateProjectTypeModalClose();
        form.resetFields();
      }
    } catch (error: any) {
      if (error?.status === 409) {
        messageApi.error(
          "Project type already in use. Please try again with a different project type."
        );
      } else {
        messageApi.error("Unable to create the project type. Please try again.");
      }
    }
  };

  return (
    <Form form={form} onFinish={handleFinish}>
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Project type"
            name="projectTypeName"
            rules={[{ required: true, message: "Project type is required" }]}
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
            name="projectTypeDescription"
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
          <Button onClick={onCreateProjectTypeModalClose} type="default">
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

export default CreateProjectTypeForm;
