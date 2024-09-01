const fs = require("fs");

// Function to read JSON file
function readJSONFile(filename) {
  try {
    const data = fs.readFileSync(`./data/${filename}`, "utf-8");
    console.log("File content:", data);
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading file:", err);
  }
}

// Read data from JSON files
const energyData = readJSONFile("energy.json");
const waterData = readJSONFile("water.json");
const wasteData = readJSONFile("waste.json");

// Calculate total energy consumption in January
function calculateEnergyConsumption(energyData) {
  const energyConsumption = {};
  energyData.forEach((entry) => {
    if (entry.month === "January") {
      if (!energyConsumption[entry.facility]) {
        energyConsumption[entry.facility] = 0;
      }
      energyConsumption[entry.facility] += entry.energy_consumption_kwh;
    }
  });
  return energyConsumption;
}

// Calculate average daily water usage in January
function calculateWaterUsage(waterData) {
  const waterUsage = {};
  waterData.forEach((entry) => {
    const month = entry.day.split("-")[1];
    // Check if the month is January
    if (month === "01") {
      if (!waterUsage[entry.facility]) {
        waterUsage[entry.facility] = [];
      }
      waterUsage[entry.facility].push(entry.water_usage_liters);
    }
  });

  const avgWaterUsage = {};
  for (const facility in waterUsage) {
    const total = waterUsage[facility].reduce((sum, value) => sum + value, 0);
    avgWaterUsage[facility] = total / waterUsage[facility].length;
  }
  return avgWaterUsage;
}

// Calculate total waste produced in Q1
function calculateWasteProduction(wasteData) {
  const wasteProduction = {};
  wasteData.forEach((entry) => {
    if (entry.quarter === "Q1") {
      if (!wasteProduction[entry.facility]) {
        wasteProduction[entry.facility] = 0;
      }
      wasteProduction[entry.facility] += entry.waste_produced_kg;
    }
  });
  return wasteProduction;
}

// Process data
const energyConsumption = calculateEnergyConsumption(energyData);
const avgWaterUsage = calculateWaterUsage(waterData);
const wasteProduction = calculateWasteProduction(wasteData);

// Output results
const facilities = [
  ...new Set([
    ...Object.keys(energyConsumption),
    ...Object.keys(avgWaterUsage),
    ...Object.keys(wasteProduction),
  ]),
];

facilities.forEach((facility) => {
  console.log(`${facility}:`);
  console.log(
    `- Total Energy Consumption in January: ${
      energyConsumption[facility] || 0
    } kWh`
  );
  console.log(
    `- Average Daily Water Usage in January: ${
      avgWaterUsage[facility] ? avgWaterUsage[facility].toFixed(2) : 0
    } liters`
  );
  console.log(
    `- Total Waste Produced in Q1: ${wasteProduction[facility] || 0} kg`
  );
  console.log("");
});
