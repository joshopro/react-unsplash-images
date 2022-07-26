export interface IPhoto {
  id: string;
  liked_by_user: boolean;
  description: string;
  alt_description: string;
  urls: {
    regular: string;
    thumb: string;
    small: string;
  };
}
