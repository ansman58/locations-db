import { ObjectId } from "mongodb";

export interface ICountry {
  _id: ObjectId;
  name: string;
  meta?: string;
}
