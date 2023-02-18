import { expect, it, describe, expectTypeOf } from "vitest";
import { Road } from "../src/classes/Road";

describe("general things", () => {
  it("roadTest", () => {
    const road = new Road(40, 5, 20);
    const straightLtoR = road.createTile("straight", [0, 0], "left", "right");
    const straightRtoL = road.createTile("straight", [10, 10], "right", "left");
    const straightTtoB = road.createTile("straight", [20, 20], "top", "bottom");
    const straightBtoT = road.createTile("straight", [30, 30], "bottom", "top");

	const curveLtoT = road.createTile("curve", [40, 40], "left", "top");
	const curveRtoT = road.createTile("curve", [50, 50], "right", "top");
	const curveLtoB = road.createTile("curve", [60, 60], "left", "bottom");
	const curveRtoB = road.createTile("curve", [70, 70], "right", "bottom");

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

	expect(curveLtoT.lines[0].startingPoint).toEqual([70, 40]);
	expect(curveLtoT.lines[4].endingPoint).toEqual([40, 70]);
	expect(curveLtoT.lines[5].startingPoint).toEqual([50, 40]);
	expect(curveLtoT.lines[9].endingPoint).toEqual([40, 50]);

	expect(curveRtoT.lines[0].startingPoint).toEqual([80, 50]);
	expect(curveRtoT.lines[4].endingPoint).toEqual([90, 60]);
	expect(curveRtoT.lines[5].startingPoint).toEqual([60, 50]);
	expect(curveRtoT.lines[9].endingPoint).toEqual([90, 80]);

	expect(curveLtoB.lines[0].startingPoint).toEqual([90, 100]);
	expect(curveLtoB.lines[4].endingPoint).toEqual([60, 70]);
	expect(curveLtoB.lines[5].startingPoint).toEqual([70, 100]);
	expect(curveLtoB.lines[9].endingPoint).toEqual([60, 90]);

	expect(curveRtoB.lines[0].startingPoint).toEqual([100, 110]);
	expect(curveRtoB.lines[4].endingPoint).toEqual([110, 100]);
	expect(curveRtoB.lines[5].startingPoint).toEqual([80, 110]);
	expect(curveRtoB.lines[9].endingPoint).toEqual([110, 80]);
  });
});
