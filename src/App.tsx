import { useState, useEffect } from "react";
import "./App.css";
import { prepareData } from "./searchEngine/dataPrep";
import KsInputSelection from "./searchEngine/KsInputSelection";
import type { DrugData } from "./type/datas.d";

function App() {
	const data = prepareData("prod");
	console.log("called preparedData", data);

	return (
		<div>
			<InputArea data={data} />
		</div>
	);
}

function InputArea({ data }: { data: DrugData[] }) {
	return (
		<div>
			<div>
				<div>
					<KsInputSelection data={data} />
				</div>
			</div>
		</div>
	);
}

export default App;
