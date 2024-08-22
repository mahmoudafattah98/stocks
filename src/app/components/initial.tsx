"use client";

import { useEffect, useState } from "react";
import Splash from "./splash";
import Explore from "./explore";

export default function Initial() {
  const [isSplashLoading, setIsSplashLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashLoading(false);
    }, 3000);
  }, []);

  return <>{isSplashLoading ? <Splash /> : <Explore />}</>;
}
