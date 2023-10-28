//This file is for all Spotify-related code (get/refresh token, get recommendations, etc.)

/* The following code, until the 'end of citation' comment, is from a tutorial by Brittany Chiang (2021) on Newline.co, 'Build a Spotify Connected App'.
Available at: https://www.newline.co/courses/build-a-spotify-connected-app

It has been slightly modified to fit the needs of this project, e.g. different calculation of the token expiration time & usage of axios instance
*/

import axios from "axios";

// Map for localStorage keys -> easy way to refer to the keys we're going to use for each key/value pair in local storage
const LOCALSTORAGE_KEYS = {
  accessToken: "spotify_access_token",
  refreshToken: "spotify_refresh_token",
  expireTime: "spotify_token_expire_time",
  timestamp: "spotify_token_timestamp",
};

// Map to retrieve localStorage values -> easy way to refer to the values currently set in local storage
const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
};

/**
 * Clear out all localStorage items we've set and reload the page
 * @returns {void}
 */
export const logout = () => {
  // Clear all localStorage items
  for (const property in LOCALSTORAGE_KEYS) {
    window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
  }
  // Navigate to homepage
  window.location = window.location.origin;
};

/**
 * Checks if the amount of time that has elapsed between the timestamp in localStorage
 * and now is greater than the expiration time.
 * @returns {boolean} Whether or not the access token in localStorage has expired
 */
const hasTokenExpired = () => {
  const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
  if (!accessToken || !timestamp) {
    return false;
  }
  const millisecondsElapsed = Date.now() - Number(timestamp); // Date.now is a number representing the timestamp, in milliseconds, of the current time.
  return millisecondsElapsed / 1000 >= Number(expireTime) - 1800; //subtract 30 minutes from expiration time; to refresh the token if a new page is opened and only 30mins are left
};

/**
 * Use the refresh token in localStorage to hit the /refresh_token endpoint
 * in our Node app, then update values in localStorage with data from response.
 * @returns {void}
 */
const refreshToken = async () => {
  try {
    // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
    if (
      !LOCALSTORAGE_VALUES.refreshToken ||
      LOCALSTORAGE_VALUES.refreshToken === "undefined" ||
      Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000 < 1000
    ) {
      console.error("No refresh token available");
      logout();
    }

    // Use `/refresh_token` endpoint from our Node app
    const { data } = await axios.get(
      `/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`
    );

    // Update localStorage values
    window.localStorage.setItem(
      LOCALSTORAGE_KEYS.accessToken,
      data.access_token
    );
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());

    // Reload the page for localStorage updates to be reflected
    window.location.reload();
  } catch (e) {
    console.error(e);
  }
};

/**
 * Handles logic for retrieving the Spotify access token from localStorage
 * or URL query params
 * @returns {string} A Spotify access token
 */
const getAccessToken = () => {
  // returns the query string from the current URL of the web page (everything after the ?)
  const queryString = window.location.search;
  // URLSearchParams provides methods for appending, deleting, getting, and setting key-value pairs in the query string
  const urlParams = new URLSearchParams(queryString);
  // Get the access token etc. from the URL query params
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get("access_token"),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get("refresh_token"),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get("expires_in"),
  };

  //if we get an error (in our callback route handler in the express app / index.js we passed an error query param, if the status code was not 200)
  const hasError = urlParams.get("error");

  // If there's an error OR the token in localStorage has expired, refresh the token
  if (
    hasError ||
    hasTokenExpired() ||
    LOCALSTORAGE_VALUES.accessToken === "undefined"
  ) {
    refreshToken();
  }

  // If there is a valid access token in localStorage, use that
  if (
    LOCALSTORAGE_VALUES.accessToken &&
    LOCALSTORAGE_VALUES.accessToken !== "undefined"
  ) {
    return LOCALSTORAGE_VALUES.accessToken;
  }

  // If there is no access token in the local storage, but there is a token in the URL query params -> means user is logging in for the first time
  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    // Store the query params in localStorage
    for (const property in queryParams) {
      window.localStorage.setItem(property, queryParams[property]);
    }
    // Set timestamp
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
    // Return access token from query params
    return queryParams[LOCALSTORAGE_KEYS.accessToken];
  }

  // If none of the above cases are met -> We should never get here!
  return false;
};

export const accessToken = getAccessToken();

/* axios custom instance defaults (this was modified from the original code to use an instance instead of axios.defaults)
 * https://axios-http.com/docs/config_defaults
 * we set the base URL and the HTTP request headers for every HTTP request we make with that instance
 */
const instance = axios.create({
  baseURL: "https://api.spotify.com/v1",
});
instance.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
instance.defaults.headers["Content-Type"] = "application/json";

/**
 * Get a User's Top Tracks
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-users-top-artists-and-tracks
 * @param {string} time_range - 'short_term' (last 4 weeks) 'medium_term' (last 6 months) or 'long_term' (calculated from several years of data and including all new data as it becomes available). Defaults to 'short_term'
 * @returns {Promise}
 */
export const getTopTracks = (time_range = "short_term") => {
  return instance.get(`/me/top/tracks?time_range=${time_range}&limit=15`);
};

/** END of Citation by Brittany Chiang **/

/**
 * Get Recommendations based on user input
 * https://developer.spotify.com/documentation/web-api/reference/get-recommendations
 * @param {string} seedTracks - ids of tracks to use as seeds
 * @returns {Promise}
 */

export const getRecommendations = (
  seedTracks,
  minDanceability,
  maxDanceability,
  minEnergy,
  maxEnergy,
  minValence,
  maxValence,
  minPopularity,
  maxPopularity
) => {
  return instance.get(
    `/recommendations?limit=10&seed_tracks=${seedTracks}&min_danceability=${minDanceability}&max_danceability=${maxDanceability}&min_energy=${minEnergy}&max_energy=${maxEnergy}&min_popularity=${minPopularity}&max_popularity=${maxPopularity}&min_valence=${minValence}&max_valence=${maxValence}`
  );
};

/**
 * Search for a track based on user input
 * https://developer.spotify.com/documentation/web-api/reference/search
 * @param {string} userinput- ids of tracks to use as seeds
 * @returns {Promise}
 */
export const performSearch = (userinput) => {
  userinput = userinput.replace(/ /g, "+"); //replace spaces with + for the query
  return instance.get(`/search?q=${userinput}&type=track&limit=10`);
};

/**
 * Get Spotify catalog information for a single track
 * https://developer.spotify.com/documentation/web-api/reference/get-track
 * @param {string} songId- The track's Spotify ID
 * @returns {Promise}
 */
export const getTrack = (songId) => {
  return instance.get(`/tracks/${songId}`);
};

/**
 * Save a track  to the user's Spotify library
 * https://developer.spotify.com/documentation/web-api/reference/save-tracks-user
 * @param {string} songId- The track's Spotify ID
 * @returns {Promise}
 */
export const saveTrackLibrary = (songId) => {
  return instance.put(`/me/tracks?ids=${songId}`);
};

/**
 * Delete a track  to the user's Spotify library (if user decides to "unlike" a track they saved previously)
 * https://developer.spotify.com/documentation/web-api/reference/remove-tracks-user
 * @param {string} songId- The track's Spotify ID
 * @returns {Promise}
 */
export const deleteTrackLibrary = (songId) => {
  return instance.delete(`/me/tracks?ids=${songId}`);
};
