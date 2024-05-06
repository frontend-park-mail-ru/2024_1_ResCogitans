export interface UserAuthRequest {
  username: string,
  password: string,
}

export interface User {
  username: string,
  id: number,
}

export interface UserAuthResponseData {
  user: User,
  code: number,
  error: string,
}

export interface WithResponse<T> {
  status: number,
  data: T,
  success : boolean,
}

export interface ReviewContent {
  id: number,
  userID: number,
  username: string,
  sightID: number,
  rating: number,
  feedback: string,
  avatar: string,
}

export interface UserProfile {
  id: number,
  username: string,
  bio: string,
  avatar: string,
  error: string,
}

export interface Journey {
  id : number,
  userID : number,
  username : string,
  name : string,
  description : string,
  sights : Sight[],
}

export interface Sight {
  id: number,
  rating: number,
  name: string,
  description: string,
  cityID : string,
  countryID : string,
  city: string,
  country : string,
  latitude : number,
  longitude : number,
  url: string,
}

export interface SightResponse {
  status: number,
  data: {
    comments: ReviewContent[],
    sight: Sight,
  }
}

export interface Sights {
  sights: Sight[],
}

export interface Category {
  id: number,
  name: string,
}

export interface AlbumParams {
  id: number,
  type: string,
}

export interface PhotoData {
  photoID: number,
  path: string,
  description: string,
  filename? : string,
}

export interface AlbumData {
  albumID: number,
  userID: number,
  name: string,
  description: string,
}

export interface AlbumInfo {
  albumInfo : AlbumData,
  albumPhotos : PhotoData[],
}

export interface AlbumCreated { 
  id : number,
  userID : number,
}
