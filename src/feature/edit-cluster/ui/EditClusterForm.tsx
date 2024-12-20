import React from "react";
import { Form, Input, Button, Row, Col, Space, Flex } from "antd";
import { Cluster } from "@/entities/cluster/config/types";
import Regions from "./Regions";
import useEditCluster from "../api/edit-cluster";
import useClustersList from "@/entities/cluster/api/clusters-list";

interface EditClusterFormProps {
  onEditClusterModalClose: () => void;
  clusterDetails: Cluster;
  messageApi: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

interface FormValues {
  clusterName: string;
  region: string;
  clusterDescription?: string;
}

const EditClusterForm: React.FC<EditClusterFormProps> = ({
  clusterDetails,
  onEditClusterModalClose,
  messageApi,
}) => {
  const [form] = Form.useForm<FormValues>();

  const { reloadClustersList } = useClustersList({ condition: true });
  const { updateCluster, isUpdating } = useEditCluster();

  const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const handleFinish = async (values: FormValues) => {
    const payload = {
      id: clusterDetails.id,
      name: values.clusterName,
      regionId: values.region,
      description: values.clusterDescription,
    };

    try {
      const data = await updateCluster(payload);
      if (data) {
        messageApi.success("Cluster has been updated successfully.");
        reloadClustersList();
        onEditClusterModalClose();
        form.resetFields();
      }
    } catch (error: any) {
      const errorMessage =
        error?.status === 409
          ? "Cluster name already in use. Please try again with a different cluster name."
          : error?.message || "Unable to update the cluster. Please try again.";
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
        clusterName: clusterDetails.name,
        region: clusterDetails.regionId,
        clusterDescription: clusterDetails.description,
      }}
    >
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Cluster name"
            name="clusterName"
            rules={[{ required: true, message: "Cluster name is required" }]}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Region"
            name="region"
            rules={[{ required: true, message: "Region is required" }]}
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
          >
            <Regions form={form} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24}>
          <Form.Item
            label="Cluster description"
            name="clusterDescription"
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
          <Button onClick={onEditClusterModalClose} type="default">
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

export default EditClusterForm;
