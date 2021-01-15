import React from "react";

type IndexPageProps = {
  songs: SongDifficultyType[];
};

function buildSongUrl(s: SongDifficultyType): string {
  return `/${s.mix}/${s.title}/${s.type}`;
}

function IndexPage({ songs }: IndexPageProps) {
  return (
    <div>
      <ul>
        {songs.map((s) => (
          <li key={s.title}>
            <a href={buildSongUrl(s)}>
              {s.title} {s.type}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { IndexPage };
