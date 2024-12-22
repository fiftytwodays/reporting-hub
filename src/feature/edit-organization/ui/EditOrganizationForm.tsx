import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Space,
  Flex,
  UploadFile,
  Skeleton,
} from "antd";
import { Organization } from "@/entities/organization/config/types";
import useOrganizationsList from "@/entities/organization/api/oganization-list";
import useUpdateOrganzation from "../api/update-organization";
import useCreateOrganzation from "@/feature/create-organization/api/create-organization";
import useUploadDocument from "@/feature/upload-document/api/upload-document";
import useDeleteDocument from "@/feature/delete-document/api/delete-document";
import Upload, { RcFile } from "antd/es/upload";
import { UploadOutlined } from "@ant-design/icons";
import useGetDocument from "@/feature/get-document/api/get-document";

interface Document {
  id: string;
  name: string;
  document: string;
}

interface EditClusterFormProps {
  isLoading: boolean;
  onEditOrganizationModalClose: () => void;
  organizationDetails: Organization;
  document: Document | undefined;
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

interface UploadDocumentInput {
  name: string;
  document: string;
}

const EditOrganizationForm: React.FC<EditClusterFormProps> = ({
  isLoading,
  organizationDetails,
  document,
  onEditOrganizationModalClose,
  messageApi,
}) => {
  const [form] = Form.useForm<FormValues>();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedDocumentState, setUploadedDocumentState] = useState<
    string | null
  >(null);

  const { reloadOrganizationList } = useOrganizationsList({ condition: true });
  const { uploadDocument } = useUploadDocument();
  const { deleteDocument } = useDeleteDocument();
  const { updateOrganzation, isUpdating } = useUpdateOrganzation();

  useEffect(() => {
    if (!document) {
      setFileList([]);
    }
    if (document && document.document) {
      const base64String = document.document; // Assuming this contains the base64 image data
      const fileObj: UploadFile = {
        uid: organizationDetails.logo, // Use unique ID
        name: document.name, // File name
        status: "done", // Upload status
        url: `${base64String}`, // Convert base64 to a data URL
        preview: `${base64String}`,
      };
      setFileList([fileObj]);
      setUploadedDocumentState(organizationDetails.logo); // Set the document ID
      form.setFieldsValue({ logo: organizationDetails.logo });
    }
  }, [document, organizationDetails.logo, form]);

  const validateMessages = {
    required: "${label} is required",
    types: {
      email: "Please enter a valid email",
    },
  };

  const formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
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

        const uploadPayload: UploadDocumentInput = {
          name: (file as RcFile).name,
          document: base64String,
        };

        const response = await uploadDocument(uploadPayload);

        const uploadedDocumentId = response.id;

        if (uploadedDocumentId) {
          const fileObj: UploadFile = {
            uid: (file as RcFile).uid,
            name: (file as RcFile).name,
            status: UploadFileStatus.done,
            url: base64String,
          };

          setUploadedDocumentState(uploadedDocumentId);

          form.setFieldsValue({ logo: uploadedDocumentId });

          setFileList((prevFileList) => [...prevFileList, fileObj]);
        }

        if (onSuccess) {
          onSuccess({ status: "done" });
        }
      };

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
      logo: fileList ? uploadedDocumentState ?? "" : "",
      id: organizationDetails.id,
    };

    try {
      const data = await updateOrganzation(payload);
      if (data) {
        messageApi.success("Organization has been updated successfully.");
        reloadOrganizationList();
        form.resetFields();
        setFileList([]);
        setUploadedDocumentState(null);
        onEditOrganizationModalClose();
      }
    } catch (error) {
      messageApi.error("Unable to update the organization. Please try again.");
    }
  };

  const handleRemove = () => {
    deleteDocument({ id: uploadedDocumentState ?? "" });
    setFileList([]);
    form.setFieldValue("logo", "");
    setUploadedDocumentState(null);
  };

  const handleReset = () => {
    form.resetFields();
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
        form={form}
        initialValues={organizationDetails}
        onFinish={handleFinish}
        onAbort={() => {
          form.resetFields();
          setFileList([]);
          form.setFieldValue("logo", "");
          setUploadedDocumentState(null);
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
            {renderTextField("Email", "email", [
              {type: "email" },
            ])}
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
          <Button type="default" onClick={() => form.resetFields()}>
            Reset
          </Button>
          <Space>
            <Button onClick={onEditOrganizationModalClose} type="default">
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
