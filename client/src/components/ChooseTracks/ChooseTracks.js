import "./ChooseTracks.css";
import { useState, useEffect } from "react";
import { catchErrors } from "../../utils";
import { getTopTracks, performSearch } from "../../spotify";
import { SearchTrack, SelectedTracks, TopTracks } from "./ChildComponents";

const ChooseTracks = ({ selectedTracks, onSelectedTracksChange }) => {
  //Variables to store the most played tracks
  const [topTracks, setTopTracks] = useState(null); // State variable to store the top tracks
  const [activeRange, setActiveRange] = useState("short"); //time frame for top tracks: short, medium or long term

  //Variables to store the search input & results
  const [searchInput, setSearchInput] = useState(""); // to store the user's input into the search field
  const [searchResults, setSearchResults] = useState(null); // to store the search results

  /** The following code, until the 'end of citation' comment, is from a tutorial by Brittany Chiang (2021) on Newline.co, 'Build a Spotify Connected App'.
  Available at: https://www.newline.co/courses/build-a-spotify-connected-app **/
  //get top tracks for the chosen time frame (activeRange) from Spotify API
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getTopTracks(`${activeRange}_term`);
      setTopTracks(data);
    };
    catchErrors(fetchData());
  }, [activeRange]); /** End of Citation **/


  /** NOTE: The following code, until the end comment, was written with the help of ChatGPT **/

  //Onclick function when the user clicks on a track to select it
  const handleTrackClick = (track) => {
    // Check if the track is already selected, based on the track id
    const isTrackSelected = selectedTracks.find(
      (selectedTrack) => selectedTrack.id === track.id
    );

    if (!isTrackSelected) {
      // If the track was not previously selected, add it to the selectedTracks array
      const updatedTracks = [...selectedTracks, track];
      onSelectedTracksChange(updatedTracks);
      setSearchInput(""); // Clear the search input (-> overlay closes)
    }
  };

  //Onclick function to remove a track from the selected tracks
  const handleSelectedTrackClick = (track) => {
    // Remove the track from the selectedTracks array
    const updatedTracks = selectedTracks.filter(
      (selectedTrack) => selectedTrack.id !== track.id
    );
    onSelectedTracksChange(updatedTracks);
  };

  // Function to update the search input
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  // Fetch search results based on the user's input
  useEffect(() => {
    // Only fetch results if there's a search input
    if (searchInput) {
      const fetchData = async () => {
        const { data } = await performSearch(searchInput);
        setSearchResults(data.tracks.items); // Save only the 'items' property in searchResults
      };
      catchErrors(fetchData());
    } else {
      // If search input is empty, clear the results
      setSearchResults(null);
    }
  }, [searchInput]);

  // Close the search results overlay when the user clicks outside of it
      useEffect(() => {
        // Add a click event listener to the entire document
        const handleClickOutside = (event) => {
          const field = document.querySelector(".searchField");
          // Check if the click target is not within the overlay or input field
          if (
            field &&
            !field.contains(event.target)
          ) {
            setSearchInput(""); // Clear the search input
          }
        };
        document.addEventListener("click", handleClickOutside);
        // Clean up the event listener when the component unmounts
        return () => {
          document.removeEventListener("click", handleClickOutside);
        };
    }, []);

  /** END of code written with ChatGPT **/

  return (
    <div className="chooseTracks__grid-container">
      <div className="chooseTracks__main1">
        <SearchTrack
          searchInput={searchInput}
          searchResults={searchResults}
          handleSearchInputChange={handleSearchInputChange}
          handleTrackClick={handleTrackClick}
        />
      </div>

      <div className="chooseTracks__main2">
        <SelectedTracks
          selectedTracks={selectedTracks}
          handleSelectedTrackClick={handleSelectedTrackClick}
        />
      </div>

      <div className="chooseTracks__main3">
        <TopTracks
          activeRange={activeRange}
          setActiveRange={setActiveRange}
          topTracks={topTracks}
          handleTrackClick={handleTrackClick}
        />
      </div>
    </div>
  );
};

export default ChooseTracks;
