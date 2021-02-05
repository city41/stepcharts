import { parseSm } from "../parseSm";
import { RawStepchart } from "../parseStepchart";

describe("parseSm", () => {
  it("should parse basic tags in a stepchart", () => {
    const stepChart = `
#tITLE:KICK THE CAN;
#ARTIst:BUS★STOP;
#BANNER:KICK THE CAN.png;
#DISPLAYBPM:144.000;
#BPMs:0.000=144.043;`;

    const result = parseSm(stepChart, "test");

    expect(result.title).toEqual("KICK THE CAN");
    expect(result.artist).toEqual("BUS★STOP");
    expect(result.banner).toEqual("KICK THE CAN.png");
    expect(result.bpm).toEqual([144]);
  });

  describe("bpm", () => {
    it("should parse multiple bpms", () => {
      const stepchart = `#bpms:0=10,10=100,20=300,30=10;`;

      const result = parseSm(stepchart, "test");
      expect(result.bpm).toEqual([10, 100, 300]);
    });

    it("should ignore the 1bpm hacks", () => {
      const stepchart = `#bpms:0=10,10=100,1=99,30=10;`;

      const result = parseSm(stepchart, "test");
      expect(result.bpm).toEqual([10, 100]);
    });

    it("should sort bpms lowest to highest", () => {
      const stepchart = `#bpms:0=400,10=100,30=300;`;

      const result = parseSm(stepchart, "test");
      expect(result.bpm).toEqual([100, 300, 400]);
    });
  });

  describe("#notes", () => {
    function parse(notes: string): RawStepchart {
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

    it("should parse out the difficulty and feet", () => {
      const stepchart = `#NOTES:
     dance-single:
     :
     Beginner:
     5:
     :
,
`;

      const result = parseSm(stepchart, "test");

      expect(result.availableTypes).toEqual([
        {
          difficulty: "beginner",
          feet: 5,
          mode: "single",
          slug: "single-beginner",
        },
      ]);
    });

    it("should parse out a quarter beat measure", () => {
      const notes = `1000
0000
0100
0000`;
      const result = parse(notes);

      expect(result.arrows["single-beginner"].arrows).toEqual([
        { beat: 4, direction: "1000", measureBeatHeight: 4 },
        { beat: 4, direction: "0000", measureBeatHeight: 4 },
        { beat: 4, direction: "0100", measureBeatHeight: 4 },
        { beat: 4, direction: "0000", measureBeatHeight: 4 },
      ]);
    });

    it("should parse out an eighth beat measure", () => {
      const notes = `1000
0100
0001
0100
1000
0100
0001
0100`;

      const result = parse(notes);

      expect(result.arrows["single-beginner"].arrows).toEqual([
        { beat: 4, direction: "1000", measureBeatHeight: 8 },
        { beat: 8, direction: "0100", measureBeatHeight: 8 },
        { beat: 4, direction: "0001", measureBeatHeight: 8 },
        { beat: 8, direction: "0100", measureBeatHeight: 8 },
        { beat: 4, direction: "1000", measureBeatHeight: 8 },
        { beat: 8, direction: "0100", measureBeatHeight: 8 },
        { beat: 4, direction: "0001", measureBeatHeight: 8 },
        { beat: 8, direction: "0100", measureBeatHeight: 8 },
      ]);
    });

    it("should parse a sixth note measure correctly", () => {
      // X, Afronova Special, very end of the song
      const notes = `1001
0110
1100
0101
0011
1010`;

      const result = parse(notes);
      expect(result.arrows["single-beginner"].arrows).toEqual([
        { beat: 4, direction: "1001", measureBeatHeight: 6 },
        { beat: 6, direction: "0110", measureBeatHeight: 6 },
        { beat: 6, direction: "1100", measureBeatHeight: 6 },
        { beat: 4, direction: "0101", measureBeatHeight: 6 },
        { beat: 6, direction: "0011", measureBeatHeight: 6 },
        { beat: 6, direction: "1010", measureBeatHeight: 6 },
      ]);
    });

    it.only("should parse freeze arrows in a 24th beat measure correctly", () => {
      // X, Saber Wing Headshot Mix, challenge, second LR freeze in the chart
      const notes = `0001
0000
0000
0000
0000
0000
2002
0000
0000
0000
0000
0000
3003
0000
0000
0100
0000
0000
0010
0000
0001
0000
0100
0000`;

      const result = parse(notes);

      console.log(
        JSON.stringify(result.arrows["single-beginner"].freezes, null, 2)
      );

      expect(result.arrows["single-beginner"].arrows).toEqual([
        {
          direction: "0001",
          beat: 4,
          measureBeatHeight: 24,
        },
        {
          direction: "0000",
          beat: 6,
          measureBeatHeight: 24,
        },
        {
          direction: "0000",
          beat: 12,
          measureBeatHeight: 24,
        },
        {
          direction: "0000",
          beat: 8,
          measureBeatHeight: 24,
        },
        {
          direction: "0000",
          beat: 6,
          measureBeatHeight: 24,
        },
        {
          direction: "0000",
          beat: 6,
          measureBeatHeight: 24,
        },
        {
          direction: "2002",
          beat: 4,
          measureBeatHeight: 24,
        },
        {
          direction: "0000",
          beat: 6,
          measureBeatHeight: 24,
        },
        {
          direction: "0000",
          beat: 6,
          measureBeatHeight: 24,
        },
        {
          direction: "0000",
          beat: 8,
          measureBeatHeight: 24,
        },
        {
          direction: "0000",
          beat: 12,
          measureBeatHeight: 24,
        },
        {
          direction: "0000",
          beat: 6,
          measureBeatHeight: 24,
        },
        {
          direction: "0000",
          beat: 4,
          measureBeatHeight: 24,
        },
        {
          direction: "0000",
          beat: 6,
          measureBeatHeight: 24,
        },
        {
          direction: "0000",
          beat: 12,
          measureBeatHeight: 24,
        },
        {
          direction: "0100",
          beat: 8,
          measureBeatHeight: 24,
        },
        {
          direction: "0000",
          beat: 6,
          measureBeatHeight: 24,
        },
        {
          direction: "0000",
          beat: 6,
          measureBeatHeight: 24,
        },
        {
          direction: "0010",
          beat: 4,
          measureBeatHeight: 24,
        },
        {
          direction: "0000",
          beat: 6,
          measureBeatHeight: 24,
        },
        {
          direction: "0001",
          beat: 6,
          measureBeatHeight: 24,
        },
        {
          direction: "0000",
          beat: 8,
          measureBeatHeight: 24,
        },
        {
          direction: "0100",
          beat: 12,
          measureBeatHeight: 24,
        },
        {
          direction: "0000",
          beat: 6,
          measureBeatHeight: 24,
        },
      ]);

      expect(result.arrows["single-beginner"].freezes).toEqual([
        {
          direction: 0,
          startBeat: 0.25,
          endBeat: 0.75,
        },
        {
          direction: 3,
          startBeat: 0.25,
          endBeat: 0.75,
        },
      ]);
    });
  });
});
