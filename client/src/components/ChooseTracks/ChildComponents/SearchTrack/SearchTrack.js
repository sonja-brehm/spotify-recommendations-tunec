import { SearchField } from "../../../index.js"
import "./SearchTrack.css";

const SearchTrack = ({ searchInput, searchResults, handleSearchInputChange, handleTrackClick }) => {
  return (
    <div className="searchTrack">
      <h3>Search for a track</h3>
      <SearchField 
      searchInput={searchInput}
      searchResults={searchResults}
      handleSearchInputChange={handleSearchInputChange}
      handleTrackClick={handleTrackClick}/>
    </div>
  );
};

export default SearchTrack;
