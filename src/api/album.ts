import { get, post } from '@api/base';
import { WithResponse, AlbumData, AlbumInfo, AlbumCreated } from 'src/types/api';
import { imageUpload } from './user';

export async function getUserAlbums(userId: number) {
  return await get(`profile/${userId}/albums`) as WithResponse<{ albums: AlbumData[] }>;
}

export async function getAlbum(albumID : number) {
  return await get(`album/${albumID}`) as WithResponse<{ album: AlbumInfo }>;
}

export async function createAlbum(userID : number, requestBody : { name : string, description : string }) {
  return await post(`profile/${userID}/album/create`, requestBody) as WithResponse<{ album: AlbumCreated }>;
}

export async function deleteAlbum(userID : number, albumID : number) {
  return await post(`profile/${userID}/album/delete`, {
    albumID : albumID, 
  }) as WithResponse<{ album: AlbumCreated }>;
}

export async function deletePhoto(albumID : number, photoID : number) {
  return await post(`album/${albumID}/album/delete`, {
    photoID : photoID, 
  }) as WithResponse<{ album: AlbumCreated }>;
}

export async function uploadAlbumPhotos(albumID : number, formData : FormData) {
  return await imageUpload(`album/${albumID}/upload`, formData) as WithResponse<{ album : AlbumCreated }>;
}
