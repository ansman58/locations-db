import { ObjectId } from "mongodb";

export interface IState {
  _id: ObjectId;
  name: string;
  meta?: string;
  countryId: ObjectId;
}
