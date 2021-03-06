import React from "react";
import Link from "next/link";

/**
 *
 * @return {JSX.Element}
 * @constructor
 */
export default function Header() {
  return (
    <header>
      <Link href="/">
        <a>Home</a>
      </Link>{" "}
      <Link href="/blog">
        <a>Blog</a>
      </Link>{" "}
      <Link href="/about">
        <a>About</a>
      </Link>
    </header>
  );
}
