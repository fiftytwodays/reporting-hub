import { useState } from "react";
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
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [messageApi, contextHolder] = message.useMessage();

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = async (values: any) => {
    if (values.password !== values.confirm) {
      message.error("Passwords do not match!");
      return;
    }
    try {
      if (userData) {
        const setPasswordInput = {
          userName: userData?.Email,
          password: values.password,
          permanent: values.isPermanent ? true : false,
        };
        // Check if password should be set as permanent
        await client.mutations.setUserPassword(setPasswordInput);
        messageApi.success("Password reset completed successfully");
        onModalOk();
      } else {
        messageApi.error("Error while resetting password: Email is null");
      }

      form.resetFields();
      onModalOk();
    } catch (error) {
      messageApi.error("Error resetting password. Please try again.");
    }
  };

  const handleFieldsChange = () => {
    const password = form.getFieldValue("password");
    const confirm = form.getFieldValue("confirm");
    setPasswordsMatch(password === confirm);
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Reset password"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={onModalCancel}
        okButtonProps={{ disabled: !passwordsMatch }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          onFieldsChange={handleFieldsChange}
        >
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
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
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
