import {
	describe,
	test,
	expect,
} from "vitest";


import { DrugDataMatcher } from "../src/searchEngine/drugDataMatcher";
import { prepareData } from "../src/searchEngine/dataPrep";

describe("DrugDataMatcher for prod", () => {
	let matcher: DrugDataMatcher;
	const data = prepareData("prod");
	
	test("半角数字", () => {
		matcher = new DrugDataMatcher(data);

		const normalized = matcher.normalizeQuery("４");
		expect(normalized).toBe("4");
	});


	test("へ問題", ()=>{
		matcher = new DrugDataMatcher(data);
		const norm = matcher.normalizeQuery("へんたい");
		expect(norm).toBe("ヘンタイ");
	});

	test("へ問題", ()=>{
		matcher = new DrugDataMatcher(data);
		const norm = matcher.normalizeQuery("どねぺ");
		expect(norm).toBe("ドネぺ");
	});

	test('ドネぺ問題、あるいはへとヘの問題,カタカナのへの場合', () => {
		matcher = new DrugDataMatcher(data);

		matcher.matchingbyEachCharactor("ドネペ");
		expect(matcher.selectedDatas.length).toBe(123);

	});
	
	test('ドネぺ問題、あるいはへとヘの問題,ひらがなのへの場合', () => {
		matcher = new DrugDataMatcher(data);

		matcher.matchingbyEachCharactor("ドネぺ");
		expect(matcher.selectedDatas.length).toBe(0);

	});

	test('オルメ', ()=> {
		matcher = new DrugDataMatcher(data);

		matcher.matchingbyEachCharactor("オルメ");
		expect(matcher.selectedDatas.length).toBe(33);

	});
	test('オルメ10', ()=> {
		matcher = new DrugDataMatcher(data);

		matcher.matchingbyEachCharactor("オルメ10");
		expect(matcher.selectedDatas.length).toBe(9);

	});

}); // end of describe