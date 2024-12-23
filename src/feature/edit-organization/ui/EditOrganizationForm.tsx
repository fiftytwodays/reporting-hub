import useOrganizationsList from "@/entities/organization/api/oganization-list";
import { Organization } from "@/entities/organization/config/types";
import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Skeleton,
  Space,
  UploadFile,
} from "antd";
import Upload, { RcFile } from "antd/es/upload";
import React, { useEffect, useState } from "react";
import useUpdateOrganzation from "../api/update-organization";

interface EditOrganizationFormProps {
  setIsEditing: (status: boolean) => void;
  isEditing: boolean;
  isLoading: boolean;
  organizationDetails: Organization;
  messageApi: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

interface FormValues {
  name: string;
  website: string;
  address: string;
  logo: string;
  phoneNumber: string;
  email: string;
  description: string;
  history: string;
  mission: string;
  vision: string;
  coreValues: string;
}

interface CustomRequestProps {
  file: RcFile | Blob | string;
  onSuccess?: (body: any, xhr?: XMLHttpRequest) => void; // Optional, matches Ant Design's type
  onError?: (event: ProgressEvent) => void; // Optional, matches Ant Design's type
}

enum UploadFileStatus {
  "uploading" = "uploading",
  "done" = "done",
  "error" = "error",
}

const EditOrganizationForm: React.FC<EditOrganizationFormProps> = ({
  setIsEditing,
  isEditing,
  isLoading,
  organizationDetails,
  messageApi,
}) => {
  const [form] = Form.useForm<FormValues>();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileListInitial, setFileListInitial] = useState<UploadFile[]>([]);

  const [uploadedDocument, setUploadedDocument] = useState<string | null>(
    organizationDetails.logo
  );

  const { reloadOrganizationList } = useOrganizationsList({ condition: true });
  const { updateOrganzation, isUpdating } = useUpdateOrganzation();

  useEffect(() => {
    if (organizationDetails.logo !== "") {
      const base64String = organizationDetails.logo; // Assuming this contains the base64 image data
      const fileObj: UploadFile = {
        uid: organizationDetails.id, // Use unique ID
        name: "logo", // File name
        status: "done", // Upload status
        url: `${base64String}`, // Convert base64 to a data URL
        preview: `${base64String}`,
      };
      setFileListInitial([fileObj]);
      setFileList([fileObj]);
      form.setFieldsValue({ logo: organizationDetails.logo });
    }
  }, [organizationDetails?.logo, form]);

  const validateMessages = {
    required: "${label} is required",
    types: {
      email: "Please enter a valid email",
    },
  };

  const customRequest = ({
    file,
    onSuccess,
    onError,
  }: CustomRequestProps): void => {
    try {
      const reader = new FileReader();

      reader.onload = async () => {
        const base64String = reader.result as string;

        const fileObj: UploadFile = {
          uid: (file as RcFile).uid,
          name: (file as RcFile).name,
          status: UploadFileStatus.done,
          url: base64String,
        };

        form.setFieldsValue({ logo: base64String });
        setUploadedDocument(base64String);
        setFileList((prevFileList) => [...prevFileList, fileObj]);
      };

      if (onSuccess) {
        onSuccess({ status: "done" });
      }

      reader.onerror = (error) => {
        if (onError) {
          onError(error as ProgressEvent);
        }
      };

      reader.readAsDataURL(file as Blob);
    } catch (error) {
      if (onError) {
        onError(error as ProgressEvent);
      }
    }
  };

  const handleFinish = async (values: FormValues) => {
    const payload = {
      ...values,
      logo: fileList ? uploadedDocument ?? "" : "",
      id: organizationDetails.id,
    };
    try {
      const data = await updateOrganzation(payload);
      if (data) {
        messageApi.success("Organization has been updated successfully.");
        reloadOrganizationList();
        form.resetFields();
        setFileList([]);
        setUploadedDocument(null);
        setIsEditing(false);
      }
    } catch (error) {
      messageApi.error("Unable to update the organization. Please try again.");
    }
  };

  const handleRemove = () => {
    setFileList([]);
    form.setFieldValue("logo", "");
    setUploadedDocument(null);
  };

  const renderTextField = (
    label: string,
    name: keyof FormValues,
    rules: any[] = []
  ) => (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input />
    </Form.Item>
  );

  const renderTextAreaField = (label: string, name: keyof FormValues) => (
    <Form.Item
      label={label}
      name={name}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input.TextArea />
    </Form.Item>
  );

  return (
    <Skeleton loading={isLoading}>
      <Form
        disabled={!isEditing}
        form={form}
        initialValues={organizationDetails}
        onFinish={handleFinish}
        onAbort={() => {
          form.resetFields();
          setFileList([]);
          form.setFieldValue("logo", "");
          setUploadedDocument(null);
        }}
        validateMessages={validateMessages}
      >
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            {renderTextField("Name", "name", [{ required: true }])}
          </Col>
          <Col xs={24} sm={12}>
            {renderTextField("Website", "website")}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            {renderTextField("Address", "address")}
          </Col>
          <Col xs={24} sm={12}>
            {renderTextField("Phone Number", "phoneNumber")}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            {renderTextField("Email", "email", [{ type: "email" }])}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            {renderTextAreaField("Description", "description")}
          </Col>
          <Col xs={24} sm={12}>
            {renderTextAreaField("History", "history")}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            {renderTextAreaField("Mission", "mission")}
          </Col>
          <Col xs={24} sm={12}>
            {renderTextAreaField("Vision", "vision")}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            {renderTextAreaField("Core Values", "coreValues")}
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Logo"
              name="logo"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Upload
                customRequest={customRequest}
                listType="picture-card"
                fileList={fileList}
                accept="image/*"
                onRemove={handleRemove}
              >
                {fileList.length < 1 && (
                  <Button icon={<UploadOutlined />}>Upload Logo</Button>
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            type="default"
            onClick={() => {
              form.resetFields();
              setFileList(fileListInitial);
            }}
          >
            Reset
          </Button>
          <Space>
            <Button
              type="default"
              onClick={() => {
                setIsEditing(false);
                setFileList(fileListInitial);
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              Save
            </Button>
          </Space>
        </div>
      </Form>
    </Skeleton>
  );
};

export default EditOrganizationForm;
