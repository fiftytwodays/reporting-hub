import { Button, Col, Flex, Form, Input, Row, Space } from "antd";
import useCreateProject from "../api/create-region";
import useProjectsList from "@/entities/project/api/project-list";
import useRegionsList from "@/entities/region/api/region-list";
import useCreateRegion from "../api/create-region";

interface CreateRegionFormProps {
  onCreateRegionModalClose: () => void;
  messageApi: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

interface FormValues {
  regionName: string;
  regionDescription?: string;
}

const CreateRegionForm: React.FC<CreateRegionFormProps> = ({
  onCreateRegionModalClose,
  messageApi,
}) => {
  const [form] = Form.useForm<FormValues>();

  const { reloadRegionsList } = useRegionsList({condition: true});

  const { createRegion, isCreating } = useCreateRegion();

  const handleFinish = async (values: FormValues) => {
    const payload = {
      name: values.regionName,
      description: values.regionDescription,
    };

    try {
      const data = await createRegion(payload);
      if (data) {
        messageApi.success("Region has been created successfully.");
        reloadRegionsList();
        onCreateRegionModalClose();
        form.resetFields();
      }
    } catch (error: any) {
      if (error?.status === 409) {
        messageApi.error(
          "Region name already in use. Please try again with a different region name."
        );
      } else {
        messageApi.error("Unable to create the region. Please try again.");
      }
    }
  };

  return (
    <Form form={form} onFinish={handleFinish}>
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Region name"
            name="regionName"
            rules={[{ required: true, message: "Region name is required" }]}
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
            label="Region description"
            name="regionDescription"
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
          <Button onClick={onCreateRegionModalClose} type="default">
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

export default CreateRegionForm;
