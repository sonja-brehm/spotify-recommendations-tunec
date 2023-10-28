import { useLocation } from "react-router-dom";
import {
  getRecommendations,
  performSearch,
  saveTrackLibrary,
  deleteTrackLibrary,
} from "../../spotify";
import { useState, useEffect } from "react";
import { catchErrors } from "../../utils";
import {
  Logo,
  SongPreviewPlayer,
  SeedTracks,
  RangeSlider,
} from "../../components";
import heartUnfilled from "../../images/icons/HeartUnfilled.svg";
import heartFilled from "../../images/icons/HeartFilled.svg";

import "./Recommendations.css";

const Recommendations = () => {
  //get the data from the previous page
  const location = useLocation();
  const preferences = location.state.preferences;
  const [seedTracks, setSeedTracks] = useState(
    location.state.selectedTrackInfo
  );

  //to normalize the preference values from the range of 0-100% to the range of 0-1 before passing them to the API
  const normalizeValue = (value) => value / 100;

  //get values for all attributes
  const [minDanceability, setMinDanceability] = useState(normalizeValue(preferences.minDanceability));
  const [maxDanceability, setMaxDanceability] = useState(normalizeValue(preferences.maxDanceability));
  const [minEnergy, setMinEnergy] = useState(normalizeValue(preferences.minEnergy));
  const [maxEnergy, setMaxEnergy] = useState(normalizeValue(preferences.maxEnergy));
  const [minValence, setMinValence] = useState(normalizeValue(preferences.minValence));
  const [maxValence, setMaxValence] = useState(normalizeValue(preferences.maxValence));
  const [minPopularity, setMinPopularity] = useState(preferences.minPopularity);
  const [maxPopularity, setMaxPopularity] = useState(preferences.maxPopularity);

  //get the track ids and convert them to a string to pass along to the API query
  const [idString, setIdString] = useState(
    seedTracks.map((track) => track.id).join(",")
  );

  //state to save the recommendations in
  const [recommendations, setRecommendations] = useState(null);

  //Get Recommendations based on previous page's input
  useEffect(() => {
    const fetchData = async () => {
      const userRecommendations = await getRecommendations(
        `${idString}`,
        minDanceability,
        maxDanceability,
        minEnergy,
        maxEnergy,
        minValence,
        maxValence,
        minPopularity,
        maxPopularity
      );
      setRecommendations(userRecommendations.data);
    };

    catchErrors(fetchData());
  }, [
    idString,
    minDanceability,
    maxDanceability,
    minEnergy,
    maxEnergy,
    minValence,
    maxValence,
    minPopularity,
    maxPopularity,
  ]);

  /* --- Variables and functions to add (via search) or delete seed tracks --- */

  //Variables to store the search input & results
  const [searchInput, setSearchInput] = useState(""); // to store the user's input into the search field
  const [searchResults, setSearchResults] = useState(null); // to store the search results

  //Variables to count how many times the user added/deleted a seed track
  const [addTrackClickCount, setAddTrackClickCount] = useState(0);
  const [deleteTrackClickCount, setDeleteTrackClickCount] = useState(0);

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

  /** NOTE: The following code, until the end comment, was written with the help of ChatGPT **/

  // Close the search results overlay when the user clicks outside of it
  useEffect(() => {
    // Add a click event listener to the entire document
    const handleClickOutside = (event) => {
      const field = document.querySelector(".searchField");
      // Check if the click target is not within the overlay or input field
      if (field && !field.contains(event.target)) {
        setSearchInput(""); // Clear the search input
      }
    };
    document.addEventListener("click", handleClickOutside);
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  //Onclick function for adding a track from the search results to the seed tracks
  const addTrack = (track) => {
    // Check if the track is already selected, based on the track id
    const isTrackSelected = seedTracks.find(
      (seedTrack) => seedTrack.id === track.id
    );

    if (!isTrackSelected) {
      // If the track was not previously selected, add it to the array
      const trackDetails = {
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
      };
      const updatedTracks = [...seedTracks, trackDetails];
      setSeedTracks(updatedTracks);
      setAddTrackClickCount(addTrackClickCount + 1);
      setSearchInput(""); // Clear the search input (-> overlay closes)
    }
  };

  //Onclick function to remove a track from the seed tracks
  const deleteTrack = (track) => {
    // Remove the track from the selectedTracks array
    const updatedTracks = seedTracks.filter(
      (seedTrack) => seedTrack.id !== track.id
    );
    setSeedTracks(updatedTracks);
    setDeleteTrackClickCount(deleteTrackClickCount + 1);
  };

  //Update the idString whenever the seedTracks array changes
  useEffect(() => {
    const generateIdString = () =>
      seedTracks.map((track) => track.id).join(",");
    const updatedIdString = generateIdString(seedTracks);
    setIdString(updatedIdString);
  }, [seedTracks]);

  /** END of code written with ChatGPT **/

  /* --- Variables and Functions to save tracks from the recommendations --- */
  const [savedTracks, setSavedTracks] = useState([]);

  const [endTime, setEndTime] = useState(null); //Variable to get the time as soon as the user saved 5 songs
  const [showOverlay, setShowOverlay] = useState(false); //for overlay that appears with download button after 5 songs have been saved

  const toggleHeartIcon = (track) => {
    if (savedTracks.some((savedTrack) => savedTrack.id === track.id)) {
      // Track is already saved, remove it
      const updatedSavedTracks = savedTracks.filter(
        (savedTrack) => savedTrack.id !== track.id
      );
      setSavedTracks(updatedSavedTracks);

      const fetchDelete = async () => {
        await deleteTrackLibrary(track.id);
      };
      catchErrors(fetchDelete());
    } else {
      // Track is not saved, add it
      const trackDetails = {
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        preview_url: track.preview_url,
        external_url: track.external_urls.spotify,
      };
      const updatedSavedTracks = [...savedTracks, trackDetails];
      setSavedTracks(updatedSavedTracks);
      //save the track to the Spotify library
      const fetchSave = async () => {
        await saveTrackLibrary(trackDetails.id);
      };
      catchErrors(fetchSave());

      //set end time when the user saved 5 tracks
      if (updatedSavedTracks.length === 5) {
        setEndTime(new Date());
        setShowOverlay(true);
      }
    }
  };

  /* --- Variables and Functions to get log data / click counts --- */

  const [sliderClickCounts, setSliderClickCounts] = useState({});
  const [playClickCount, setPlayClickCount] = useState(0);
  const [spotifyLinkClickCount, setSpotifyLinkClickCount] = useState(0);
  const [timeRecommendationPage, setTimeRecommendationPage] = useState(null); //time spent on this page

  // Function to count clicks on the slider thumbs
  const collectSliderClickCounts = (sliderKey, count) => {
    setSliderClickCounts((prevData) => ({
      ...prevData,
      [`${sliderKey}-ClickCount`]: count,
    }));
  };

  // Function to count how often a songs gets played (via the preview play button)
  const incrementPlayClicks = () => {
    setPlayClickCount((prevCount) => prevCount + 1);
  };

  //Calculate the time the user takes until they save 5 tracks
  const [startTime, setStartTime] = useState(null);

  // Set the startTime once when the component first mounts
  useEffect(() => {
    setStartTime(new Date());
  }, []);

  //calculate the time as soon as endTime is set (-> when the user saved 5 tracks)
  useEffect(() => {
    const calculateElapsedTime = () => {
      if (startTime && endTime) {
        const elapsedMilliseconds = endTime - startTime;
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
        return elapsedSeconds;
      }
      return null;
    };

    setTimeRecommendationPage(calculateElapsedTime());
  }, [endTime, startTime]);

  /** NOTE: The following code, until the end comment, was written with the help of ChatGPT **/
  //generate a file that's downloadable & includes all logs
  const generateDownloadFile = () => {
    // Prepare the content as a JSON object
    const downloadContent = {
      playButton: playClickCount,
      spotifyLink: spotifyLinkClickCount,
      sliders: sliderClickCounts,
      exampleTracks: location.state.exampleClickCounts,
      startSeedTracks: location.state.selectedTrackInfo.length,
      addedSeedTracks: addTrackClickCount,
      deletedSeedTracks: deleteTrackClickCount,
      timeOnBoardingPage: location.state.timeSpent,
      timeRecommendationPage: timeRecommendationPage,
    };

    // Convert the JSON object to a string
    const contentString = JSON.stringify(downloadContent, null, 2);

    // Create a Blob containing the JSON content
    const blob = new Blob([contentString], { type: "application/json" });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create an anchor element to trigger the download
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "user_data.json";
    anchor.click();

    // Clean up by revoking the URL
    URL.revokeObjectURL(url);
  };
  /** END of code written with ChatGPT **/

  return (
    <div className="recommendations">
      {/*Download button for user logs (appears when the user saved 5 tracks)*/}
      {showOverlay && (
        <div className="recommendations__overlay">
          <div className="recommendations__overlay-content">
            <h3>Thank you so much for participating!</h3>
            <p style={{ width: "500px" }}>
              You have saved 5 tracks, which was the target of this test. Now,
              please click the button below to download a small file to your
              computer, and send me this file by email later.
            </p>
            <button
              className="recommendations__download-button"
              onClick={generateDownloadFile}
            >
              Download
            </button>
          </div>
        </div>
      )}

      <div className="recommendations__grid-container">
        <div className="recommendations__header">
          <Logo />
        </div>

        {/* --- Seed Tracks & Preferences --- */}
        <div className="recommendations__settings">
          <h2>Your Choices</h2>
          <div className="recommendations__box">
            <SeedTracks
              searchInput={searchInput}
              searchResults={searchResults}
              handleSearchInputChange={handleSearchInputChange}
              handleTrackClick={addTrack}
              tracks={seedTracks}
              deleteTrack={deleteTrack}
            />
          </div>

          <div className="recommendations__box">
            <h3>Preferences</h3>

            <h4>Danceability</h4>
            <RangeSlider
              sliderKey="danceability"
              selectedMinValue={preferences.minDanceability}
              selectedMaxValue={preferences.maxDanceability}
              collectClickCounts={collectSliderClickCounts}
              onChange={({ min, max }) => {
                setMinDanceability(normalizeValue(min));
                setMaxDanceability(normalizeValue(max));
              }}
            />
            <div className="recommendations_preference-divider"></div>

            <h4>Energy</h4>
            <RangeSlider
              sliderKey="energy"
              selectedMinValue={preferences.minEnergy}
              selectedMaxValue={preferences.maxEnergy}
              collectClickCounts={collectSliderClickCounts}
              onChange={({ min, max }) => {
                setMinEnergy(normalizeValue(min));
                setMaxEnergy(normalizeValue(max));
              }}
            />
            <div className="recommendations_preference-divider"></div>

            <h4>Valence (Positiveness)</h4>
            <RangeSlider
              sliderKey="valence"
              selectedMinValue={preferences.minValence}
              selectedMaxValue={preferences.maxValence}
              collectClickCounts={collectSliderClickCounts}
              onChange={({ min, max }) => {
                setMinValence(normalizeValue(min));
                setMaxValence(normalizeValue(max));
              }}
            />
            <div className="recommendations_preference-divider"></div>

            <h4>Popularity</h4>
            <RangeSlider
              sliderKey="popularity"
              selectedMinValue={preferences.minPopularity}
              selectedMaxValue={preferences.maxPopularity}
              collectClickCounts={collectSliderClickCounts}
              onChange={({ min, max }) => {
                setMinPopularity(min);
                setMaxPopularity(max);
              }}
            />
          </div>
        </div>

        {/* --- Recommendation Results --- */}
        <div className="recommendations__results">
          <h2>Your Recommendations</h2>

          {/* Saved Recommendations */}
          <h3 className="recommendations_h-space-top">Saved Recommendations</h3>
          {savedTracks.length === 0 ? (
            <p className="p-grey-16">
              Save tracks you like by pressing the heart icon next to it. This
              will also add the track to your “Liked Songs” in Spotify.
            </p>
          ) : (
            <div>
              {savedTracks.map((track) => (
                <div
                  key={track.id}
                  className="recommendations__track-container"
                >
                  {track.preview_url /* If there is a preview available, display the play button */ ? (
                    <div className="recommendations__play-button">
                      <SongPreviewPlayer
                        songLink={track.preview_url}
                        tooltipActive={false}
                      />
                    </div>
                  ) : (
                    /* If there is no preview available, display a greyed out play button */
                    <div className="recommendations__play-button">
                      <SongPreviewPlayer
                        songName="No preview available"
                        bgColor="#A6A6A6"
                      />
                    </div>
                  )}
                  <p className="recommendations__track-title">{track.name}</p>
                  <p className="recommendations__track-artist">
                    {track.artist}
                  </p>
                  <div className="recommendations__track-heart">
                    <img
                      src={
                        savedTracks.some(
                          (savedTrack) => savedTrack.id === track.id
                        )
                          ? heartFilled
                          : heartUnfilled
                      }
                      alt="heart icon outline"
                      onClick={() => toggleHeartIcon(track)}
                    />
                    <div className="recommendations__tooltip">
                      Remove from your library
                    </div>
                  </div>
                  <a
                    className="recommendations__track-link"
                    href={track.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Spotify
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* New Recommendations */}
          <h3 className="recommendations_h-space-top">New Recommendations</h3>
          <p>
            {" "}
            The play button will show you a 30-second sample of the track. If
            you want to listen to the whole song, please click "Open in
            Spotify", which will open a new tab in your browser.
          </p>
          {!recommendations /* If the recommendations haven't been fetched yet, display the following */ ? (
            <>
              <p className="p-grey">
                Loading your recommendations, please wait...
              </p>
              <p className="p-grey" style={{ marginTop: "16px" }}>
                If the recommendations don't appear after a few seconds, try to
                delete some seed tracks (up to 5 seed tracks usually work
                without problems). If it still doesn't work after that, please
                message me.
              </p>
            </>
          ) : (
            /* Otherwise, display the recommendations */
            <div>
              {recommendations.tracks.map((track) => (
                <div key={track.id} className="recommendations__track-container">
                  {track.preview_url /* If there is a preview available, display the play button */ ? (
                    <div className="recommendations__play-button">
                      <SongPreviewPlayer
                        songLink={track.preview_url}
                        tooltipActive={false}
                        incrementPlayClicks={incrementPlayClicks}
                      />
                    </div>
                  ) : (
                    /* If there is no preview available, display a greyed out play button */
                    <div className="recommendations__play-button">
                      <SongPreviewPlayer
                        songName="No preview available"
                        bgColor="#A6A6A6"
                        incrementPlayClicks={incrementPlayClicks}
                      />
                    </div>
                  )}
                  <p className="recommendations__track-title">{track.name}</p>
                  <p className="recommendations__track-artist">
                    {track.artists[0].name}
                  </p>
                  <div className="recommendations__track-heart">
                    <img
                      src={savedTracks.some((savedTrack) => savedTrack.id === track.id) ? heartFilled : heartUnfilled}
                      alt="heart icon outline"
                      onClick={() => toggleHeartIcon(track)}
                    />
                    <div className="recommendations__tooltip">Add to your Spotify library</div>
                  </div>
                  <a
                    className="recommendations__track-link"
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      setSpotifyLinkClickCount((prevCount) => prevCount + 1)
                    }
                  >
                    Open in Spotify
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
