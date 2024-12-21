import React from "react";
import { Form, Input, Button, Row, Col, Space, Flex } from "antd";
import { FunctionalArea } from "@/entities/functional-area/config/types";
import useFunctionalAreasList from "@/entities/functional-area/api/functional-areas-list";
import useEditFunctionalArea from "../api/edit-functional-area";

interface EditFunctionalAreaFormProps {
  onEditFunctionalAreaModalClose: () => void;
  functionalAreaDetails: FunctionalArea;
  messageApi: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

interface FormValues {
  functionalAreaName: string;
  functionalAreaDescription?: string;
}

const EditFunctionalAreaForm: React.FC<EditFunctionalAreaFormProps> = ({
  functionalAreaDetails,
  onEditFunctionalAreaModalClose,
  messageApi,
}) => {
  const [form] = Form.useForm<FormValues>();

  const { reloadFunctionalAreasList } = useFunctionalAreasList({ condition: true });
  const { updateFunctionalArea, isUpdating } = useEditFunctionalArea();

  const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const handleFinish = async (values: FormValues) => {
    const payload = {
      id: functionalAreaDetails.id,
      name: values.functionalAreaName,
      description: values.functionalAreaDescription,
    };

    try {
      const data = await updateFunctionalArea(payload);
      if (data) {
        messageApi.success("Functional area has been updated successfully.");
        reloadFunctionalAreasList();
        onEditFunctionalAreaModalClose();
        form.resetFields();
      }
    } catch (error: any) {
      const errorMessage =
        error?.status === 409
          ? "Functional area name already in use. Please try again with a different name."
          : error?.message || "Unable to update the functional area. Please try again.";
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
        functionalAreaName: functionalAreaDetails.name,
        functionalAreaDescription: functionalAreaDetails.description,
      }}
    >
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Functional area"
            name="functionalAreaName"
            rules={[{ required: true, message: "Functional area is required" }]}
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
          <Button onClick={onEditFunctionalAreaModalClose} type="default">
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

export default EditFunctionalAreaForm;
