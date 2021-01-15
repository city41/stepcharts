import React from "react";

type MixPageProps = {
  mix: string;
  titles: string[];
};

function MixPage({ mix, titles }: MixPageProps) {
  return (
    <>
      <h1>{mix}</h1>
      <ul>
        {titles.map((title) => (
          <li key={title}>{title}</li>
        ))}
      </ul>
    </>
  );
}

export { MixPage };
