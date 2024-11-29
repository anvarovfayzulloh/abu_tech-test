import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import './Login.css';
import login_bg from '../../assets/image/login.png';
import logo from '../../assets/image/logo.png';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: { login: string; password: string }) => {
    try {
      const API_URL = `https://dev.api-erp.najotedu.uz/api/staff/auth/sign-in`;
      const response = await axios.post(API_URL, {
        login: values.login,
        password: values.password,
        fcmToken: "",
      });
      message.success('Tizimga kirish muvaffaqiyatli amalga oshirildi!');
      console.log(response.data.data.accessToken);
      localStorage.setItem('accessToken', response.data.data.accessToken);
      navigate('/contracts');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Serverga ulanishda xato yuz berdi.';
      message.error(errorMessage);
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
          <h2 className="form-title">Tizimga Kirish</h2> 

          <Form.Item>
            <h3 className="input_label">Login</h3>
          </Form.Item>
          <Form.Item
            name="login"
            rules={[{ required: true, message: 'Iltimos, loginni kiriting!' }]}
          >
            <Input placeholder="Login" />
          </Form.Item>
          <Form.Item>
            <h3 className="input_label">Parol</h3>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Iltimos, parolni kiriting!' }]}
          >
            <Input.Password placeholder="Parol" />
          </Form.Item>
          <Form.Item>
            <button type='submit'>
              Kirish
            </button>
          </Form.Item>
        </Form>

      </div>
    </div>
  );
};

export default Login;
