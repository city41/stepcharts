import { calculateStats } from "../calculateStats";
import { parseSm } from "../parseSm";
import { RawSimfile } from "../parseSimfile";

describe("calculateStats", () => {
  function parse(notes: string): RawSimfile {
    const stepchart = `#NOTES:
     dance-single:
     :
     Beginner:
     5:
     :
${notes}
;`;

    return parseSm(stepchart, "test");
  }

  describe("gallops", () => {
    it("should consider gallops to be gallops", () => {
      const stepchart = parse(`
0010
0000
0000
0010
1000
0000
0000
1000
0100
0000
0000
0100
0010
0000
0000
0000
`);

      const stats = calculateStats(stepchart.charts[0]);

      expect(stats.gallops).toEqual(3);
    });

    it("should ignore 16th jacks", () => {
      const stepchart = parse(`
0000
0000
1000
1000
1000
0000
0001
0001
0001
0000
1000
1000
1000
0000
0000
0000
`);

      const stats = calculateStats(stepchart.charts[0]);

      expect(stats.gallops).toEqual(0);
    });
  });
});
