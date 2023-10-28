/* The code in this file was written with the help of ChatGPT */

import "./SongPreviewPlayer.css";
import { useState} from "react";
import playIcon from '../../images/icons/Play.svg';
import pauseIcon from '../../images/icons/Pause.svg';

const SongPreviewPlayer = ({ songName, songLink, tooltipActive=true, bgColor='#191919', incrementPlayClicks}) => {
    const [isPlaying, setIsPlaying] = useState(false);
  
    // onclick for the play/pause button
    const togglePlay = () => {
      if (!isPlaying) {
        // Increment the play click count
        incrementPlayClicks();
      }

      setIsPlaying((prevState) => !prevState);
    };

    // when the song ends, set isPlaying to false -> button changes back to play
    const handleAudioEnded = () => {
      setIsPlaying(false);
  };
  
    return (
        <div className="music-player">
          <button className="music-button" onClick={togglePlay} style={{backgroundColor: bgColor}}>
            {isPlaying ? <img src={pauseIcon} alt='Pause' style={{marginTop: "5px"}}/> : <img src={playIcon} style={{marginTop: "5px"}} alt='Play' />}
          </button>
          {tooltipActive && <div className="tooltip">{songName}</div>}
          {isPlaying && (
            <audio autoPlay onEnded={handleAudioEnded}>
              <source src={songLink} type="audio/mpeg" />
            </audio>
          )}
        </div>
      );
  };

  export default SongPreviewPlayer;