/* The code in this file is from Feroz Mujawar on codesandbox, username: FrzSandbox,
link: https://codesandbox.io/s/multi-range-slider-react-js-forked-3b5n0?file=/src/component/multiRangeSlider/MultiRangeSlider.js
(Accessed: 10 August 2023)

I slightly modified it by deleting some lines of code that weren't necessary for my use case.
In addition, I added the "step" variable to set the step size & added selectedMinValue + selectedMaxValue to save the perviously selected values.
*/

import { useEffect, useState, useRef} from "react";
import "./RangeSlider.css";

const RangeSlider = ({ sliderDescriptionLeft = "low", sliderDescriptionRight = "high", onChange, min = 0, max = 100, selectedMinValue, selectedMaxValue, sliderKey, collectClickCounts }) => {
const step = 5;


  const [minVal, setMinVal] = useState(selectedMinValue);
  const [maxVal, setMaxVal] = useState(selectedMaxValue);
  const minValRef = useRef(selectedMinValue);
  const maxValRef = useRef(selectedMaxValue);
  const range = useRef(null);

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (range.current) {
        range.current.style.left = `${minVal}%`;
        range.current.style.width = `${maxValRef.current - minVal}%`;
      }
  }, [minVal]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
      if (range.current) {
        range.current.style.width = `${maxVal - minValRef.current}%`;
      }
  }, [maxVal]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);


  // Count how many times the slider thumb was clicked
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    if (collectClickCounts) { //only count the clicks if the function is passed as a prop
    setClickCount(clickCount + 1);
    collectClickCounts(sliderKey, clickCount + 1);
    }
  };

  return (
    <>

    <div className="slider">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        step={step}
        onPointerDown={handleClick}
        onChange={(event) => {
          const value = Math.min(
            Math.round(Number(event.target.value) / step) * step,
            maxVal - step
          );
          setMinVal(value);
          minValRef.current = value;
        }}
        className="thumb thumb--left"
        style={{ zIndex: minVal > max - 100 && "5" }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        step={step}
        onPointerDown={handleClick}
        onChange={(event) => {
          const value = Math.max(
            Math.round(Number(event.target.value) / step) * step,
            minVal + step
          );
          setMaxVal(value);
          maxValRef.current = value;
        }}
        className="thumb thumb--right"
      />
      <div className="slider__track-container">
      <div className="slider__track" />
      <div ref={range} className="slider__range" />
      </div>
    </div>

    {/* The following code was added by me */}
    <div className="description">
    <div className="description_low"> {sliderDescriptionLeft} </div>
    <div className="slider__values">
    <div>{minVal}% –</div>
        <div>{maxVal}%</div>
        </div>
    <div className="description__high"> {sliderDescriptionRight} </div>
    </div>
    </>
  );
};

export default RangeSlider;
