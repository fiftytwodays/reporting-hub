import useOrganizationsList from "@/entities/organization/api/oganization-list";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Space, Upload } from "antd";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { useState } from "react";
import useCreateOrganzation from "../api/create-organization";

interface CreateOrganizationFormProps {
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

enum UploadFileStatus {
  "uploading" = "uploading",
  "done" = "done",
  "error" = "error",
}

interface CustomRequestProps {
  file: RcFile | Blob | string;
  onSuccess?: (body: any, xhr?: XMLHttpRequest) => void; // Optional, matches Ant Design's type
  onError?: (event: ProgressEvent) => void; // Optional, matches Ant Design's type
}

const CreateOrganizationForm: React.FC<CreateOrganizationFormProps> = ({
  messageApi,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedDocumentState, setUploadedDocumentState] = useState<
    string | null
  >(null);

  const { reloadOrganizationList } = useOrganizationsList({ condition: true });
  const { createOrganzation, isCreating } = useCreateOrganzation();

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
        setUploadedDocumentState(base64String);

        form.setFieldsValue({ logo: base64String });

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
      logo: fileList ? uploadedDocumentState ?? "" : "",
    };

    try {
      const data = await createOrganzation(payload);
      if (data) {
        messageApi.success("Organization has been added successfully.");
        reloadOrganizationList();
        form.resetFields();
        setFileList([]);
        setUploadedDocumentState(null);
      }
    } catch (error) {
      messageApi.error("Unable to add the organization. Please try again.");
    }
  };

  const handleRemove = () => {
    setFileList([]);
    form.setFieldValue("logo", "");
    setUploadedDocumentState(null);
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
    <Form
      form={form}
      onFinish={handleFinish}
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
        <Space>
          <Button type="default" onClick={() => form.resetFields()}>
            Reset
          </Button>
          <Button type="primary" htmlType="submit" loading={isCreating}>
            Save
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default CreateOrganizationForm;
