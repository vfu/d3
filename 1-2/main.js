const margin = {top: 45, right: 30, bottom: 50, left: 80};
const width = 600; // Total width of the SVG parent
const height = 600; // Total height of the SVG parent
const padding = 1; // Vertical space between the bars of the histogram
const barsColor = 'steelblue';

// Load data here
d3.csv('../data/pay_by_gender_tennis.csv').then(data => {
    console.log(data);
    const earnings = [];
    data.forEach(d => {
        earnings.push(parseInt(d.earnings_USD_2019));
    });
    console.log(earnings);
    createHistogram(earnings);
});

// Create Histogram
const createHistogram = (data) => {
  const bins = d3.bin().thresholds(15)(data);
  console.log(bins);

  const hChart = d3.select('#viz')
    .append('svg')
      .attr('viewbox', [0, 0, width, height])
      .attr('width', width)
      .attr('height', height)
      .style('background', 'lightblue');

//   hChart.append('rect')
//     .attr('width', width)
//     .attr('height', height)
//     .attr('fill', 'yellow');

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(bins, b => b.length)])
    .range([0, width - margin.right - margin.left])
    .nice();
  
  const ul = bins[bins.length-1].x1;
  console.log(ul);
  const yScale = d3.scaleLinear()
    .domain([ul, 0])
    .range([0, height - margin.top - margin.bottom]);

  const yAxis = d3.axisLeft(yScale).ticks(17).tickFormat(d3.format('~s'));

  hChart
    .append('g')
      .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

  hChart
    .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);
  
  hChart
    .append('text')
      .attr('x', margin.left / 2)
      .attr('y', margin.top / 2)
      .text('Earnings of the top tennis players in 2019 (USD)')
      .attr('style', 'font-weight: bold;');

  const padding = 1;
  const hist = hChart.append('g');
  hist.selectAll('rect').data(bins).join('rect')
    .attr('width', d => xScale(d.length))
    .attr('height', d => yScale(d.x0) - yScale(d.x1) - padding)
    .attr('x', margin.left)
    .attr('y', (d, i) => yScale(d.x1) + margin.top + padding)
    .attr('fill', 'steelblue');

  const myGenerator = d3.line()
    .x(d => xScale(d.length) + margin.left)
    .y(d => yScale(d.x0) + margin.top + (yScale(d.x1) - yScale(d.x0) + padding) / 2)
    .curve(d3.curveCatmullRom);

  hChart
    .append('path')
      .attr('d', myGenerator(bins))
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', 'red');
  
  const areaGenerator = d3.area()
    .x0(d => margin.left)
    .x1(d => xScale(d.length) + margin.left)
    .y(d => yScale(d.x0) - margin.top/2 + padding + margin.bottom)
    .curve(d3.curveCardinal);

  hChart
    .append('path')
      .attr('d', areaGenerator(bins))
      .attr('opacity', .5)
      .attr('fill', 'yellow');
};


// Create Split Violin Plot
const createViolin = () => {
  
};