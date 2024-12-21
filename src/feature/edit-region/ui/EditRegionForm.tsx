import React from "react";
import { Form, Input, Button, Row, Col, Space, Flex } from "antd";
import useEditRegion from "../api/edit-region";
import { Region } from "@/entities/region/config/types";
import useRegionsList from "@/entities/region/api/region-list";

interface EditRegionFormProps {
  onEditRegionModalClose: () => void;
  regionDetails: Region;
  messageApi: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

interface FormValues {
  regionName: string;
  regionDescription?: string;
}

const EditRegionForm: React.FC<EditRegionFormProps> = ({
  regionDetails,
  onEditRegionModalClose,
  messageApi,
}) => {
  const [form] = Form.useForm<FormValues>();

  const { reloadRegionsList } = useRegionsList({ condition: true });
  const { updateRegion, isUpdating } = useEditRegion();

  const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const handleFinish = async (values: FormValues) => {
    const payload = {
      id: regionDetails.id,
      name: values.regionName,
      description: values.regionDescription,
    };

    try {
      const data = await updateRegion(payload);
      if (data) {
        messageApi.success("Region has been updated successfully.");
        reloadRegionsList();
        onEditRegionModalClose();
        form.resetFields();
      }
    } catch (error: any) {
      const errorMessage =
        error?.status === 409
          ? "Region name already in use. Please try again with a different region name."
          : error?.message || "Unable to update the region. Please try again.";
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
        regionName: regionDetails.name,
        regionDescription: regionDetails.description,
      }}
    >
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
          <Button onClick={onEditRegionModalClose} type="default">
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

export default EditRegionForm;
