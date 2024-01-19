import { Document } from "mongoose";

export type LoginRequestBody = {
  username: string;
  password: string;
};

export type SignupRequestBody = {
  email?: string;
  password?: string;
  name?: string;
};

export type ProductInfo = {
  position: number;
  title: string;
  link: string;
  product_link: string;
  product_id: string;
  serpapi_product_api: string;
  source: string;
  price: string;
  extracted_price: number;
  old_price: string;
  extracted_old_price: number;
  extensions: string[];
  thumbnail: string;
  tag: string;
  delivery: string;
};

