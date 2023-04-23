//import country, state and lGA model developed
//this module allows the system upload files directly into the database
const Country = require("../models/countryModel");
const State = require("../models/stateModel");
const lGA = require("../models/lgaModel");

//import file system module and csv parser(this package allows you to upload csv files to your mongoDB)
const csv = require("csv-parser");
const fs = require("fs");

//store the fs createReadStream module as a variable and read the file path
const countryStream = fs.createReadStream("country.csv");
const stateStream = fs.createReadStream("state.csv");
const lGAStream = fs.createReadStream("lGA.csv");

//import country file
const uploadCountry = (req) => {
  return new Promise((resolve, reject) => {
    countryStream
      .pipe(csv())
      .on("data", async (row) => {
        try {
          const country = new Country({
            nationality: row.name,
          });
          await country.save();
        } catch (error) {
          reject(error);
        }
      })
      .on("end", () => {
        resolve("CSV file processed successfuly");
      })
      .on("error", () => {
        reject(new Error("Error processing file"));
      });
  });
};

//import state file
const uploadState = (req) => {
  return new Promise((resolve, reject) => {
    stateStream
      .pipe(csv())
      .on("data", async (row) => {
        try {
          const country = await Country.findById(row.country_id);
          if (!country) {
            reject(new Error(`Country with id ${row.country_id} not found`));
          }

          const existingState = await State.findOne({
            stateName: row.stateName,
            country_id: country._id,
          });
          if (existingState) {
            reject(new Error("State already exists"));
          } else {
            const state = new State({
              stateName: row.stateName,
              country_id: country._id,
            });
            await state.save();
          }
        } catch (error) {
          reject(error);
        }
      })
      .on("end", () => {
        resolve("CSV file successfully processed");
      })
      .on("error", () => {
        reject(new Error("Error processing file"));
      });
  });
};

//import Local Government Area file
const uploadlGA = (req) => {
  return new Promise((resolve, reject) => {
    lGAStream
      .pipe(csv())
      .on("data", async (row) => {
        try {
          //check if the state exist
          const state = await State.findById(row.state_id);
          if (!state) {
            reject(new Error(`State with ${row.state_id} does not exist`));
          }

          //check if lGA already exist
          const existinglGA = await lGA.findOne({
            name: row.name,
            state_id: state._id,
          });
          if (existinglGA) {
            reject(new Error("Local Government already exists"));
          } else {
            const newlGA = new lGA({
              name: row.name,
              state_id: state._id,
            });
            //save document into database
            await newlGA.save();
          }
        } catch (error) {
          reject(error);
        }
      })
      .on("end", () => {
        resolve("CSV file processed successfully");
      })
      .on("error", () => {
        reject(new Error("Error processing file"));
      });
  });
};

module.exports = { uploadCountry, uploadState, uploadlGA };
