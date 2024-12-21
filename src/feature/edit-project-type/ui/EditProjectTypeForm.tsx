import React from "react";
import { Form, Input, Button, Row, Col, Space, Flex } from "antd";
import { ProjectType } from "@/entities/project-type/config/types";
import useProjectTypesList from "@/entities/project-type/api/project-types-list";
import useEditProjectType from "../api/edit-project-type";

interface EditProjectTypeFormProps {
  onEditProjectTypeModalClose: () => void;
  projectTypeDetails: ProjectType;
  messageApi: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

interface FormValues {
  projectTypeName: string;
  projectTypeDescription?: string;
}

const EditProjectTypeForm: React.FC<EditProjectTypeFormProps> = ({
  projectTypeDetails,
  onEditProjectTypeModalClose,
  messageApi,
}) => {
  const [form] = Form.useForm<FormValues>();

  const { reloadProjectTypesList } = useProjectTypesList({ condition: true });
  const { updateProjectType, isUpdating } = useEditProjectType();

  const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const handleFinish = async (values: FormValues) => {
    const payload = {
      id: projectTypeDetails.id,
      name: values.projectTypeName,
      description: values.projectTypeDescription,
    };

    try {
      const data = await updateProjectType(payload);
      if (data) {
        messageApi.success("Project type has been updated successfully.");
        reloadProjectTypesList();
        onEditProjectTypeModalClose();
        form.resetFields();
      }
    } catch (error: any) {
      const errorMessage =
        error?.status === 409
          ? "Project type already in use. Please try again with a different project type."
          : error?.message || "Unable to update the project type. Please try again.";
      messageApi.error(errorMessage);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      initialValues={{
        projectTypeName: projectTypeDetails.name,
        projectTypeDescription: projectTypeDetails.description,
      }}
    >
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
          <Button onClick={onEditProjectTypeModalClose} type="default">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isUpdating}>
            Save
          </Button>
        </Space>
      </Flex>
    </Form>
  );
};

export default EditProjectTypeForm;
