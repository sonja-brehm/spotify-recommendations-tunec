/* The code in this file is from a tutorial by Brittany Chiang (2021) on Newline.co, 'Build a Spotify Connected App'.
Available at: https://www.newline.co/courses/build-a-spotify-connected-app */

/**
 * Higher-order function for async/await error handling
 * @param {function} fn an async function
 * @returns {function}
 */
export const catchErrors = fn => {
    return function(...args) {
      return fn(...args).catch((err) => {
        console.error(err);
      })
    }
  }