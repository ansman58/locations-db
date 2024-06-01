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
  const country = await Country.findOne({ name: "Nigeria" });
  const countryId = country?._id;

  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto(
    "https://en.wikipedia.org/wiki/Local_government_areas_of_Nigeria"
  );

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  await page.screenshot({ path: "screenshot.png" });

  const statesAndLGAs = await page.$$eval("h3", (states) =>
    states.map((state) => {
      const h3Text = state.textContent?.split("[")?.[0] || "";
      const nextElement = state.nextElementSibling;
      const secondNextElement = nextElement?.nextElementSibling;

      // Check if the next elements exist and get their text content
      const cities =
        nextElement?.tagName === "LINK" && secondNextElement?.tagName === "DIV"
          ? secondNextElement.textContent?.split("\n").filter(Boolean)
          : ["No following div"];

      return { state: h3Text, cities };
    })
  );

  for (const state of statesAndLGAs) {
    console.log(state.state?.split(" ")[0]);
    const st = await State.create({
      name: state.state?.split(" ")[0],
      countryId: countryId,
    });

    if (!state.cities) return;

    for (const city of state.cities) {
      await LGA.create({ name: city, stateId: st._id });
    }
  }

  await browser.close();
})();
