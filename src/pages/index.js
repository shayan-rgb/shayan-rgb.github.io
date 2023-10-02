import React, { useState, useEffect } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import styles from "./index.module.css";
import { Auth } from "aws-amplify";
import awsExports from "../../aws-exports";
import { Form, Input, Button, Card, notification } from "antd";

Auth.configure(awsExports);

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const buttonItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 16, offset: 8 },
  },
};

const SignInForm = ({ onSignIn }) => {
  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });

  const { username, password } = formState;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSignIn = async () => {
    try {
      await Auth.signIn(username, password);
      onSignIn(true);
    } catch (error) {
      console.error("Error signing in", error);
      notification.error({
        message: "Login Error",
        description:
          "There was an error logging in. Please check your credentials and try again.",
      });
      onSignIn(false);
    }
  };

  return (
    <Card
      title={
        <div
          style={{ textAlign: "center", fontWeight: "bold", fontSize: "24px" }}
        >
          Login
        </div>
      }
      style={{
        width: 350,
        height: 400,
        margin: "0 auto",
        marginTop: 100,
        backgroundColor: "#f3f3f3",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Form
        {...formItemLayout}
        onFinish={handleSignIn}
        style={{ width: "100%" }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "The input is not a valid email!" },
          ]}
        >
          <Input
            name="username"
            value={username}
            onChange={handleInputChange}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            name="password"
            value={password}
            onChange={handleInputChange}
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item {...buttonItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ background: "#8223d8", width: "100%" }}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            Docusaurus Tutorial - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await Auth.currentAuthenticatedUser();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  const { siteConfig } = useDocusaurusContext();

  if (!isAuthenticated) {
    console.error("Authent");
    return <SignInForm onSignIn={setIsAuthenticated} />;
  }

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}

export default Home;
