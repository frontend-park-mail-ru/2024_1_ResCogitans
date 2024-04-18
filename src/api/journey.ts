import { get } from '@api/base';
import { WithResponse, Journey, Sight } from 'src/types/api';

export async function getUserTrips(userId: number) {
  return await get(`${userId}/trips`) as WithResponse<{ journeys: Journey[] }>;
}

export async function getTrip(tripId: number) {
  return await get(`trip/${tripId}`) as WithResponse<{ journey: Journey, sights: Sight[] }>;
}
