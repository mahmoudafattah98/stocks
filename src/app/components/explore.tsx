import React from "react";
import { Layout } from "antd";
import Image from "next/image";
import StockLookup from "./stockLookup";

const { Header, Content, Footer } = Layout;

const Explore: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {" "}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          height: 90,
          position: "sticky",
          zIndex: 1,
          top: 0,
        }}
      >
        <Image
          src="/assets/nasdaqLogo.png"
          alt={"Nasdaq Logo"}
          width={105.57}
          height={30}
        />
      </Header>
      <Content
        style={{
          padding: "0 48px",
          flex: 1, // Allow content to take up remaining space
        }}
      >
        <StockLookup />
      </Content>
      <Footer
        style={{
          textAlign: "center",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          height: 90,
          marginTop: "20px",
        }}
      >
        Created by : Mahmoud Abdelfattah @{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default Explore;
