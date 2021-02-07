import { parseDwi } from "../parseDwi";

describe("parseDwi", () => {
  function parse(notes: string) {
    const data = `
#BPM:300;
#SINGLE:BEGINNER:3:${notes}`;

    return parseDwi(data, "");
  }

  describe("freezes", () => {
    it.only("should allow multiple open freezes at once (Maxx Unlimited)", () => {
      const result = parse("8!84!4860B");
      const { arrows, freezes } = result.arrows["single-beginner"];

      expect(arrows).toEqual([
        { beat: 4, direction: "0020", offset: 0 },
        { beat: 8, direction: "2000", offset: 0.125 },
        { beat: 8, direction: "0001", offset: 0.375 },
        { beat: 8, direction: "0001", offset: 0.625 },
      ]);

      expect(freezes).toEqual([
        { direction: 2, startOffset: 0, endOffset: 0.5 },
        { direction: 0, startOffset: 0.125, endOffset: 0.875 },
      ]);
    });
  });
});
