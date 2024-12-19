import { Button, Col, Flex, Form, Input, Row, Space } from "antd";
import useCreateCluster from "../api/create-cluster";
import useClustersList from "@/entities/cluster/api/clusters-list";
import Regions from "./Regions";

interface CreateClusterFormProps {
  onCreateClusterModalClose: () => void;
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

const CreateClusterForm: React.FC<CreateClusterFormProps> = ({
  onCreateClusterModalClose,
  messageApi,
}) => {
  const [form] = Form.useForm<FormValues>();

  const { reloadClustersList } = useClustersList({condition: true});

  const { createCluster, isCreating } = useCreateCluster();

  const handleFinish = async (values: FormValues) => {
    const payload = {
      name: values.clusterName,
      regionId: values.region ?? "",
      description: values.clusterDescription,
    };

    try {
      const data = await createCluster(payload);
      if (data) {
        messageApi.success("Cluster has been created successfully.");
        reloadClustersList();
        onCreateClusterModalClose();
        form.resetFields();
      }
    } catch (error: any) {
      if (error?.status === 409) {
        messageApi.error(
          "Cluster name already in use. Please try again with a different cluster name."
        );
      } else {
        messageApi.error("Unable to create the cluster. Please try again.");
      }
    }
  };

  return (
    <Form form={form} onFinish={handleFinish}>
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
          <Button onClick={onCreateClusterModalClose} type="default">
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

export default CreateClusterForm;
