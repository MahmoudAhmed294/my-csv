import React, { useEffect, useState } from "react";
import "./App.css";
import { CSVDownload, CSVLink } from "react-csv";

function App() {
  const [file, setFile] = useState<any>();
  const [data, setData] = useState([]);
  const [fileAverage, setFileAverage] = useState<any>([]);
  const [mostPopular, setMostPopular] = useState<any>([]);

  const fileReader = new FileReader();

  const handleOnChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = (value: string) => {
    // console.log(value.slice(value.indexOf("\n")+1 ).split("\n"));

    const csvHeader = value.slice(0, value.indexOf("Brand") + 5).split(",");
    const csvRows = value
      .slice(value.indexOf("\n") + 1)
      .replace("\r", "")
      .split("\n");

    const ExelData: any = csvRows.map((i) => {
      const rows = i.split(",");
      const obj = csvHeader.reduce((object: any, header, index) => {
        object[header] = rows[index];
        return object;
      }, {});
      return obj;
    });

    setData(ExelData);
  };

  const handleOnSubmit = (e: any) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (e: any) {
        const text = e.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(file);
    }
  };

  useEffect(() => {
    const objAverage: any = {};
    const objMostPopular: any = {};
    console.log(data);

    data.map(
      (value: any) =>
        (objAverage[value.Name] =
          +value.Quantity +
          (objAverage[value.Name] ? objAverage[value.Name] : 0))
    );
    const AverageKeys = Object.keys(objAverage);
    setFileAverage(
      AverageKeys.map((value) => [value, objAverage[value] / data.length])
    );
    //
    data.map(
      (value: any) =>
        (objMostPopular[value.Name] =
          1 + (objMostPopular[value.Name] ? objMostPopular[value.Name] : 0))
    );
    const MostPopularKeys = Object.keys(objMostPopular);
    const MostPopularValues: number[] = Object.values(objMostPopular);
    const MostPopularProduct = MostPopularKeys.filter(
      (key, index) => objMostPopular[key] === MostPopularValues[index]
    );
    const countItemOne: any = {};
    const countItemTwo: any = {};

    data
      .filter((value: any) => value.Name === MostPopularProduct[0])
      .map((value: any) => value.Brand.replace("\r", ""))
      .forEach((element: number) => {
        countItemOne[element] = (countItemOne[element] || 0) + 1;
      }),
      data
        .filter((value: any) => value.Name === MostPopularProduct[1])
        .map((value: any) => value.Brand.replace("\r", ""))
        .forEach((element: number) => {
          countItemTwo[element] = (countItemTwo[element] || 0) + 1;
        });

    const MostPopularBrandOne = Object.keys(countItemOne).find(
      (key) => countItemOne[key] === Math.max(...Object.values(countItemOne))
    );
    const MostPopularBrandTwo = Object.keys(countItemTwo).find(
      (key) => countItemTwo[key] === Math.max(...Object.values(countItemTwo))
    );

    setMostPopular([
      [MostPopularKeys[0], MostPopularBrandOne],
      [MostPopularKeys[1], MostPopularBrandTwo],
    ]);
  }, [data]);

  return (
    <div className="App">
      <div style={{ textAlign: "center" }}>
        <h1>CSV IMPORT</h1>
        <form>
          <input
            type={"file"}
            id={"csvFileInput"}
            accept={".csv"}
            onChange={handleOnChange}
          />

          <button
            onClick={(e) => {
              handleOnSubmit(e);
            }}
          >
            IMPORT CSV
          </button>
        </form>
        {fileAverage.length !== 0 && mostPopular.length !== 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 24,
              marginTop: 32,
            }}
          >
            <CSVLink
              data={fileAverage}
              enclosingCharacter={`'`}
              filename={`0_${file?.name}`}
            >
              Download {`0_${file?.name}`}
            </CSVLink>
            <CSVLink
              data={mostPopular}
              enclosingCharacter={`'`}
              filename={`1_${file?.name}`}
            >
              Download {`1_${file?.name}`}
            </CSVLink>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
export default App;
