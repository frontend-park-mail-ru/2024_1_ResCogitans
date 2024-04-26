import { get } from '@api/base';
import { WithResponse, Sights, ReviewContent, Sight } from 'src/types/api';

export async function getSights() {
  return await get('sights') as WithResponse<Sights>;
}

export async function getSight(sightId: number) {
  return await get(`sight/${sightId}`) as WithResponse<{ comments: ReviewContent[], sight: Sight }>;
}
