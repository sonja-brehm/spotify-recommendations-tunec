import "./SeedTracks.css";
import { PiXBold } from "react-icons/pi";
import { SearchField } from "../index.js";

const SeedTracks = ({
  searchInput,
  searchResults,
  handleSearchInputChange,
  handleTrackClick,
  tracks,
  deleteTrack,
}) => {
  return (
    <>
      <h3 className="recommendations_h-space-bottom">Seed Tracks</h3>
      <SearchField
        searchInput={searchInput}
        searchResults={searchResults}
        handleSearchInputChange={handleSearchInputChange}
        handleTrackClick={handleTrackClick}
        placeholderText="Search for a track to add..."
      />
      <div className="seed-tracks">
        {tracks.map((track) => (
          <div key={track.id} className="seed-tracks__track">
            <p className="seed-tracks__title">{track.name}</p>
            <p className="seed-tracks__artist">
              {track.artist}
            </p>
            <div
              className="seed-tracks__x-icon"
              onClick={() => deleteTrack(track)}
            >
              <PiXBold size={16} />
            </div>
          </div>
        ))}
      </div>
      </>
  );
};

export default SeedTracks;
