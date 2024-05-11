import { WithResponse, UserAuthRequest, UserAuthResponseData, UserProfile } from 'src/types/api';
import { ENV_CONFIG } from '../../envConfig';
import { get, post } from '@api/base';

export async function authorize(endpoint : string, form? : HTMLFormElement): Promise<WithResponse<UserAuthResponseData>> {
  const formData = new FormData(form);
  const formBody = new URLSearchParams(Object.fromEntries(formData.entries())).toString();

  const response = await fetch(`${ENV_CONFIG.API_URL}/api/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', 
    },
    credentials: 'include',
    body: formBody,
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


export async function imageUpload(endpoint : string, body? : FormData) {
  const response = await fetch(`${ENV_CONFIG.API_URL}/api/${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    body: body,
  });

  const responseData = await response.json().catch(() => null);
 
  return {
    data: responseData, status: response.status, success : response.ok,
  };
}

export async function getUserProfile(userId: number) {
  return await get(`profile/${userId}`) as WithResponse<UserProfile>;
}

export async function editProfile(userId: number, username: string, bio: string) {
  const profileRequestBody = {
    userID: userId,
    username: username,
    bio: bio,
  };
  return await post(`profile/${userId}/edit`, profileRequestBody) as WithResponse<UserProfile>;
}

export async function resetPassword(userId: number, password: string) {
  return await post(`profile/${userId}/reset_password`, {
    password: password, 
  }) as WithResponse<UserProfile>;
}
