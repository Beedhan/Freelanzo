import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = ({ width = 200 }: { width?: number }) => {
  return (
    <Link href={"/inbox"}>
      <Image
        alt="logo"
        src="/Freelanzooo_Primary.svg"
        width={width}
        height={100}
      />
    </Link>
  );
};

export default Logo;
