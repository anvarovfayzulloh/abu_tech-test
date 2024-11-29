import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import './Login.css';
import login_bg from '../../assets/image/login.png';
import logo from '../../assets/image/logo.png';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { login: string; password: string }) => {
    try {
      setLoading(true);
      const API_URL = `${process.env.REACT_APP_API_URL}/api/staff/auth/sign-in`;
      const response = await axios.post(API_URL, {
        login: values.login,
        password: values.password,
        fcmToken: "",
      });
      message.success('Tizimga kirish muvaffaqiyatli amalga oshirildi!');
      console.log('Serverdan javob:', response.data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Serverga ulanishda xato yuz berdi.';
      message.error(errorMessage);
      console.error('Xato:', error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={login_bg} alt="Background" className="login-bg" />
      </div>
      <div className="login-right">
        <img src={logo} alt="Logo" className="login-logo" />
        <Form
          name="loginForm"
          onFinish={onFinish}
          className="login-form"
          layout="vertical"
        >
          <Form.Item>
            <h3>Login</h3>
          </Form.Item>
          <Form.Item
            name="login"
            rules={[{ required: true, message: 'Iltimos, loginni kiriting!' }]}
          >
            <Input placeholder="Login" />
          </Form.Item>
          <Form.Item>
            <h3>Parol</h3>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Iltimos, parolni kiriting!' }]}
          >
            <Input.Password placeholder="Parol" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Kirish
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
