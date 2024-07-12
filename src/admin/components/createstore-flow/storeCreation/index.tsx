import { Form, Input, Button, Select, message } from "antd";
import React, { useState } from "react";

const StoreCreation = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values:any) => {
    console.log("values", values);
    const result = await fetch("http://localhost:9000/admin/store/create-new-store", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      if (!res?.ok) {
        setLoading(false);
        throw new Error("Failed to send message");
      } else {
        form.resetFields();
        message.success("Store created successfully");
        setLoading(false);
      }
      return await res.json();
    });
    values = { ...values, Store_Id: result.id };
    await fetch("http://localhost:9000/admin/user/create-new-user", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (!res?.ok) {
        setLoading(false);
        throw new Error("Failed to send message");
      } else {
        form.resetFields();
        message.success("User created successfully");
        setLoading(false);
      }
      return res.json();
    });
  };
  const onFinishFailed = () => {};
  const onReset = () => {
    form.resetFields();
  };

  return (
    <>
      <Form
        form={form}
        name="control-hooks"
        initialValues={{ Role: "admin", Currency_Code: "usd" }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div className="p-2">
        <Form.Item name={"First_Name"} rules={[{ required: true }]}>
          <Input placeholder="First name" className="rounded-lg border border-gray-200 px-4 py-2 w-full"/>
        </Form.Item>
        </div>
        <div className="p-2">
        <Form.Item name={"Last_Name"} rules={[{ required: true }]}>
          <Input placeholder="Last name" className="rounded-lg border border-gray-200 px-4 py-2 w-full" />
        </Form.Item>
        </div>
        <div className="p-2">
        <Form.Item name={"Email"} rules={[{ required: true }]}>
          <Input placeholder="Email address" type="email"  className="rounded-lg border border-gray-200 px-4 py-2 w-full" />
        </Form.Item>
        </div>
        <div className="p-2">
        <Form.Item name={"Password"} rules={[{ required: true }]}>
          <Input placeholder="Password" type="password"  className="rounded-lg border border-gray-200 px-4 py-2 w-full" />
        </Form.Item>
        </div>
        <div className="p-2">
        <Form.Item name={"Confirm_Password"} rules={[
          { required: true},
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue("Password") === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error("The two passwords do not match"));
          },
        }),
         ]}>
          <Input placeholder="Confirm Password" type="password"  className="rounded-lg border border-gray-200 px-4 py-2 w-full" />
        </Form.Item>
        </div>
        <div className="p-2">
          <Form.Item name={"Store_Name"} rules={[{ required: true }]}>
            <Input
              placeholder="Store name"
              className="rounded-lg border border-gray-200 px-4 py-2 w-full"
            />
          </Form.Item>
        </div>
        <div className="p-2">
          <Form.Item name={"Role"}>
            <Input
              placeholder="Role"
              className="rounded-lg border border-gray-200 px-4 py-2 w-full"
              defaultValue="admin"
              disabled={true}
            />
          </Form.Item>
        </div>
        <div className="p-2">
          <Form.Item name={"Currency_Code"}>
            <Input
              placeholder="Currency Code"
              className="rounded-lg border border-gray-200 px-4 py-2 w-full"
              defaultValue="usd"
              disabled={true}
            />
          </Form.Item>
        </div>
        <Form.Item>
          {!loading && (
            <Button type="primary" htmlType="submit">
              Create Store
            </Button>
          )}
          {loading && (
            <Button type="primary" htmlType="button">
              Sending...
            </Button>
          )}
          <Button
            htmlType="button"
            onClick={onReset}
            style={{ marginLeft: "15px" }}
          >
            Reset
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default StoreCreation;
