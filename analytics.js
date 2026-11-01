const analyticsPanel = document.getElementById("analyticsPanel");
const toggleBtn = document.getElementById("toggleAnalyticsBtn");

toggleBtn.addEventListener("click", () => {
  const isVisible = analyticsPanel.style.display === "block";
  analyticsPanel.style.display = isVisible ? "none" : "block";
  toggleBtn.textContent = isVisible ? "Show Analytics" : "Hide Analytics";

  if (!isVisible) {
    drawPopulationGraph();
  }
});

// Draw line graph of total population over time
function drawPopulationGraph() {
  const statsDiv = document.getElementById("stats");
  const data = totalPopHistory.map(p => ({ year: p.year, pop: p.population }));
  let graphHTML = `<h3>Total Population Over Time</h3><svg width="600" height="200">`;

  if (data.length >= 2) {
    const maxPop = Math.max(...data.map(d => d.pop));
    const minYear = Math.min(...data.map(d => d.year));
    const maxYear = Math.max(...data.map(d => d.year));

    data.forEach((d, i) => {
      if (i === 0) return;
      const x1 = ((data[i - 1].year - minYear) / (maxYear - minYear)) * 580 + 10;
      const y1 = 190 - ((data[i - 1].pop / maxPop) * 180);
      const x2 = ((d.year - minYear) / (maxYear - minYear)) * 580 + 10;
      const y2 = 190 - ((d.pop / maxPop) * 180);
      graphHTML += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="black" stroke-width="2" />`;
    });
  }

  graphHTML += `</svg>`;
  statsDiv.innerHTML = graphHTML;
}