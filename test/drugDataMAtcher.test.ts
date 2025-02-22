import {
	describe,
	test,
	expect,
} from "vitest";

import { DrugDataMatcher } from "../src/searchEngine/drugDataMatcher";
import { prepareData } from "../src/searchEngine/dataPrep";

describe("DrugDataMatcher", () => {
	let matcher: DrugDataMatcher;
	const data = prepareData("test");
	test("半角数字", () => {
		matcher = new DrugDataMatcher(data);

		const normalized = matcher.normalizeQuery("４");
		expect(normalized).toBe("4");
	});

	test("matchingCore should filter data based on query", () => {
		matcher = new DrugDataMatcher(data);

		matcher.ex_matchingCore(data, "フス");
		expect(matcher.selectedDatas).toEqual([
			{ id: 0, val: "フスコデ配合シロップ" },
		]);
	});

	test("matchingCore should handle no matches", () => {
		matcher = new DrugDataMatcher(data);

		matcher.ex_matchingCore(data, "NonExistentDrug");
		expect(matcher.selectedDatas).toEqual([]);
	});

	test("半角数字", () => {
		matcher = new DrugDataMatcher(data);
		matcher.ex_matchingCore(data, "4");
		expect(matcher.selectedDatas.length).toBe(4);
		expect(matcher.selectedDatas).toEqual([
			{ id: 99, val: "ラシックス錠40mg" },
			{ id: 19, val: "アジルサルタン錠40mg「JG」" },
			{ id: 44, val: "フェブキソスタット錠40mg「トーワ」" },
			{ id: 6, val: "ピタバスタチンカルシウム錠4mg「KOG」" },
		]);
	});
	test("全角数字", () => {
		matcher = new DrugDataMatcher(data);

		matcher.ex_matchingCore(data, "４");
		expect(matcher.selectedDatas.length).toBe(4);
		expect(matcher.selectedDatas).toEqual([
			{ id: 99, val: "ラシックス錠40mg" },
			{ id: 19, val: "アジルサルタン錠40mg「JG」" },
			{ id: 44, val: "フェブキソスタット錠40mg「トーワ」" },
			{ id: 6, val: "ピタバスタチンカルシウム錠4mg「KOG」" },
		]);
	});
	test("name+number{ id: 99, val: 'ラシックス錠40mg' } ", () => {
		matcher = new DrugDataMatcher(data);
		matcher.ex_matchingCore(data, "ラシ4");
		expect(matcher.selectedDatas).toEqual([]);
	});

	test("key word is ラシ", () => {
		matcher = new DrugDataMatcher(data);
		matcher.matchingbyEachCharactor("ラシ");
		expect(matcher.selectedDatas).toEqual([
			{ id: 99, val: "ックス錠40mg" },
			{ id: 38, val: "クロビル錠500mg「アメル」" },
			{ id: 88, val: "ロップ用" },
		]);
	});
	test("key word is ラシ4", () => {
		matcher = new DrugDataMatcher(data);
		matcher.matchingbyEachCharactor("ラシ4");
		expect(matcher.selectedDatas).toEqual([{ id: 99, val: "0mg" }]);
	});

	test("エチゾ at エチゾラム１mg「DSEP,アメル、NIG」", () => {
		matcher = new DrugDataMatcher(data);
		matcher.matchingbyEachCharactor("エチゾ");
		expect(matcher.selectedDatas).toEqual([
			{ id: 56, val: "ラム錠1mg「DSEP」" },
			{ id: 57, val: "ラム錠1mg「アメル」" },
			{ id: 72, val: "ラム錠1mg「NIG」" },
		]);
	});
	test("normalizeQuery", () => {
		const normalized = matcher.normalizeQuery("エチゾ1「D");
		expect(normalized).toBe("エチゾ1「D");
	});
	test("1D at エチゾラム１mg「DSEP,アメル、NIG」", () => {
		matcher = new DrugDataMatcher(data);
		matcher.matchingbyEachCharactor("1D");
		expect(matcher.selectedDatas.length).toBe(1);
		expect(matcher.selectedDatas).toEqual([{ id: 56, val: "SEP」" }]);
	});
	test("エチゾD at エチゾラム１mg「DSEP,アメル、NIG」", () => {
		matcher = new DrugDataMatcher(data);
		matcher.matchingbyEachCharactor("エチゾD");
		expect(matcher.selectedDatas.length).toBe(1);
		expect(matcher.selectedDatas).toEqual([{ id: 56, val: "SEP」" }]);
	});

	test("ドネペジル　3", () => {
		matcher = new DrugDataMatcher(data);
		matcher.matchingbyEachCharactor("ドネ3");
		expect(matcher.selectedDatas.length).toBe(2);
		expect(matcher.selectedDatas).toEqual([
			{ id: 32, val: "mg錠「DSEP」" },
			{ id: 16, val: "mg「ケミファ」" },
		]);
	});

	test("ドネペジル　3d", () => {
		matcher = new DrugDataMatcher(data);
		matcher.matchingbyEachCharactor("ドネ3d");
		expect(matcher.selectedDatas.length).toBe(1);
		expect(matcher.selectedDatas).toEqual([{ id: 32, val: "SEP」" }]);
	});
}); // end of describe
