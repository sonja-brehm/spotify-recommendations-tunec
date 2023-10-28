/* The code in this file is from GitHub user judygab (2022), repository "web-dev-projects",
Available at: https://github.com/judygab/web-dev-projects/blob/main/react-form/src/components/MultiStepProgressBar.js (Accessed 01. August 2023)

The code was modified to also include text descriptions underneath each step.
*/

import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import "./StepProgressBar.css";

export const StepProgressBar = (props) => {
  return (
    <ProgressBar
      percent={((props.step - 1) * 100) / 3}
      filledBackground="#191919"
      unfilledBackground="#D7D7D7"
      width="600px"
    >
      {/*create each step (1-4) with the step number and the description*/}
      <Step>
        {({ accomplished }) => (
          <div className="wrapper">
            <div className={`step ${accomplished ? "completed" : null}`}>1</div>
            <div className={`description ${accomplished ? "completed" : null}`}>
              Connect your Spotify
            </div>
          </div>
        )}
      </Step>

      <Step>
        {({ accomplished }) => (
          <div className="wrapper">
            <div className={`step ${accomplished ? "completed" : null}`}>
              2{" "}
            </div>
            <div className={`description ${accomplished ? "completed" : null}`}>
              Choose tracks
            </div>
          </div>
        )}
      </Step>
      <Step>
        {({ accomplished }) => (
          <div className="wrapper">
            <div className={`step ${accomplished ? "completed" : null}`}>3</div>
            <div className={`description ${accomplished ? "completed" : null}`}>
              Choose preferences
            </div>
          </div>
        )}
      </Step>
      <Step>
        {({ accomplished }) => (
          <div className="wrapper">
            <div className={`step ${accomplished ? "completed" : null}`}>4</div>
            <div className={`description ${accomplished ? "completed" : null}`}>
              Browse recommendations
            </div>
          </div>
        )}
      </Step>
    </ProgressBar>
  );
};

