import type { DrugData } from "../type/datas";
import testData from '../datas/demo_output.json'
import prodData from '../datas/Naifuku2025Jan07.json'

type DataSources = 'test' | 'prod';

const prepareData = (source: DataSources) => {
  const originData: DrugData[] = source === 'test' ? testData : prodData;  
  const data: DrugData[] = originData;
  const normalizedDatas: DrugData[] = data.map((d) => ({
    ...d,
    val: d.val.normalize("NFKC"),
  }));
  return normalizedDatas;
}

export { prepareData };