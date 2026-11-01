let activeDisease = {
    name: "Generic Disease",
    targetAges: [4, 5, 6],
    gender: "both",
    solThreshold: 30,
    mortalityRate: 0.05,
    exposureRate: 0.6,
    vaccinationCoverage: 0.0,
    active: false
  };
  
  function applyDisease(population, sol) {
    if (!activeDisease.active) return;
  
    const affected = JSON.parse(JSON.stringify(population));
  
    activeDisease.targetAges.forEach(i => {
      let group = affected[i];
      if (!group) return;
  
      const affectGender = g => {
        const vaccinated = group[g] * activeDisease.vaccinationCoverage;
        const susceptible = group[g] - vaccinated;
        const exposed = susceptible * activeDisease.exposureRate;
        const deaths = Math.floor(exposed * activeDisease.mortalityRate);
        population[i][g] = Math.max(0, population[i][g] - deaths);
      };
  
      if (sol < activeDisease.solThreshold) {
        if (activeDisease.gender === "male" || activeDisease.gender === "both") affectGender("male");
        if (activeDisease.gender === "female" || activeDisease.gender === "both") affectGender("female");
      }
    });
  }
  