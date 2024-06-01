import { ObjectId } from "mongodb";

export interface ILGA {
  _id: ObjectId;
  name: string;
  stateId: ObjectId;
  meta?: string;
}
