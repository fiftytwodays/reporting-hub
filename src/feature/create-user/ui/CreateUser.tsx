import { useState } from "react";
import { Form, Modal, Button, message } from "antd";
import { mutate } from "swr";

import CreateUserForm from "./CreateUserForm";
import {
  addUserToGroup,
  createUser,
  setUserPassword,
} from "../api/user-mutations";

export default function CreateUser() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const onModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onModalOk = () => {
    setIsModalOpen(false);
    form.submit();
  };

  const onCreateUser = async (values: any) => {
    const input = {
      ...values,
      userName: values.email,
      projects: values?.projects?.length > 0 ? values?.projects : undefined,
      clusters: values?.clusters?.length > 0 ? values?.clusters : undefined,
      regions: values?.regions?.length > 0 ? values?.regions : undefined,
    };

    try {
      messageApi.info("Creating user...");
      await createUser(input);

      if (values.isPermanent) {
        await setUserPassword(values.email, values.password, true);
      }
      if (values.roles && values.roles.length > 0) {
        for (const role of values.roles) {
          await addUserToGroup(values.email, role);
        }
      }

      messageApi.success("User created successfully!");
      form.resetFields();
    } catch (error) {
      console.log("Error creating user: ", error);
      messageApi.error("Error creating user. Please try again.");
    }
    mutate(["/api/users"]);
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        Add user
      </Button>
      <Modal
        title="Add User"
        open={isModalOpen}
        okText="Save"
        onCancel={onModalCancel}
        onOk={onModalOk}
      >
        <CreateUserForm form={form} onCreateUser={onCreateUser} />
      </Modal>
      {contextHolder}
    </>
  );
}
