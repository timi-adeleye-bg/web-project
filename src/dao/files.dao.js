//import country, state and lGA model developed
//this module allows the system upload files directly into the database
const Country = require("../models/countryModel");
const State = require("../models/stateModel");
const lGA = require("../models/lgaModel");
const Product = require("../models/productModel");
const Seed = require("../models/seedModel");

//import file system module and csv parser(this package allows you to upload csv files to your mongoDB)
const csv = require("csv-parser");
const fs = require("fs");
const { error } = require("console");

//store the fs createReadStream module as a variable and read the file path
const countryStream = fs.createReadStream("./src/files/country.csv");
const stateStream = fs.createReadStream("./src/files/state.csv");
const lGAStream = fs.createReadStream("./src/files/lGA.csv");
const productStream = fs.createReadStream("./src/files/product.csv");
const seedStream = fs.createReadStream("./src/files/seed.csv");

//import country file
const uploadCountry = (req) => {
  return new Promise((resolve, reject) => {
    countryStream
      .pipe(csv())
      .on("data", async (row) => {
        try {
          const existingCountry = await Country.findOne({
            nationality: row.name,
          });
          if (existingCountry) {
            throw new Error("Country already exists");
          } else {
            const country = new Country({
              nationality: row.name,
            });
            await country.save();
            console.log(country);
            //resolve("file processed successfully");
          }
          // const country = new Country({
          //   nationality: row.name,
          // });
          // country.save();
          // console.log(country);
          // resolve("Success");
        } catch (error) {
          reject(error);
          return;
        }
      })
      .on("end", () => {
        resolve("CSV file processed successfuly: ");
      })
      .on("error", () => {
        reject(new Error("Error processing file"));
      });
  });
};

//import state file
const uploadState = (req) => {
  return new Promise((resolve, reject) => {
    stateStream.pipe(csv()).on("data", async (row) => {
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
          resolve("CSV file successfully processed");
        }
      } catch (error) {
        reject(error);
      }
    });
    // .on("end", () => {
    //   resolve("CSV file successfully processed");
    // })
    // .on("error", () => {
    //   reject(new Error("Error processing file"));
    // });
  });
};

//import Local Government Area file
const uploadlGA = (req) => {
  return new Promise((resolve, reject) => {
    lGAStream
      .on("error", (error) => {
        reject(error);
      })
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
            resolve("Data saved into the DB");
          }
        } catch (error) {
          console.error(error);
          reject(error);
        }
      });
    // .on("end", () => {
    //   resolve("CSV file processed successfully");
    // });
    // .on("error", () => {
    //   reject(new Error("Error processing file"));
    // });
  });
};

//import product table
const uploadProduct = (req) => {
  productStream
    .pipe(csv())
    .on("data", async (row) => {
      try {
        //check if product exist
        const existingProduct = await Product.findOne({ product: row.name });
        if (existingProduct) {
          throw new Error("Product already exist");
        } else {
          const product = new Product({
            product: row.name,
          });
          //save product into database
          await product.save();
        }
      } catch (error) {
        throw error;
      }
    })
    .on("end", () => {
      return "CSV file processed successfully";
    });
};

const uploadSeed = (req) => {
  seedStream
    .pipe(csv())
    .on("data", async (row) => {
      try {
        //check if product imported exist
        const product = await Product.findOne({ product_id: row.product_id });
        if (!product) {
          throw new Error("Product doesn't exist");
        }

        //check if seed already exist
        const existingSeed = await Seed.findOne({ name: row.name });
        if (existingSeed) {
          throw new Error("Seed type already exist");
        } else {
          const seed = new Seed({
            name: row.name,
            product_id: row.product_id,
          });

          //store data in database
          await seed.save();
        }
      } catch (error) {
        throw error;
      }
    })
    .on("end", () => {
      return "CSV file processed successfully";
    });
};

module.exports = {
  uploadCountry,
  uploadState,
  uploadlGA,
  uploadProduct,
  uploadSeed,
};
