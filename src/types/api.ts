export interface UserAuthRequest {
  username: string;
  password: string;
}

export interface User {
  username: string;
  id: number;
}

export interface UserAuthResponseData {
  user: User;
  code: number;
  error: string;
}

export interface WithResponse<T> {
  status: number;
  data: T;
}

export interface ReviewContent {
  id : number;
  placename: string;
  avatar: string;
  username : string;
  rating : number;
  content : string;
}

export interface UserProfile {
  id: number;
  username : string;
  status: string;
  avatarURL : string;
}

export interface Journey {
  tripID : number,
  userID : number,
  username : string,
  name : string;
  description : string;
  sights : Sight[];
}

export interface Sight {
  id: number,
  rating: number,
  name: string,
  description: string,
  city: string,
  url: string
}

export interface JourneyResponse {
  status: number;
  data: {
    journey : Journey;
    sights: Sight[];
  }
}
