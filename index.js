const { parse } = require("csv-parse");
const fs = require("fs");

const habitablePlanets = [];
function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' 
        && planet['koi_insol'] > 0.36 
        && planet['koi_insol'] < 1.11 
        && planet['koi_prad'] < 1.6;
}

/**
 * We want to create a readable stream from the CSV file and pipe that stream into the CSV parser.
 * The CSV parser will then emit a data event for each line of the CSV file.
 * The pipe function connects a readable stream (the kepler file) source to a writable stream destination (the parse() function result).
 * readable.pipe(writable)
 */
fs.createReadStream("kepler_data.csv")
    .pipe(parse({
        comment: "#",
        columns: true // return each row as an object with the column names as keys
    }))
  .on("data", (data) => {
    if(isHabitablePlanet(data)){
        habitablePlanets.push(data)
    }
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("end", () => {
    console.log(`ONLY ${habitablePlanets.length} habitable planets found!!`);
    console.log(habitablePlanets.map((planet) => {
        return planet['kepler_name'];
    }))
    console.log("CSV file successfully processed");
  });
