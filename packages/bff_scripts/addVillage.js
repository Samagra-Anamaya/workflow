const axios = require('axios');
const fs = require('fs');

const VILLAGES_JSON_PATH = 'input/villages.json';
const ADD_VILLAGE_URL = 'http://localhost:3003/utils/addVillage';

async function addVillage(village) {
  try {
    const response = await axios.post(ADD_VILLAGE_URL, village);
    console.log(`Village ${village.villageName} added successfully!`);
  } catch (error) {
    console.error(`Error adding village ${village.villageName}`, error.response ? error.response.data : error.message);
  }
}

function loadVillages() {
  try {
    const villagesJson = fs.readFileSync(VILLAGES_JSON_PATH, 'utf8');
    const villages = JSON.parse(villagesJson);
    return villages;
  } catch (error) {
    console.error('Error loading villages:', error.message);
    return [];
  }
}

async function main() {
  const villages = loadVillages();
  for (const village of villages) {
    await addVillage(village);
  }
}

main();
