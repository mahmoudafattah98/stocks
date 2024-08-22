"use client";

import Image from "next/image";

export default function Splash() {
  return (
    <div style={{ backgroundColor: "black", height: "1vh", width: "100%" }}>
      <Image
        src="/assets/nasdaqLogo.png"
        alt="Nasdaq Logo"
        width={100}
        height={100}
      ></Image>
    </div>
  );
}
