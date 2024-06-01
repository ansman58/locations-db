import { ICountry } from "definitions/Country";
import mongoose, { Model } from "mongoose";
const { Schema, model, SchemaTypes } = mongoose;

type ICountrySchema = Model<ICountry>;

const countrySchema = new Schema<ICountry, ICountrySchema>(
  {
    name: {
      type: String,
      required: true,
    },
    meta: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Country = model("country", countrySchema);

export default Country;
