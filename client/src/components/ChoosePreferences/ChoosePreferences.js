import "./ChoosePreferences.css";
import { SongExamples, PreferenceSection } from "./ChildComponents";
import { useState, useEffect } from "react";
import { getTrack } from "../../spotify";

const ChoosePreferences = ({preferences, onPreferencesChange, incrementExampleClicks}) => {
  //save all the fetched 30s song preview-links in here
  const [songLinks, setSongLinks] = useState({});

  //get the 30s song preview-links for the songs in songData from the Spotify API
  useEffect(() => {
    //Map of all the songs & IDs we want to use for the examples
    const songData = {
      "7KXjTSCq5nL1LoYtL7XAwS": "HUMBLE.",
      "5ghIJDpPoe3CfHMGu71E6T": "Smells Like Teen Spirit",
      "7LVHVU3tWfcxj5aiPFEW4Q": "Fix You",
      "3bidbhpOYeV4knp8AIu8Xn": "Can't Hold Us (feat. Ray Dalton)",
      "0e7ipj03S05BNilyu5bRzt": "rockstar (feat. 21 Savage)",
      "5FgPwJ7Nh2FVmIXviKl2VF": "Make You Feel My Love",
      "32OlwWuMpZ6b0aN2RZOeMS": "Uptown Funk (feat. Bruno Mars)",
      "3JvrhDOgAt6p7K8mDyZwRd": "Riptide",
      "5Z01UMMf7V1o0MzF86s6WJ": "Lose Yourself",
    };

    const fetchData = async () => {
      const links = {};
      for (const songID in songData) {
        try {
          const { data } = await getTrack(songID);
          links[songData[songID]] = data.preview_url;
        } catch (error) {
          console.error(`Error fetching track ${songID}:`, error);
        }
      }
      setSongLinks(links); //creates a map with "song name": "song link"
    };
    fetchData();
  }, []);

  //everything we need to display the examples for each preference
  const danceabilityExamples = [
    { percentage: 20, songName: "Fix You - Coldplay", songLink: songLinks["Fix You"],},
    { percentage: 50, songName: "Smells Like Teen Spirit - Nirvana", songLink: songLinks["Smells Like Teen Spirit"],},
    { percentage: 90, songName: "HUMBLE. – Kendrick Lamar", songLink: songLinks["HUMBLE."],},
  ];

  const energyExamples = [
    { percentage: 20, songName: "Make You Feel My Love - Adele", songLink: songLinks["Make You Feel My Love"],},
    { percentage: 50, songName: "rockstar (feat. 21 Savage) - Post Malone", songLink: songLinks["rockstar (feat. 21 Savage)"],},
    { percentage: 90, songName: "Can't Hold Us (feat. Ray Dalton) - Macklemore & Ryan Lewis", songLink: songLinks["Can't Hold Us (feat. Ray Dalton)"],},
  ];

  const valenceExamples = [
    { percentage: 5, songName: "Lose Yourself - Eminem", songLink: songLinks["Lose Yourself"],},
    { percentage: 50, songName: "Riptide - Vance Joy", songLink: songLinks["Riptide"],},
    { percentage: 90, songName: "Uptown Funk (feat. Bruno Mars) - Mark Ronson", songLink: songLinks["Uptown Funk (feat. Bruno Mars)"],},
  ];

  // states to get all the values the user chooses for the preferences (with the sliders)
  const [minDanceability, setMinDanceability] = useState(preferences.minDanceability);
  const [maxDanceability, setMaxDanceability] = useState(preferences.maxDanceability);
  const [minEnergy, setMinEnergy] = useState(preferences.minEnergy);
  const [maxEnergy, setMaxEnergy] = useState(preferences.maxEnergy);
  const [minValence, setMinValence] = useState(preferences.minValence);
  const [maxValence, setMaxValence] = useState(preferences.maxValence);
  const [minPopularity, setMinPopularity] = useState(preferences.minPopularity);
  const [maxPopularity, setMaxPopularity] = useState(preferences.maxPopularity);

  useEffect(() => {
    // Pass the values to the parent component (Steps.js) 
    onPreferencesChange({
      minDanceability,
      maxDanceability,
      minEnergy,
      maxEnergy,
      minValence,
      maxValence,
      minPopularity,
      maxPopularity,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDanceability, maxDanceability, minEnergy, maxEnergy, minValence, maxValence, minPopularity, maxPopularity]);

  return (
    <div className="preferences__grid-container">
      <div className="preferences___main1">
      <div className="preferences__box">
        <PreferenceSection
          title="Danceability"
          description="Describes how suitable a track is for dancing based on a combination of tempo, rhythm and beat strength."
          selectedMinValue={minDanceability}
          selectedMaxValue={maxDanceability} 
          onChange={({ min, max }) => {
            setMinDanceability(min);
            setMaxDanceability(max);
          }}
        />
        <SongExamples examples={danceabilityExamples} incrementPlayClicks={() => incrementExampleClicks('danceability')}/>
      </div>
      </div>

      <div className="preferences__main2">
      <div className="preferences__box">
        <PreferenceSection
          title="Energy"
          description="Represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy."
          selectedMinValue={minEnergy}
          selectedMaxValue={maxEnergy} 
          onChange={({ min, max }) => {
            setMinEnergy(min);
            setMaxEnergy(max);
          }}
        />
        <SongExamples examples={energyExamples} incrementPlayClicks={() => incrementExampleClicks('energy')}/>
      </div>
      </div>

      <div className="preferences__main3">
        <div className="preferences__box">
        <PreferenceSection
          title="Valence (Positiveness)"
          description="High valence sounds more positive (happy, cheerful, euphoric), while a low valence sounds more negative (sad, depressed, angry)."
          selectedMinValue={minValence}
          selectedMaxValue={maxValence} 
          sliderDescriptionLeft="negative"
          sliderDescriptionRight="positive"
          onChange={({ min, max }) => {
            setMinValence(min);
            setMaxValence(max);
          }}
          
        />
         <SongExamples examples={valenceExamples} incrementPlayClicks={() => incrementExampleClicks('valence')}/>
      </div>
      </div>

      <div className="preferences__main4">
      <div className="preferences__box-small">
        <PreferenceSection
          title="Popularity"
          description="Measures how popular a song is in comparison to all other tracks. This is mostly based on the total number of plays."
          selectedMinValue={minPopularity}
          selectedMaxValue={maxPopularity} 
          onChange={({ min, max }) => {
            setMinPopularity(min);
            setMaxPopularity(max);
          }}
        />
      </div>
      </div>
    </div>
  );
};

export default ChoosePreferences;
