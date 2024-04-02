export interface UserAuthRequest {
  username: string;
  password: string;
}

export interface UserAuthResponse {
  status: number;
  data: {
    username?: string;
    code: number;
    error: string;
  }
}

export interface Sight {
  id: number,
  rating: number,
  name: string,
  description: string,
  city: string,
  url: string
}