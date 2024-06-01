import { IState } from "definitions/State";
import mongoose, { Model } from "mongoose";
const { Schema, model, SchemaTypes } = mongoose;

type IStateSchema = Model<IState>;

const stateSchema = new Schema<IState, IStateSchema>(
  {
    name: {
      type: String,
      required: true,
    },
    meta: {
      type: String,
      required: false,
    },
    countryId: {
      type: SchemaTypes.ObjectId,
      ref: "country",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const State = model("state", stateSchema);

export default State;
