import fs from 'fs'; // Import file system

import { stadiumData } from './data.js'; // Import stadium data
const eventId = "167bebb6-7f24-4db7-9a71-eddc456d18e7"; // Requires manual change

// Initialize output array
let output = stadiumData.map((gateData) => ({
  gate: gateData.gate,
  sold: 0,
  total: 0,
  available: 0,
}));

// Define an async function to handle the fetching
async function fetchSectionData() {
  for (const gateData of stadiumData) {
    for (const sectionId of gateData.sectionIds) {
      const index = gateData.sectionIds.indexOf(sectionId);
      const section = gateData.sections[index];

      let apiUrl = `https://teller.viva.gr/api/modules/data.ashx?event=${eventId}&in=true&sz=10&av-mode=false&section=${sectionId}&modules=maps&id=5430325908457309`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.text();

        // Use a regular expression to extract the JSON string
        const jsonStringMatch = data.match(/var data_.*?=\s*({.*?});/);
        if (jsonStringMatch && jsonStringMatch[1]) {
          const jsonString = jsonStringMatch[1]; // Store the captured JSON string

          // Parse the JSON string
          const jsonData = JSON.parse(jsonString);

          // Access the html field
          const htmlField = jsonData.html;
          const keyAll = "data-seat";
          const keySold = "sd";
          const totalCount = htmlField.split(keyAll).length - 1;
          const soldCount = htmlField.split(keySold).length - 1;

          // Update the output for the corresponding gate
          const gateIndex = output.findIndex((g) => g.gate === gateData.gate);
          output[gateIndex].sold += soldCount;
          output[gateIndex].total += totalCount;
        } else {
          console.log(
            "No JSON found for Gate " + gateData.gate + " Section " + section
          );
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }

  // After fetching all data, calculate the difference
  output.forEach((gate) => {
    gate.available = gate.total - gate.sold;
  });

  // Output the final result in a better format
  console.log("\nFinal Output:");
  output.forEach((gate) => {
    console.log(
      `Gate ${gate.gate}: ${gate.sold}/${gate.total} (Available: ${gate.available})`
    );
  });

  // After processing all sections, calculate totals for the whole stadium
  let totalSold = output.reduce((acc, gate) => acc + gate.sold, 0);
  let totalSeats = output.reduce((acc, gate) => acc + gate.total, 0);
  let totalAvailable = totalSeats - totalSold;

  // Output the total for the whole stadium
  console.log(
    `\nTotal for the whole stadium: ${totalSold}/${totalSeats} (Available: ${totalAvailable})`
  );
}

fetchSectionData().then(() => {
  // Save the output to a JSON file
  fs.writeFileSync("output.json", JSON.stringify(output, null, 2), "utf-8");
  console.log("Data saved to output.json");
});