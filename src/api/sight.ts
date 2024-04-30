import { get } from '@api/base';
import { WithResponse, Sights, ReviewContent, Sight, Category } from 'src/types/api';

export async function getSights(category: number = 0) {
  return await get(`sights?category_id=${category}`) as WithResponse<Sights>;
}

export async function getSight(sightId: number) {
  return await get(`sight/${sightId}`) as WithResponse<{ comments: ReviewContent[], sight: Sight }>;
}

export async function getCategories() {
  return await get('categories') as WithResponse<{ categories: Category[] }>;
}
