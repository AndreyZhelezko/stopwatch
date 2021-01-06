import React, { useState, useEffect } from "react";
import DisplayComponent from "./Components/DisplayComponent";
import BtnComponent from "./Components/BtnComponent";
import "./App.css";

function useDoubleClick(callback) {
  const [elem, setElem] = React.useState(null);
  const countRef = React.useRef(0);
  const timerRef = React.useRef(null);
  const inputCallbackRef = React.useRef(null);
  const callbackRef = React.useCallback((node) => {
    setElem(node);
    callbackRef.current = node;
  }, []);

  React.useEffect(() => {
    inputCallbackRef.current = callback;
  });

  React.useEffect(() => {
    function handler() {
      const isDoubleClick = countRef.current + 1 === 2;
      const timerIsPresent = timerRef.current;
      if (timerIsPresent && isDoubleClick) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        countRef.current = 0;
        if (inputCallbackRef.current) {
          inputCallbackRef.current();
        }
      }
      if (!timerIsPresent) {
        countRef.current = countRef.current + 1;
        const timer = setTimeout(() => {
          clearTimeout(timerRef.current);
          timerRef.current = null;
          countRef.current = 0;
        }, 300);
        timerRef.current = timer;
      }
    }
    if (elem) {
      elem.addEventListener("click", handler);
    }

    return () => {
      if (elem) {
        elem.removeEventListener("click", handler);
      }
    };
  }, [elem]);
  return [callbackRef, elem];
}

// function App() {

// 	return (
// 		<div className="test" ref={refCallback}>
// 			<span>Double click</span>
// 			<span>To color change</span>
// 		</div>
// 	);
// }

function App() {
  const [time, setTime] = useState({ ms: 0, s: 0, m: 0, h: 0 });
  const [intervId, setIntervId] = useState();
  const [status, setStatus] = useState(0);

  // const [refCallback, elem] = useDoubleClick(wait);

  let updatedMs = time.ms,
    updatedS = time.s,
    updatedM = time.m,
    updatedH = time.h;

  const updateTime = () => {
    if (updatedM === 60) {
      updatedH++;
      updatedM = 0;
    }
    if (updatedS === 60) {
      updatedM++;
      updatedS = 0;
    }
    if (updatedMs === 100) {
      updatedS++;
      updatedMs = 0;
    }

    updatedMs++;

    return setTime({ ms: updatedMs, s: updatedS, m: updatedM, h: updatedH });
  };

  const run = () => setIntervId(setInterval(updateTime, 10));

  const start = () => {
    updateTime();
    setStatus(1);
    run();
  };

  const stop = () => {
    clearInterval(intervId);
    setStatus(0);
    setTime({ ms: 0, s: 0, m: 0, h: 0 });
  };

  const reset = () => {
    setStatus(1);
    clearInterval(intervId);
    setTime({ ms: 0, s: 0, m: 0, h: 0 });
    setIntervId(null);
  };

  const wait = () => {
    clearInterval(intervId);
    setStatus(3);
  };

  const go = () => {
    start();
  };

  useEffect(() => {
    intervId === null && run();
  }, [intervId]);

  return (
    <div className="main-section">
      <div className="clock-holder">
        <div className="stopwatch">
          <DisplayComponent time={time} />
          <BtnComponent
            status={status}
            // refCallback={refCallback}
            go={go}
            wait={wait}
            reset={reset}
            stop={stop}
            start={start}
          />
        </div>
      </div>
      <ul className="TZlist">
        <li>
          «Start / Stop» - запуск / остановка отсчета времени, останавливает и
          обнуляет значение таймера.
        </li>
        <li>
          «Wait» - работает на двойной клик (время между нажатиями не более 300
          мс!) таймер должен прекратить отсчет времени; если после него нажать
          старт, то возобновляется отсчет.{" "}
          <span>(сделал времено при обычном клике)</span>
        </li>
        <li>
          «Reset» - сброс таймера на 0. Обнуляет таймер и снова начинает отсчет.
        </li>
      </ul>
    </div>
  );
}

export default App;
