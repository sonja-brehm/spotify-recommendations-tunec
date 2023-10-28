import "./StepsHeader.css";
import { StepProgressBar } from "../StepProgressBar/StepProgressBar.js";
import { Logo } from '../index.js';

const StepsHeader = (props) => {
 //create a component with the logo and the progress bar
  return (
    <div className="stepsheader">
      <Logo />
      <div className="stepsheader__progressbar">
        <StepProgressBar step={props.step} />
      </div>
    </div>
  );
};

export default StepsHeader;