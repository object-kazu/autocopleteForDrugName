import Fuse from "fuse.js";
import type { DrugData } from "../type/datas";

export class DrugDataMatcher {
	datas: DrugData[];
	selectedDatas: DrugData[];

	// fuse config
	options = {
		threshold: 0.3,
		minimalMatchCharLength: 2,
		keys: ["val"],
	};
	constructor(_datas: DrugData[]) {
		this.datas = _datas;
		this.selectedDatas = _datas;
	}
	public normalizeQuery(query: string): string {

		return query.normalize("NFKC");
	}
	public matchingbyEachCharactor(query: string) {
		
		console.log("data normalized", this.selectedDatas)

		const normalized = this.normalizeQuery(query);
		const chars = normalized.split("");
		for (const c of chars) {
			this.matchingCore(this.selectedDatas, c);
			this.selectedDatas = this.extractSuffixByKeyword(
				c,
				this.selectedDatas,
			);
		}
	}
	protected matchingCore(_data: DrugData[], query: string) {
		const normalized = this.normalizeQuery(query);
		const fuse = new Fuse(_data, this.options);
		this.selectedDatas = fuse.search(normalized).map((r) => r.item);
		console.log("1:selected data is", this.selectedDatas)
	}
	
	// テスト用の関数
	public ex_matchingCore(_data: DrugData[], query: string) {
		this.matchingCore(_data, query);
	}

	protected extractSuffixByKeyword(
		keyword: string,
		_datas: DrugData[],
	): DrugData[] {
		const normalized = this.normalizeQuery(keyword);
		
		// ここで、正規表現を使って、アルファベットのみかどうかを判定
		const isAlphabet = /^[a-zA-Z]+$/.test(normalized);

		return _datas.map((d) => {
			
			let newData= "";
			let index = -1;
			if (isAlphabet) {
				const normalizedLowerCase = normalized.toLowerCase();
				index = d.val.toLowerCase().indexOf(normalizedLowerCase);
				
			} else {
				index = d.val.indexOf(normalized);
			}
			if (index !== -1) {
				newData = d.val.substring(index + 1);
			} 

			return {
				...d,
				val: newData,
			};
		});
	}
	public getResults(): DrugData[] {
		console.log("selected data is", this.selectedDatas)
		const ansIndex = this.selectedDatas.map((d) => d.id);
		const ans = this.datas.filter((d) => ansIndex.includes(d.id));
		// 取り出しあとは、データを初期化する
		this.selectedDatas = this.datas;
		return ans;
	}
}


