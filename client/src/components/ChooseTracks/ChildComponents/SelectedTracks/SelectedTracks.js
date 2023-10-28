import { PiXBold } from "react-icons/pi";
import "./SelectedTracks.css";

const SelectedTracks = ({ selectedTracks, handleSelectedTrackClick }) => {
  return (
    <div className="selectedTracks">
      <h3>Selected tracks</h3>
      {/*when no tracks are selected, show the following*/
      selectedTracks.length === 0 ? (
        <p className="p-grey">Nothing selected yet; please choose at least one song from the left to continue.</p>
      ) : ( /* otherwise, show the selected tracks */
        <div>
          {selectedTracks.map((track) => (
            <div key={track.id} className="selectedTracks__track">
              <p className="selectedTracks__track-title">{track.name}</p>
              <p className="selectedTracks__track-artist">{track.artists[0].name}</p>
              <div className="selectedTracks__icon" onClick={() => handleSelectedTrackClick(track)}>
                <PiXBold size={16} style={{ marginTop: "3px" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectedTracks;
