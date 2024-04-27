import { get } from '@api/base';
import { WithResponse, SurveyStatisticQuestion } from 'src/types/api';

export async function getAverageSurvey() {
  return await get('review/get') as WithResponse<{ surveys: SurveyStatisticQuestion[] }>;
}
