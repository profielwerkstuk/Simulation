import { expect, it, describe, expectTypeOf } from "vitest";
import { Road } from "../src/classes/Road";

describe("general things", () => {
  it("roadTest", () => {
    const road = new Road(40, 5, 20);
    const straightLtoR = road.createTile("straight", [0, 0], "left", "right");
    const straightRtoL = road.createTile("straight", [0, 0], "right", "left");
    const straightTtoB = road.createTile("straight", [0, 0], "top", "bottom");
    const straightBtoT = road.createTile("straight", [0, 0], "bottom", "top");

	const curveLtoT = road.createTile("curve", [0, 0], "left", "top");
	const curveRtoT = road.createTile("curve", [0, 0], "right", "top");
	const curveLtoB = road.createTile("curve", [0, 0], "left", "bottom");
	const curveRtoB = road.createTile("curve", [0, 0], "right", "bottom");

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

	expect(straightRtoL.lines[0].startingPoint).toEqual([0, 10]);
	expect(straightRtoL.lines[0].endingPoint).toEqual([40, 10]);
	expect(straightRtoL.lines[1].startingPoint).toEqual([0, 30]);
	expect(straightRtoL.lines[1].endingPoint).toEqual([40, 30]);

	expect(straightTtoB.lines[0].startingPoint).toEqual([10, 40]);
	expect(straightTtoB.lines[0].endingPoint).toEqual([10, 0]);
	expect(straightTtoB.lines[1].startingPoint).toEqual([30, 40]);
	expect(straightTtoB.lines[1].endingPoint).toEqual([30, 0]);

	expect(straightBtoT.lines[0].startingPoint).toEqual([10, 40]);
	expect(straightBtoT.lines[0].endingPoint).toEqual([10, 0]);
	expect(straightBtoT.lines[1].startingPoint).toEqual([30, 40]);
	expect(straightBtoT.lines[1].endingPoint).toEqual([30, 0]);

	expect(curveLtoT.lines[0].startingPoint).toEqual([30, 0]);
	expect(curveLtoT.lines[4].endingPoint).toEqual([0, 30]);
	expect(curveLtoT.lines[5].startingPoint).toEqual([10, 0]);
	expect(curveLtoT.lines[9].endingPoint).toEqual([0, 10]);

	expect(curveRtoT.lines[0].startingPoint).toEqual([30, 0]);
	expect(curveRtoT.lines[4].endingPoint).toEqual([40, 10]);
	expect(curveRtoT.lines[5].startingPoint).toEqual([10, 0]);
	expect(curveRtoT.lines[9].endingPoint).toEqual([40, 30]);

	expect(curveLtoB.lines[0].startingPoint).toEqual([30, 40]);
	expect(curveLtoB.lines[4].endingPoint).toEqual([0, 10]);
	expect(curveLtoB.lines[5].startingPoint).toEqual([10, 40]);
	expect(curveLtoB.lines[9].endingPoint).toEqual([0, 30]);

	expect(curveRtoB.lines[0].startingPoint).toEqual([30, 40]);
	expect(curveRtoB.lines[4].endingPoint).toEqual([40, 30]);
	expect(curveRtoB.lines[5].startingPoint).toEqual([10, 40]);
	expect(curveRtoB.lines[9].endingPoint).toEqual([40, 10]);
  });
});
