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
  id: number,
  userID: number,
  username: string,
  name: string,
  description: string,
  sights: Sight[],
}

export interface Sight {
  id: number,
  rating: number,
  name: string,
  description: string,
  city: string,
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

export interface SurveyQuestion {
  id: number,
  text: string,
}

export interface SurveyQuestionData<T> {
  questions: T[],
}

export interface SurveyStatisticQuestion {
  id: number,
  text: string,
  userGrade : number,
  averageGrade : number,
}
