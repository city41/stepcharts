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
        "bg-bg text-focal-400 py-2 px-2 sm:p-4 text-center text-xs"
      )}
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col space-y-2">
        <div className="text-focal-700">
          All songs, artwork and step charts are property of Konami
        </div>
        <div>
          Made by{" "}
          <a className="text-focal-300" href="https://twitter.com/mattegreer">
            Matt Greer
          </a>
          <span className="mx-2">&#124;</span>
          <a
            className="text-focal-300"
            href="https://github.com/city41/stepcharts"
          >
            GitHub repo
          </a>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
