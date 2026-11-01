// Define age groups by 5 year intervals
const ageGroups = Array.from({ length: 20 }, (_, i) => `${i * 5}-${i * 5 + 4}`);
let startingPop = 50000;

// Initialize population structure
let population = ageGroups.map((_, i) => {
  const base = startingPop * Math.pow(0.9, i);
  return {
    male: Math.max(0, Math.floor(base * 0.5)),
    female: Math.max(0, Math.floor(base * 0.5))
  };
});

let currentYear = 0;
let totalPopHistory = [{ year: currentYear, population: getTotalPopulation(), structure: JSON.parse(JSON.stringify(population)) }];

// Mortality profiles by historical era
const mortalityProfiles = {
  modern:    [0.005, 0.004, 0.003, 0.003, 0.004, 0.006, 0.01, 0.02, 0.04, 0.06, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.85, 0.95],
  ancient:   [0.30,  0.20, 0.15, 0.10, 0.08, 0.07, 0.08, 0.10, 0.15, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 0.95, 0.98, 0.99],
  medieval:  [0.28,  0.18, 0.12, 0.09, 0.07, 0.06, 0.07, 0.09, 0.12, 0.18, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.90, 0.95, 0.99],
  colonial:  [0.25,  0.16, 0.11, 0.08, 0.06, 0.05, 0.06, 0.08, 0.10, 0.14, 0.22, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 0.95, 0.99]
};

// Populate war age group selectors and setup listeners
window.addEventListener("DOMContentLoaded", () => {
  const warStart = document.getElementById("warStart");
  const warEnd = document.getElementById("warEnd");
  ageGroups.forEach((group, i) => {
    const opt1 = document.createElement("option");
    opt1.value = i;
    opt1.textContent = group;
    warStart.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = i;
    opt2.textContent = group;
    warEnd.appendChild(opt2);
  });
  warStart.value = "2";
  warEnd.value = "4";

  document.getElementById("yearSlider").addEventListener("input", e => {
    const year = parseInt(e.target.value);
    const point = totalPopHistory.find(p => p.year === year);
    if (point && point.structure) {
      document.getElementById("yearDisplay").textContent = year;
      population = JSON.parse(JSON.stringify(point.structure));
      currentYear = year;
      drawPyramid();
    }
  });

  drawPyramid();
});

function drawPyramid() {
  const svg = document.getElementById("pyramid");
  svg.innerHTML = "";
  const scale = parseInt(document.getElementById("scale").value);
  const barHeight = 40;
  const chartWidth = 800;
  const mid = chartWidth / 2;

  population.forEach((group, i) => {
    const y = i * barHeight + 20;
    const maleWidth = -(group.male / scale);
    const femaleWidth = group.female / scale;

    // Male bar
    const maleBar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    maleBar.setAttribute("x", mid + maleWidth);
    maleBar.setAttribute("y", y);
    maleBar.setAttribute("width", -maleWidth);
    maleBar.setAttribute("height", barHeight - 4);
    maleBar.setAttribute("fill", "#4a90e2");
    svg.appendChild(maleBar);

    // Female bar
    const femaleBar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    femaleBar.setAttribute("x", mid);
    femaleBar.setAttribute("y", y);
    femaleBar.setAttribute("width", femaleWidth);
    femaleBar.setAttribute("height", barHeight - 4);
    femaleBar.setAttribute("fill", "#e26aa5");
    svg.appendChild(femaleBar);

    // Visualize excess gender imbalance
    if (group.male > group.female) {
      const excess = group.male - group.female;
      const excessWidth = -(excess / scale);
      const excessRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      excessRect.setAttribute("x", mid + maleWidth);
      excessRect.setAttribute("y", y);
      excessRect.setAttribute("width", -excessWidth);
      excessRect.setAttribute("height", barHeight - 4);
      excessRect.setAttribute("fill", "#003f8a");
      svg.appendChild(excessRect);
    } else if (group.female > group.male) {
      const excess = group.female - group.male;
      const excessWidth = excess / scale;
      const excessRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      excessRect.setAttribute("x", mid + (group.male / scale));
      excessRect.setAttribute("y", y);
      excessRect.setAttribute("width", excessWidth);
      excessRect.setAttribute("height", barHeight - 4);
      excessRect.setAttribute("fill", "#b03060");
      svg.appendChild(excessRect);
    }

    // Add age group label
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", mid);
    label.setAttribute("y", y + barHeight / 2);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("alignment-baseline", "middle");
    label.setAttribute("fill", "#333");
    label.textContent = ageGroups[i];
    svg.appendChild(label);

    // Male population label
    const maleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    maleText.setAttribute("x", mid + maleWidth - 5);
    maleText.setAttribute("y", y + barHeight / 2);
    maleText.setAttribute("text-anchor", "end");
    maleText.setAttribute("alignment-baseline", "middle");
    maleText.setAttribute("fill", "#333");
    maleText.textContent = group.male.toLocaleString();
    svg.appendChild(maleText);

    // Female population label
    const femaleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    femaleText.setAttribute("x", mid + femaleWidth + 5);
    femaleText.setAttribute("y", y + barHeight / 2);
    femaleText.setAttribute("text-anchor", "start");
    femaleText.setAttribute("alignment-baseline", "middle");
    femaleText.setAttribute("fill", "#333");
    femaleText.textContent = group.female.toLocaleString();
    svg.appendChild(femaleText);
  });

  // Add year title
  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", mid);
  title.setAttribute("y", 15);
  title.setAttribute("text-anchor", "middle");
  title.setAttribute("font-size", "16");
  title.textContent = `Year: ${currentYear}`;
  document.getElementById("yearDisplay").textContent = currentYear;
  document.getElementById("yearSlider").value = currentYear;
  svg.appendChild(title);

  updateStats();
  drawPopulationGraph();
}

// Advances the simulation by 5 years
function advanceDecade() {
  const sliderYear = parseInt(document.getElementById("yearSlider").value);
  if (sliderYear !== currentYear) {
    alert("You can only advance from the latest year!");
    return;
  }

  const tfr = parseFloat(document.getElementById("tfr").value);
  const sol = parseInt(document.getElementById("sol").value);
  const mortalityKey = document.getElementById("mortality").value;
  const baseDeathRates = mortalityProfiles[mortalityKey] || mortalityProfiles.modern;

  document.getElementById("solLabel").textContent = ` (${describeSoL(sol)})`;

  currentYear += 5;

  const deathMultiplier = getDeathMultiplier(sol);
  const adjustedDeathRates = baseDeathRates.map(d => d * deathMultiplier);

  // Update disease settings from UI if activeDisease is defined globally by disease.js
  if (typeof activeDisease !== "undefined") {
    activeDisease.active = document.getElementById("diseaseToggle").checked;
    activeDisease.gender = document.getElementById("targetGender").value;
    activeDisease.solThreshold = parseInt(document.getElementById("solThreshold").value);
    activeDisease.mortalityRate = parseFloat(document.getElementById("mortalityRate").value);
    activeDisease.exposureRate = parseFloat(document.getElementById("exposureRate").value);
    activeDisease.vaccinationCoverage = parseFloat(document.getElementById("vaccinationRate").value);

    const targetAgesRaw = document.getElementById("targetAges").value;
    activeDisease.targetAges = targetAgesRaw
      .split(",")
      .map(a => ageGroups.findIndex(g => g.startsWith(a.trim())))
      .filter(i => i !== -1);

    applyDisease(population, sol);
  }

  // Age the population forward
  for (let i = population.length - 1; i > 0; i--) {
    const deathRate = adjustedDeathRates[i];
    population[i] = {
      male: Math.max(0, Math.floor(population[i - 1].male * (1 - deathRate))),
      female: Math.max(0, Math.floor(population[i - 1].female * (1 - deathRate)))
    };
  }

  // ages 20-39
  const fertileFemales = population.slice(4, 8).reduce((sum, g) => sum + g.female, 0);
  const fertileMales = population.slice(4, 8).reduce((sum, g) => sum + g.male, 0);
  const birthsPerWomanPerDecade = tfr / 4; 

  const maleToFemaleRatio = fertileFemales > 0 ? fertileMales / fertileFemales : 1;
  let birthRateAdjustment = 1;
  if (maleToFemaleRatio < 0.8) {
    birthRateAdjustment = maleToFemaleRatio / 0.8;
  }

  const totalBirths = Math.max(0, Math.floor(fertileFemales * birthsPerWomanPerDecade * birthRateAdjustment));

  let maleBirths = 0;
  for (let i = 0; i < totalBirths; i++) {
    if (Math.random() < 0.5) {
      maleBirths++;
    }
  }
  const femaleBirths = totalBirths - maleBirths;

  population[0] = { male: maleBirths, female: femaleBirths };

  // Apply war losses to specified male age groups
  const warLosses = parseInt(document.getElementById("warLosses").value);
  const warStart = parseInt(document.getElementById("warStart").value);
  const warEnd = parseInt(document.getElementById("warEnd").value);

  if (!isNaN(warLosses) && warLosses > 0 && warStart <= warEnd) {
    const affectedGroups = warEnd - warStart + 1;
    const lossesPerGroup = Math.floor(warLosses / affectedGroups);
    for (let i = warStart; i <= warEnd; i++) {
      population[i].male = Math.max(0, population[i].male - lossesPerGroup);
    }
  }

  totalPopHistory.push({
    year: currentYear,
    population: getTotalPopulation(),
    structure: JSON.parse(JSON.stringify(population))
  });
  
  document.getElementById("yearSlider").max = currentYear;
  drawPyramid();
}

function getDeathMultiplier(sol) {
  if (sol < 5) return 2.0;
  if (sol < 10) return 1.5;
  if (sol < 15) return 1.2;
  if (sol < 20) return 1.0;
  if (sol < 25) return 0.9;
  if (sol < 30) return 0.8;
  if (sol < 40) return 0.7;
  if (sol < 50) return 0.6;
  if (sol < 60) return 0.5;
  return 0.4;
}

function describeSoL(sol) {
  if (sol < 5) return 'Destitute';
  if (sol < 10) return 'Struggling';
  if (sol < 15) return 'Impoverished';
  if (sol < 20) return 'Middling';
  if (sol < 25) return 'Secure';
  if (sol < 30) return 'Prosperous';
  if (sol < 40) return 'Affluent';
  if (sol < 50) return 'Wealthy';
  if (sol < 60) return 'Lavish';
  return 'Opulent';
}

function getTotalPopulation() {
  return population.reduce((sum, g) => sum + g.male + g.female, 0);
}

function updateStats() {
  const totalMale = population.reduce((sum, group) => sum + group.male, 0);
  const totalFemale = population.reduce((sum, group) => sum + group.female, 0);
  const totalPop = totalMale + totalFemale;
  const birthsThisDecade = population[0].male + population[0].female;

  document.getElementById("stats").innerHTML = `
    <strong>Total Male Population:</strong> ${totalMale.toLocaleString()}<br>
    <strong>Total Female Population:</strong> ${totalFemale.toLocaleString()}<br>
    <strong>Total Population:</strong> ${totalPop.toLocaleString()}<br>
    <strong>Births This Decade:</strong> ${birthsThisDecade.toLocaleString()}
  `;
}

// Draws population over time graph
function drawPopulationGraph() {
  const graph = document.getElementById("popGraph");
  if (!graph) return;
  graph.innerHTML = "";

  const padding = 40;
  const width = graph.clientWidth;
  const height = graph.clientHeight;
  const maxPop = Math.max(...totalPopHistory.map(d => d.population));

  // Draw axes
  const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  xAxis.setAttribute("x1", padding);
  xAxis.setAttribute("y1", height - padding);
  xAxis.setAttribute("x2", width - padding);
  xAxis.setAttribute("y2", height - padding);
  xAxis.setAttribute("stroke", "#333");
  graph.appendChild(xAxis);

  const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  yAxis.setAttribute("x1", padding);
  yAxis.setAttribute("y1", padding);
  yAxis.setAttribute("x2", padding);
  yAxis.setAttribute("y2", height - padding);
  yAxis.setAttribute("stroke", "#333");
  graph.appendChild(yAxis);

  // Plot line segments for each population data point
  totalPopHistory.forEach((point, i) => {
    if (i === 0) return;
    const prev = totalPopHistory[i - 1];

    const x1 = padding + ((prev.year - 0) / 500) * (width - 2 * padding);
    const y1 = height - padding - (prev.population / maxPop) * (height - 2 * padding);

    const x2 = padding + ((point.year - 0) / 500) * (width - 2 * padding);
    const y2 = height - padding - (point.population / maxPop) * (height - 2 * padding);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#4a90e2");
    line.setAttribute("stroke-width", "2");
    graph.appendChild(line);
  });
}