import { parseDwi } from "../parseDwi";

describe("parseDwi", () => {
  function parse(notes: string) {
    const data = `
#BPM:300;
#SINGLE:BEGINNER:3:${notes}`;

    return parseDwi(data, "");
  }

  describe("freezes", () => {
    it("should allow multiple open freezes at once (Max2, Maxx Unlimited, single, maniac)", () => {
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

    it("should parse secret rendez-vous freezes correctly (Max2, secret rendez-vous, single, maniac)", () => {
      const result = parse("B!B00606B0B!B00404B");
      const { arrows, freezes } = result.arrows["single-beginner"];

      expect(arrows).toEqual([
        { direction: "2002", beat: 4, offset: 0 },
        { direction: "0001", beat: 8, offset: 0.625 },
        { direction: "0001", beat: 4, offset: 0.75 },
        { direction: "2002", beat: 4, offset: 1 },
        { direction: "1000", beat: 8, offset: 1.625 },
        { direction: "1000", beat: 4, offset: 1.75 },
      ]);

      expect(freezes).toEqual([
        { direction: 3, startOffset: 0, endOffset: 0.625 },
        { direction: 0, startOffset: 0, endOffset: 1 },
        { direction: 0, startOffset: 1, endOffset: 1.625 },
        { direction: 3, startOffset: 1, endOffset: 2 },
      ]);
    });
  });
});
