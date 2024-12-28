import { Modal, Form, Input, message, Checkbox } from "antd";
import { generateClient } from "aws-amplify/data";
import { mutate } from "swr";

import type { Schema } from "@root/amplify/data/resource";

import type { User } from "../config/types";

interface UserResetPasswordProps {
  userData: User | undefined;

  isLoading?: boolean;
  isModalOpen: boolean;
  onModalOk: () => void;
  onModalCancel: () => void;
}

export default function UserResetPassword({
  userData,
  isModalOpen,
  onModalOk,
  onModalCancel,
}: UserResetPasswordProps) {
  const [form] = Form.useForm();
  const client = generateClient<Schema>();

  const [messageApi, contextHolder] = message.useMessage();

  const handleOk = () => {
    console.log("trigger");
    form.submit();
    onModalCancel();
  };

  const handleFinish = async (values: any) => {
    console.log("values: ", values);
    if (values.password !== values.confirm) {
      message.error("Passwords do not match!");
      return;
    }
    try {
      console.log("values.isPermanent: ", values.isPermanent);
      if (userData) {
        const setPasswordInput = {
          userName: userData?.Email,
          password: values.password,
          permanent: values.isPermanent ? true : false,
        };
        // Check if password should be set as permanent
        await client.mutations.setUserPassword(setPasswordInput);
        messageApi.success("Password reset completed successfully");
      } else {
        messageApi.error("Error while resetting password: Email is null");
      }

      form.resetFields();
    } catch (error) {
      messageApi.error("Error while resetting password: " + error);
    }
    mutate(["/api/users"]);
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Reset user password"
        open={isModalOpen}
        okText="Reset password"
        onCancel={onModalCancel}
        onOk={handleOk}
        destroyOnClose={true}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {/* <Form.Item
            label="Current password"
            name="current-password"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please input your current password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item> */}

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  messageApi.error("Passwords do not match!");
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="isPermanent" valuePropName="checked">
            <Checkbox>Set Password as Permanent</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
