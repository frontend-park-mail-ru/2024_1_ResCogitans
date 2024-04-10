export interface UserAuthRequest {
  username: string;
  password: string;
}

export interface UserAuthResponseData {
  username?: string;
  code: number;
  error: string;
}

export interface WithResponse<T> {
  status: number;
  data: T;
}

export interface Sight {
  id: number,
  rating: number,
  name: string,
  description: string,
  city: string,
  url: string
}
