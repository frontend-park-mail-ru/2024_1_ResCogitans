import { get } from '@api/base';
import { WithResponse, Sights, ReviewContent, Sight, Category } from 'src/types/api';

export async function getSights() {
  return await get('sights') as WithResponse<Sights>;
}

export async function getSight(sightId: number) {
  return await get(`sight/${sightId}`) as WithResponse<{ comments: ReviewContent[], sight: Sight }>;
}

export async function getCategories() {
  return await get('categories') as WithResponse<{ categories: Category[] }>;
}

export async function filterSights(hash: { [key: string]: any }) {
  let queryString = '';

  for (const key in hash) {
    if (hash.hasOwnProperty(key)) {
      const value = hash[key];
      queryString += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
    }
  }

  queryString = queryString.slice(0, -1);
  const url = `sight/quiz?${queryString}`;

  return get(url);
}
