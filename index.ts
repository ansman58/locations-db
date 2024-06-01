import puppeteer from "puppeteer";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Country from "./schemas/Country";
import State from "./schemas/State";
import LGA from "./schemas/LGA";

dotenv.config();

(async () => {
  try {
    const connect = await mongoose.connect(process.env.DB_URI as string);

    console.log("connected", connect.connection.host);
  } catch (err) {
    console.log(
      "Oops! Sorry, connection to the DB failed.",
      (err as Error)?.message
    );
  }
})();

(async () => {
  try {
    // Retrieve country details
    const country = await Country.findOne({ name: "Nigeria" });
    if (!country) {
      throw new Error("Country not found");
    }
    const countryId = country._id;

    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(
      "https://en.wikipedia.org/wiki/Local_government_areas_of_Nigeria",
      {
        waitUntil: "networkidle2",
      }
    );

    // Extract states and LGAs
    const statesAndLGAs = await page.$$eval("h3", (states) =>
      states.map((state) => {
        const h3Text = state.textContent?.split("[")?.[0] || "";
        const nextElement = state.nextElementSibling;
        const secondNextElement = nextElement?.nextElementSibling;

        const cities =
          nextElement?.tagName === "LINK" &&
          secondNextElement?.tagName === "DIV"
            ? secondNextElement.textContent?.split("\n").filter(Boolean)
            : [];

        return { state: h3Text, cities };
      })
    );

    for (const data of statesAndLGAs) {
      const state = await State.create({
        name: data.state.split(" ")[0],
        countryId: countryId,
      });

      if (data.cities) {
        for (const city of data.cities) {
          await LGA.create({ name: city, stateId: state._id });
        }
      }
    }

    await browser.close();
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
