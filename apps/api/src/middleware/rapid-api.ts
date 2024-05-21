import fetch from 'node-fetch';

const RAPID_API_HEADERS = {
  'X-RapidAPI-Key': process.env.RAPID_API_KEY,
};

export function fetchFromRapidApi(uri: string) {
  console.log(`[server]: RapidAPI request | ${uri}`);
  return fetch(`${process.env.RAPID_API_BASE_URL}/${uri}`, {
    headers: RAPID_API_HEADERS,
  });
}
