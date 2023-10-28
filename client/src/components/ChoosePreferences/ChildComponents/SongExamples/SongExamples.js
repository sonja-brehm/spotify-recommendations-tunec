import "./SongExamples.css";
import { SongPreviewPlayer } from "../../../index.js";

const SongExamples = ({ examples, incrementPlayClicks }) => {
  return (
    <div>
      <p style={{marginTop:"4px"}}>Audio examples for different percentages:</p>
      <div className="song-examples">
        <div className="song-examples__line" />
        {examples.map((example, index) => (
          <div className="song-examples__button-container" key={index}>
            <p>{example.percentage}%</p>
            <SongPreviewPlayer songName={example.songName} songLink={example.songLink} incrementPlayClicks={incrementPlayClicks} />
          </div>
        ))}
      </div>
    </div>


  ); 
};

export default SongExamples;


