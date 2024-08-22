// components/splash.tsx
import Image from "next/image";
import { Roboto } from "next/font/google";
const roboto = Roboto({ subsets: ["latin"], weight: "100" });
import { Spin } from "antd";
export default function Splash() {
  return (
    <div
      style={{
        backgroundColor: "rgba(0, 21, 41, 1)",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >
      <Image
        src="/assets/nasdaqLogo.png"
        alt="Nasdaq Logo"
        width={527.86}
        height={150}
      />
      <h2
        style={{
          marginTop: "30px",
          fontFamily: roboto.style.fontFamily,
          fontSize: "25px",
          marginBottom: "70px",
        }}
      >
        By: Mahmoud Abdelfattah
      </h2>{" "}
      <Spin size="large" />
    </div>
  );
}
