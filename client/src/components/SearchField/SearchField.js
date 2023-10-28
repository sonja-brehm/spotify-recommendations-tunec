import { PiMagnifyingGlassBold } from "react-icons/pi";
import "./SearchField.css";

const SearchField = ({ searchInput, searchResults, handleSearchInputChange, handleTrackClick, placeholderText="Search for a song title..." }) => {
  return (
    <div className="searchField">
      <div className="searchField__field">
        <PiMagnifyingGlassBold size={20} />
        <input
          type="text"
          placeholder={placeholderText}
          value={searchInput}
          onChange={handleSearchInputChange}
        />
      </div>
      {/*when there is content in searchResults, show the following*/
      searchResults && (
        <div className="searchField__overlay">
          <div className="searchField__results">
            {searchResults.map((track) => (
              <div key={track.id} className="searchField__track" onClick={() => handleTrackClick(track)}>
                <p className="searchField__track-title">{track.name}</p>
                <p className="searchField__track-artist">{track.artists[0].name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
  );
};

export default SearchField;
