import React from "react";
import clsx from "clsx";
import Link from "next/link";

type FooterProps = {
  className?: string;
};

function Footer({ className }: FooterProps) {
  return (
    <footer
      className={clsx(
        className,
        "bg-bg py-2 px-2 sm:p-4 flex flex-row justify-between text-center text-sm"
      )}
    >
      this the footer
    </footer>
  );
}

export { Footer };
