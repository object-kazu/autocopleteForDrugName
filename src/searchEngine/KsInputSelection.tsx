import { useState, useRef, useEffect } from "react";
import SelectList from "./KsSelection";
import type { DrugData } from "../type/datas";
import { DrugDataMatcher } from "./drugDataMatcher";

const KsInputSelection = ({ data }: { data: DrugData[] }) => {
	const [filteredList, setFilteredList] = useState<DrugData[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [searchTerm, setSearchTerm] = useState("");
	const [didEndComposition, setDidEndComposition] = useState(false);

	// copied message管理
	const [showCopied, setShowCopied] = useState(false);

	// input要素への参照を作成
	const inputRef = useRef<HTMLInputElement>(null);

	const drugData = data;
	const matcher = new DrugDataMatcher(drugData);

	// 検索を開始する最小文字数
	const minSearchLength = 3;

	// init
	useEffect(() => {
		setFilteredList(data);
		inputRef.current?.focus();
	}, [data]);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.trim().normalize("NFKC");
		setSearchTerm(value);

		console.log("input handler called ", value);
		if (value.length < minSearchLength) {
			setFilteredList([]);
			setIsOpen(false);
			return;
		}
		setIsOpen(true);
		matcher.matchingbyEachCharactor(value);
		setFilteredList(matcher.getResults());
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (isOpen && searchTerm.length >= minSearchLength) {
			setDidEndComposition(true);
		}
		if (!didEndComposition) {
			console.log("key down is ignored");
			return;
		}

		/**
     *  e.shiftKeyを使用して、Shiftキーが押されているかどうかを確認
        pKey === "Enter"でEnterキーが押されているかを確認
        両方の条件がtrueの場合のみhandleSiftEnter()が実行される
		pKey === "Enter" ＆＆ ”shift”では上手くいかない
     */

		if (
			e.key === "Enter" &&
			e.shiftKey &&
			searchTerm.length >= minSearchLength
		) {
			console.log("Enter+shift key is pressed");
			e.preventDefault();
			handleSiftEnter();
			return;
		}
		if (e.key === "Enter" && isOpen) {
			e.preventDefault();
			const selectedItem = filteredList[selectedIndex];

			if (selectedItem) {
				setSearchTerm(selectedItem.val);
				setIsOpen(false); // リストを閉じる
			}
		}
		if (isOpen && searchTerm.length >= minSearchLength) {
			// 上下キーの処理
			switch (e.key) {
				case "ArrowUp":
					e.preventDefault(); // デフォルトの動作を防止
					setSelectedIndex((prev) =>
						prev > 0 ? prev - 1 : filteredList.length - 1,
					);
					break;
				case "ArrowDown":
					e.preventDefault(); // デフォルトの動作を防止
					setSelectedIndex((prev) =>
						prev < filteredList.length - 1 ? prev + 1 : 0,
					);
					break;
				// 左右キーはデフォルトの動作（カーソル移動）を許可
				case "ArrowLeft":
				case "ArrowRight":
					break;
			}
		}
	};

	const handleSiftEnter = () => {
		navigator.clipboard
			.writeText(searchTerm)
			.then(() => {
				console.log("copy to clipboard");
				setShowCopied(true);
				setTimeout(() => {
					setShowCopied(false);
				}, 800);
				initInputField();
			})
			.catch((err) => {
				console.log("failed to copy to clipboard", err);
			});
	};

	const compositionEndHandler = (
		e: React.CompositionEvent<HTMLInputElement>,
	) => {
		console.log("composition end");
		setDidEndComposition(true);
		handleInput(e as unknown as React.ChangeEvent<HTMLInputElement>);
	};

	const initInputField = () => {
		setSearchTerm("");
		setFilteredList([]);
		setIsOpen(false);
	};

	return (
		<div className="absolute w-64 top-1 left-1/2 transform -translate-x-1/2 ">
			<label htmlFor="drugName" className="block mb-2">
				Put Drug Name
			</label>
			<div className="flex place-items-start">
				<input
					ref={inputRef}
					id="drugName"
					type="text"
					value={searchTerm}
					onChange={handleInput}
					onKeyDown={handleKeyDown}
					onCompositionEnd={compositionEndHandler}
					onCompositionStart={() => setDidEndComposition(false)}
					className="w-full px-3 py-2 border border-gray-300 rounded 
				focus:outline focus:outline-1 focus:outline-white"
					placeholder="入力してください"
				/>
				<div className="ml-2">
					{showCopied && <p className="text-green-200">copied!</p>}
				</div>
			</div>

			{isOpen && (
				<div className="absolute z-10 w-64 mt-1 bg-white border border-gray-300 rounded">
					<SelectList
						filteredList={filteredList}
						selectedIndex={selectedIndex}
					/>
				</div>
			)}
		</div>
	);
};

export default KsInputSelection;
