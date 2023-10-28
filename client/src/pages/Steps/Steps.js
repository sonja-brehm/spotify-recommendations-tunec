import "./Steps.css";
import { StepsHeader, ChooseTracks, ChoosePreferences } from "../../components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Steps = () => {
  const navigate = useNavigate();

  /*check/update which tracks the user has selected (in the ChooseTracks-Component, during Step 2)*/
  const [selectedTracks, setSelectedTracks] = useState([]);

  // Function to update the selectedTracks
  const handleSelectedTracksChange = (tracks) => {
    setSelectedTracks(tracks);
  };

  /*check/update which preferences the user has selected (in the ChoosePreferences-Component, during Step 3)*/
  const [preferences, setPreferences] = useState({
    minDanceability: 0,
    maxDanceability: 100,
    minEnergy: 0,
    maxEnergy: 100,
    minValence: 0,
    maxValence: 100,
    minPopularity: 0,
    maxPopularity: 100,
  });

  // Function to update the preferences
  const handlePreferencesChange = (updatedPreferences) => {
    setPreferences(updatedPreferences);
  };

  // Count how often an example track gets played (via the preview play button)
  const [exampleClickCounts, setExampleClickCounts] = useState({
    danceability: 0,
    energy: 0,
    valence: 0,
  });

  const incrementExampleClicks = (category) => {
    if (category === "danceability") {
      setExampleClickCounts((prevData) => ({
        ...prevData,
        danceability: prevData["danceability"] + 1,
      }));
    } else if (category === "energy") {
      setExampleClickCounts((prevData) => ({
        ...prevData,
        energy: prevData["energy"] + 1,
      }));
    } else if (category === "valence") {
      setExampleClickCounts((prevData) => ({
        ...prevData,
        valence: prevData["valence"] + 1,
      }));
    }
  };

  //Calculate how long the user is on this page
  const [startTime, setStartTime] = useState(null);
  // Set the startTime once when the component first mounts
  useEffect(() => {
    setStartTime(new Date());
  }, []);

  const calculateElapsedTime = () => {
    const elapsedMilliseconds = Date.now() - startTime;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    return elapsedSeconds;
  };

/**  The following code, until the end comment, is from GitHub user judygab (2022), repository "web-dev-projects",
Available at: https://github.com/judygab/web-dev-projects/blob/main/react-form/src/App.js (Accessed 01. August 2023).

Modified by adding everything inside "if (step === 3)"" for the const nextButton **/

  //useState hook to check/update which step the user is on
  const [step, setStep] = useState(2);

  //if the user clicks the back button, the step is decreased by 1
  const prevButton = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const nextButton = () => {
    if (step === 3) {
      // save all selected tracks in variable selectedTrackInfo
      const selectedTrackInfo = selectedTracks.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
      }));
      // calculate time spent on this page
      const timeSpent = calculateElapsedTime();
      // navigate to recommendations page and pass the selectedTrackInfo, preferences, exampleClickCounts and timeSpent as state
      navigate("/recommendations", {
        state: {
          selectedTrackInfo,
          preferences,
          exampleClickCounts,
          timeSpent,
        },
      });
    } else if (step >= 2) {
      setStep((prevStep) => prevStep + 1);
    }
  };
  /** end of citation from GitHub user judygab **/


  //Map to return the content for each step
  const stepContents = {
    2: (
      <>
        <div className="description-area">
          <h2>Choose Seed Tracks</h2>
          <p>
            Select the song(s) you want the recommendations to be based on – you
            can choose from your most played tracks or search for specific
            titles. And don't worry; you can still change your selection later.
          </p>
        </div>
        <div className="main">
          <ChooseTracks
            selectedTracks={selectedTracks}
            onSelectedTracksChange={handleSelectedTracksChange}
          />
        </div>
      </>
    ),
    3: (
      <>
        <div className="description-area">
          <h2>Choose Preferences</h2>
          <p>
            Set values for some musical attributes that will be reflected in
            your recommendations - simply use the sliders to select your
            preferred range. You can always change these values later!
          </p>
        </div>
        <div className="main">
          <ChoosePreferences
            preferences={preferences}
            onPreferencesChange={handlePreferencesChange}
            incrementExampleClicks={incrementExampleClicks}
          />
        </div>
      </>
    ),
  };

  return (
    <div className="steps">
      <StepsHeader step={step} />
      <div className="steps__outer-container">
        <div className="steps__grid-container">
          <div className="button-area">
            <div className="button-area__button">
              <button onClick={nextButton} className="button--M" disabled={selectedTracks.length === 0}>
                {step === 3 ? "Get Recommendations" : "Next Step"}
              </button>
            </div>
            {step === 3 && (
              <div className="button-area__button">
                <button onClick={prevButton} className="button-secondary--M">
                  Back
                </button>
              </div>
            )}
          </div>
          {stepContents[step] || null}
        </div>
      </div>
    </div>
  );
};

export default Steps;
