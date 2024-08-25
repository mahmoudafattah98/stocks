import React from "react";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import Image from "next/image";
import StockLookup from "./stockLookup";

const { Header, Content, Footer } = Layout;

const items = new Array(15).fill(null).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

const Explore: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
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
      <Content style={{ padding: "0 48px" }}>
        <StockLookup />
      </Content>
      <Footer
        style={{
          textAlign: "center",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          height: 90,
          position: "static",
          zIndex: 1,
          bottom: 0,
          marginTop: "20px",
        }}
      >
        Created by : Mahmoud Abdelfattah @{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default Explore;
