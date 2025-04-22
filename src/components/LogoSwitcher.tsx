"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import logoLight from "/public/logo-light-mode.png";
import logoDark from "/public/logo-dark-mode.png";

const LogoSwitcher = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const logoSrc = resolvedTheme === "dark" ? logoDark : logoLight;

  return (
    <div className="w-fit transition-colors">
      <Image
      className="ml-2"
        src={logoSrc}
        alt="ApplyWise logo"
        width={90}
        height={90}
        priority
      />
    </div>
  );
};

export default LogoSwitcher;
