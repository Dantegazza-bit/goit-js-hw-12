import axios from 'axios';

export const PER_PAGE = 15;
const API_KEY = '52390417-1bf501a7c6f4bb07aa1949c3b'; // твій ключ

const instance = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: PER_PAGE,
  },
});

/**
 * @param {string} query
 * @param {number} page
 * @returns {Promise<any>} data
 */
export async function getImagesByQuery(query, page = 1) {
  const { data } = await instance.get('', {
    params: { q: query.trim(), page },
  });
  return data; // { hits, totalHits, ... }
}
