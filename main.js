const eventId = "167bebb6-7f24-4db7-9a71-eddc456d18e7"; // Requires manual change
const stadiumData = [
  {
    gate: 1,
    sections: [
      101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115,
      116, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212,
    ],
    sectionIds: [
      2400, 2401, 2402, 2403, 2404, 2405, 2406, 2407, 2408, 2409, 2410, 2411,
      2412, 2413, 2414, 2415, 2416, 2417, 2418, 2419, 2420, 2421, 2422, 2423,
      2424, 2425, 2426, 2427,
    ],
  },
  {
    gate: 2,
    sections: [117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129],
    sectionIds: [
      2341, 2342, 2343, 2344, 2345, 2346, 2347, 2348, 2349, 2350, 2351, 2352,
      2353,
    ],
  },
  {
    gate: 3,
    sections: [
      130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144,
      213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227,
    ],
    sectionIds: [
      2431, 2432, 2433, 2434, 2435, 2436, 2437, 2438, 2439, 2440, 2441, 2442,
      2443, 2444, 2445, 2446, 2447, 2448, 2449, 2450, 2451, 2452, 2453, 2454,
      2455, 2456, 2457, 2458, 2459, 2460,
    ],
  },
  {
    gate: 7,
    sections: [
      145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159,
    ],
    sectionIds: [
      2462, 2463, 2363, 2364, 2365, 2366, 2367, 2368, 2369, 2370, 2371, 2372,
      2373, 2397, 2396,
    ],
  },
  {
    gate: 9,
    sections: [232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242],
    sectionIds: [
      2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381, 2382, 2383, 2384,
    ],
  },
];

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

// Call the async function
fetchSectionData();
