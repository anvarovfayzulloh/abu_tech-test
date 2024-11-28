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
      const response = await axios.post(
       'https://dev.api-erp.najotedu.uz:4111/api/staff/auth/sign-in',
        {
          login: values.login,
          password: values.password,
          fcmToken: "",
        }
      );
      message.success('Успешный вход!');
      console.log('Response:', response.data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Произошла ошибка при входе!';
      message.error(errorMessage);
      console.error('Error:', error.response || error.message);
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
        <Form name="loginForm" onFinish={onFinish} className="login-form">
          <Form.Item>
            <h3>Логин</h3>
          </Form.Item>
          <Form.Item
            name="login"
            rules={[{ required: true, message: 'Пожалуйста, введите логин!' }]}
          >
            <Input placeholder="Логин" />
          </Form.Item>
          <Form.Item>
            <h3>Пароль</h3>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
          >
            <Input.Password placeholder="Пароль" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
