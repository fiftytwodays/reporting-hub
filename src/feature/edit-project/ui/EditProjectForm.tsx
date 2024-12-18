import useEditProject from "../api/edit-project";
import { Project } from "@/entities/project/config/types";

import React from "react";
import { Form, Input, Button, Row, Col, Space, Flex } from "antd";
import ProjectTypes from "./ProjectTypes";
import Clusters from "./Clusters";
import useProjectsList from "@/entities/project/api/project-list";

interface EditProjectFormProps {
  onEditProjectModalClose: () => void;
  projectDetails: Project;
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


const EditProjectForm: React.FC<EditProjectFormProps> = ({
  projectDetails,
  onEditProjectModalClose,
  messageApi,
}) => {
  const [form] = Form.useForm<FormValues>();

  const { reloadProjectList } = useProjectsList({condition: true});
  const { updateProject, isUpdating } = useEditProject();

  const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const handleFinish = async (values: FormValues) => {
    const payload = {
      id: projectDetails.id,
      name: values.projectName,
      location: values.projectLocation,
      projectTypeId: values.projectType,
      clusterId: values.cluster,
      description: values.projectDescription,
    };

    try {
      const data = await updateProject(payload);
      if (data) {
        messageApi.success("Project has been updated successfully.");
        reloadProjectList();
        onEditProjectModalClose();
        form.resetFields();
      }
    } catch (error: any) {
      const errorMessage =
        error?.status === 409
          ? "Project name already in use. Please try again with a different project name."
          : error?.message || "Unable to update the project. Please try again.";
      messageApi.error(errorMessage);
    }
  };

  const handleReset = () => {
    form.setFieldsValue({
      projectName: projectDetails.name,
      projectLocation: projectDetails.location,
      projectType: projectDetails.projectTypeId,
      cluster: projectDetails.clusterId,
      projectDescription: projectDetails.description,
    });
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      initialValues={{
        projectName: projectDetails.name,
        projectLocation: projectDetails.location,
        projectType: projectDetails.projectTypeId,
        cluster: projectDetails.clusterId,
        projectDescription: projectDetails.description,
      }}
    >
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Project name"
            name="projectName"
            rules={[{ required: true, message: "Project name is required" }]}
            {...formLayout}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Project location"
            name="projectLocation"
            rules={[{ required: true, message: "Project location is required" }]}
            {...formLayout}
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
            {...formLayout}
          >
            <ProjectTypes form={form}/>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Cluster"
            name="cluster"
            rules={[{ required: true, message: "Cluster is required" }]}
            {...formLayout}
          >
            <Clusters form={form}/>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <Form.Item label="Project description" name="projectDescription" {...formLayout}>
            <Input.TextArea />
          </Form.Item>
        </Col>
      </Row>
      <Flex justify="space-between">
        <Button type="default" onClick={handleReset}>
          Reset
        </Button>
        <Space>
          <Button onClick={onEditProjectModalClose} type="default">
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

export default EditProjectForm;
