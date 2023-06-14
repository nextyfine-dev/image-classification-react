import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdFileUpload, MdImage } from "react-icons/md";
import Zoom from "react-medium-image-zoom";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as nsfwjs from "nsfwjs";
import Header from "./components/Header";
import { Predictions } from "./types";
import { getValuesArrayObj, isValidArray } from "./services";
import { ResponsiveTable } from "./components/Common";
import "react-medium-image-zoom/dist/styles.css";

function App() {
  const img = useRef<HTMLImageElement>(null);

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [analyzeData, setAnalyzeData] = useState<number | null>(null);
  const [predictions, setPredictions] = useState<Predictions[] | null>(null);
  const [nsfwPredictions, setNsfwPredictions] = useState<
    nsfwjs.predictionType[] | null
  >(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback((acceptedFiles: File[]) => {
      setImgSrc(URL.createObjectURL(acceptedFiles[0]));
    }, []),
  });

  const tableHead = ["Prediction", "Probability"];

  const initializeBackend = async () => {
    try {
      setAnalyzeData(1);
      await tf.setBackend("webgl");
      await tf.ready();
      await classifyImage();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (imgSrc && img) {
      initializeBackend();
    }

    if (predictions && nsfwPredictions) {
      setPredictions(null);
      setNsfwPredictions(null);
    }

    return () => {
      tf.dispose();
    };
  }, [imgSrc]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (analyzeData !== null && analyzeData < 100) {
      intervalId = setInterval(() => {
        setAnalyzeData((prevData) => {
          if (prevData === 100) {
            clearInterval(intervalId);
            return null;
          }
          return prevData && prevData + 1;
        });
      }, 55);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [analyzeData]);

  const classifyImage = async () => {
    try {
      const model = await mobilenet.load();
      const nsfwModel = await nsfwjs.load();

      const imageElement = img.current;
      if (imageElement) {
        const predictions: Predictions[] = await model.classify(imageElement);
        const nsfwPredictions = await nsfwModel.classify(imageElement);

        if (isValidArray(predictions) && isValidArray(nsfwPredictions)) {
          console.log("nsfwPredictions :>> ", nsfwPredictions);

          setPredictions(predictions);
          setNsfwPredictions(nsfwPredictions);
        }
      }

      setAnalyzeData(100);
      setTimeout(() => {
        setAnalyzeData(null);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen justify-center p-10">
        {!analyzeData && (
          <>
            <div
              {...getRootProps()}
              className="mx-auto border border-gray-200 dark:border-gray-800 max-w-3xl cursor-pointer shadow-lg my-10 rounded-md h-52 text-center justify-center items-center flex"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="flex p-5 border-gray-500 outline-dashed">
                  <MdImage size={30} />{" "}
                  <span className="text-lg">Drop the File here ...</span>
                </p>
              ) : (
                <p className="flex p-5 border-gray-500 outline-dashed">
                  <MdFileUpload size={30} />{" "}
                  <span className="text-lg">
                    Drag 'n' drop image here, or click to select image
                  </span>
                </p>
              )}
            </div>
          </>
        )}

        {imgSrc && (
          <div className="mx-auto max-w-2xl">
            <Zoom>
              <img src={imgSrc} width={"40%"} className="mx-auto" ref={img} />
            </Zoom>
          </div>
        )}

        {analyzeData && analyzeData <= 100 && (
          <div className="mx-auto max-w-2xl">
            <div className="flex justify-between mb-1">
              <span className="text-base font-medium text-blue-700 dark:text-white">
                Analyzing...
              </span>
              <span className="text-sm font-medium text-blue-700 dark:text-white">
                {analyzeData}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${analyzeData.toString()}%` }}
              ></div>
            </div>
          </div>
        )}

        {!analyzeData && predictions && nsfwPredictions && (
          <div className="mt-1 p-4 justify-center max-w-4xl mx-auto ">
            <div className="mx-auto mt-2 max-w-md text-center">
              <h3 className="mb-2">Normal Detection</h3>
              <ResponsiveTable
                tableHead={tableHead}
                tableData={getValuesArrayObj(predictions)}
              />
            </div>
            <div className="mx-auto mt-2 max-w-md text-center">
              <h3 className="mb-2">NSFW Detection</h3>
              <ResponsiveTable
                tableHead={tableHead}
                tableData={getValuesArrayObj(nsfwPredictions.slice(0, 3))}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
