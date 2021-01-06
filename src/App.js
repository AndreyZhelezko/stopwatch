import React, { useState, useEffect } from "react";
import DisplayComponent from "./Components/DisplayComponent";
import BtnComponent from "./Components/BtnComponent";
import "./App.css";

function App() {
  const [time, setTime] = useState({ ms: 0, s: 0, m: 0, h: 0 });
  const [intervId, setIntervId] = useState();
  const [status, setStatus] = useState(0);
  // Not started = 0
  // started = 1
  // stopped = 2

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
  }, [intervId, run]);

  return (
    <div className="main-section">
      <div className="clock-holder">
        <div className="stopwatch">
          <DisplayComponent time={time} />
          <BtnComponent
            status={status}
            go={go}
            wait={wait}
            reset={reset}
            stop={stop}
            start={start}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
