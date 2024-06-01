import { ILGA } from "definitions/LGA";
import mongoose, { Model } from "mongoose";
const { Schema, model, SchemaTypes } = mongoose;

type ILGASchema = Model<ILGA>;

const lgaSchema = new Schema<ILGA, ILGASchema>(
  {
    name: {
      type: String,
      required: true,
    },
    meta: {
      type: String,
      required: false,
    },
    stateId: {
      type: SchemaTypes.ObjectId,
      ref: "state",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LGA = model("lga", lgaSchema);

export default LGA;
