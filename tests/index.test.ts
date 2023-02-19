import { expect, it, describe, expectTypeOf } from "vitest";
import { Road } from "../src/classes/Road";

describe("general things", () => {
  it("What", () => {
    const road = new Road(40, 5, 20);
    const straightLtoR = road.createTile({from: "left", to: "right"}, [0, 0]);
    const straightRtoL = road.createTile({from: "right", to: "left"}, [10, 10]);
    const straightTtoB = road.createTile({from: "top", to: "bottom"}, [20, 20]);
    const straightBtoT = road.createTile({from: "bottom", to: "top"}, [30, 30]);

	const curveLtoT = road.createTile({from: "right", to: "top"}, [40, 40]);
	const curveRtoT = road.createTile({from: "right", to: "top"}, [50, 50]);
	const curveLtoB = road.createTile({from: "left", to: "bottom"}, [60, 60]);
	const curveRtoB = road.createTile({from: "right", to: "bottom"}, [70, 70]);

    expect(straightLtoR.lines[0].constant).toBe(0);
    expect(straightRtoL.lines[0].constant).toBe(0);
    expect(straightTtoB.lines[0].constant).toBe(0);
    expect(straightBtoT.lines[0].constant).toBe(0);
    expect(straightLtoR.lines[1].constant).toBe(0);
    expect(straightRtoL.lines[1].constant).toBe(0);
    expect(straightTtoB.lines[1].constant).toBe(0);
    expect(straightBtoT.lines[1].constant).toBe(0);

	expect(straightLtoR.lines[0].slope).toBe(0);
	expect(straightRtoL.lines[0].slope).toBe(0);
	expect(straightTtoB.lines[0].slope).toBe(0);
	expect(straightBtoT.lines[0].slope).toBe(0);
	expect(straightLtoR.lines[1].slope).toBe(0);
	expect(straightRtoL.lines[1].slope).toBe(0);
	expect(straightTtoB.lines[1].slope).toBe(0);
	expect(straightBtoT.lines[1].slope).toBe(0);

	expect(straightLtoR.lines[0].startingPoint).toEqual([0, 10]);
	expect(straightLtoR.lines[0].endingPoint).toEqual([40, 10]);
	expect(straightLtoR.lines[1].startingPoint).toEqual([0, 30]);
	expect(straightLtoR.lines[1].endingPoint).toEqual([40, 30]);

	expect(straightRtoL.lines[0].startingPoint).toEqual([10, 20]);
	expect(straightRtoL.lines[0].endingPoint).toEqual([50, 20]);
	expect(straightRtoL.lines[1].startingPoint).toEqual([10, 40]);
	expect(straightRtoL.lines[1].endingPoint).toEqual([50, 40]);

	expect(straightTtoB.lines[0].startingPoint).toEqual([30, 60]);
	expect(straightTtoB.lines[0].endingPoint).toEqual([30, 20]);
	expect(straightTtoB.lines[1].startingPoint).toEqual([50, 60]);
	expect(straightTtoB.lines[1].endingPoint).toEqual([50, 20]);

	expect(straightBtoT.lines[0].startingPoint).toEqual([40, 70]);
	expect(straightBtoT.lines[0].endingPoint).toEqual([40, 30]);
	expect(straightBtoT.lines[1].startingPoint).toEqual([60, 70]);
	expect(straightBtoT.lines[1].endingPoint).toEqual([60, 30]);

	expect(curveLtoT.lines[0].startingPoint).toEqual([50, 40]);
	expect(curveLtoT.lines[9].endingPoint).toEqual([80, 50]);

	expect(curveRtoT.lines[0].startingPoint).toEqual([60, 50]);
	expect(curveRtoT.lines[9].endingPoint).toEqual([90, 60]);

	expect(curveLtoB.lines[0].startingPoint).toEqual([90, 100]);
	expect(curveLtoB.lines[9].endingPoint).toEqual([60, 90]);

	expect(curveRtoB.lines[0].startingPoint).toEqual([80, 110]);
	expect(curveRtoB.lines[9].endingPoint).toEqual([110, 100]);
  });
});
