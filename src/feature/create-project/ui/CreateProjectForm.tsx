import { Button, Col, Flex, Form, Input, Row, Space } from "antd";
import ProjectTypes from "./ProjectTypes";
import Clusters from "./Clusters";
import useCreateProject from "../api/create-project";

interface CreateProjectFormProps {
  onCreateProjectModalClose: () => void;
  messageApi: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

interface FormValues {
  projectName: string;
  projectLocation: string;
  projectType: string;
  cluster: string;
  projectDescription?: string;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  onCreateProjectModalClose,
  messageApi,
}) => {
  const [form] = Form.useForm<FormValues>();

  const { createProject, isCreating } = useCreateProject();

  const handleFinish = async (values: FormValues) => {
    const payload = {
      name: values.projectName,
      location: values.projectLocation,
      projectTypeId: values.projectType ?? "",
      clusterId: values.cluster ?? "",
      description: values.projectDescription,
    };

    try {
      const data = await createProject(payload);
      if (data) {
        messageApi.success("Project has been created successfully.");
        // reloadData();
        onCreateProjectModalClose();
        form.resetFields();
      }
    } catch (error: any) {
      if (error?.status === 409) {
        messageApi.error(
          "Project name already in use. Please try again with a different project name."
        );
      } else {
        messageApi.error("Unable to create the project. Please try again.");
      }
    }
  };

  return (
    <Form form={form} onFinish={handleFinish}>
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Project name"
            name="projectName"
            rules={[{ required: true, message: "Project name is required" }]}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Project location"
            name="projectLocation"
            rules={[{ required: true, message: "Project location is required" }]}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Project type"
            name="projectType"
            rules={[{ required: true, message: "Project type is required" }]}
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
          >
            <ProjectTypes form={form} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Cluster"
            name="cluster"
            rules={[{ required: true, message: "Cluster is required" }]}
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
          >
            <Clusters form={form} />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col xs={24} sm={24}>
          <Form.Item
            label="Project description"
            name="projectDescription"
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
          <Button onClick={onCreateProjectModalClose} type="default">
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

export default CreateProjectForm;
