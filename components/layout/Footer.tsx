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
        "bg-bg-fade py-4 px-2 sm:p-6 flex flex-row justify-between text-center text-sm border-t border-bg-fade"
      )}
    >
      this the footer
    </footer>
  );
}

export { Footer };
