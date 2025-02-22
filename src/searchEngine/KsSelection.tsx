import { useState, useRef, useEffect } from "react";
import type { DrugData } from "../type/datas";

interface SelectListProps {
	filteredList: DrugData[];
	selectedIndex: number;
	id?: string;
}

const SelectList = ({
	filteredList,
	selectedIndex,
	id = "drugList",
}: SelectListProps) => {
	// リストへの参照を作成
	const listRef = useRef<HTMLSelectElement>(null);

	useEffect(() => {
		if (listRef.current && filteredList.length > 0) {
			// selectの最初のoptionを選択状態にする
			listRef.current.selectedIndex = selectedIndex;
		}
	}, [filteredList, selectedIndex]); // filteredListが変更されたときに実行

	return (
		<select
			className="w-64 py-1 pl-3" // ボーダーの色を設定
			id={id}
			size={5}
			ref={listRef}
			onMouseDown={(e) => e.preventDefault()}
		>
			{filteredList.map((item) => (
				<option key={item.id} value={item.val}>
					{item.val}
				</option>
			))}
		</select>
	);
};

export default SelectList;
