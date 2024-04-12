import { WithResponse, UserAuthRequest, UserAuthResponseData } from 'src/types/api';
import { ENV_CONFIG } from '../../envConfig';

export async function authorize(endpoint : string, body? : UserAuthRequest): Promise<WithResponse<UserAuthResponseData>> {
  const response = await fetch(`${ENV_CONFIG.API_URL}/${endpoint}`, {
import { WithResponse, UserAuthRequest, UserAuthResponseData } from 'src/types/api';
import { ENV_CONFIG } from '../../envConfig';

export async function authorize(endpoint : string, body? : UserAuthRequest): Promise<WithResponse<UserAuthResponseData>> {
  const response = await fetch(`${ENV_CONFIG.API_URL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const responseData = await response.json();
  const userAuthResponse: WithResponse<UserAuthResponseData> = {
    status: response.status,
    data: {
      user: {
        id: responseData.id,
        username: responseData.username,
      },
      code: responseData.code,
      error: responseData.error,
    },
  };
  return userAuthResponse;
}
