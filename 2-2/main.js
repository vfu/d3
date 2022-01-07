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
    // createHistogram(earnings);
    createViolin(data);
});

// Create Histogram
const createHistogram = (data) => {
  const bins = d3.bin().thresholds(17)(data);
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
    .domain([0, ul])
    .range([height - margin.bottom, margin.top]);

  const yAxis = d3.axisLeft(yScale).ticks(15).tickFormat(d3.format('~s'));

  hChart
    .append('g')
      .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(10));

  hChart
    .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
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
    .attr('y', (d, i) => yScale(d.x1) + padding)
    .attr('fill', 'steelblue');

  bins.unshift([0, 0]);
  bins.push([0, 17000000]);
  console.log(bins);

  const myGenerator = d3.line()
    .x((d, i) => {
        if (i === 0 || i === bins.length - 1) {
            return xScale(d[0]) + margin.left;
        } else {
            return xScale(d.length) + margin.left
        }
    })
    .y((d, i) => {
        if (i == 0 || i == bins.length - 1) {
            return yScale(d[1]);
        } else {
            return yScale(d.x0) + (yScale(d.x1) - yScale(d.x0) - padding) / 2
        }
    })  
    .curve(d3.curveCatmullRom);

  hChart
    .append('path')
      .attr('d', myGenerator(bins))
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', 'red');
  
  const areaGenerator = d3.area()
    .x0(margin.left)
    .x1((d, i) => {
        if (i === 0 || i === bins.length - 1) {
            return xScale(d[0]) + margin.left;
        } else {
            return xScale(d.length) + margin.left;
        }
    })
    .y((d, i) => {
        if (i === 0 || i === bins.length - 1){
            return yScale(d[1]);
        } else {
            return yScale(d.x0) + (yScale(d.x1) - yScale(d.x0) - padding) / 2;
        }
    })
    .curve(d3.curveCatmullRom);

  hChart
    .append('path')
      .attr('d', areaGenerator(bins))
      .attr('opacity', .5)
      .attr('fill', 'yellow')
      .attr('stroke', 'none');
};


// Create Split Violin Plot
const createViolin = (data) => {
    console.log(data);
    const mEarninga = [];
    const fEarnings = [];
    data.forEach(d => {
        if (d.gender === 'men') {
            mEarninga.push(parseInt(d.earnings_USD_2019));
        } else if (d.gender === 'women'){
            fEarnings.push(parseInt(d.earnings_USD_2019));
        }
    });
    console.log(mEarninga);
    console.log(fEarnings);
    const mBins = d3.bin().thresholds(17)(mEarninga);
    const fBins = d3.bin().thresholds(15)(fEarnings);
    console.log(mBins);
    console.log(fBins);

    const midpoint = 200;
    const mUL = d3.max(mBins, d => d.length);
    const fUL = d3.max(fBins, d => d.length);
    console.log(mUL + ' ' + fUL);

    const xScale = d3.scaleLinear()
        .domain([0, Math.max(mUL, fUL)])
        .range([0, width - margin.left - margin.right - midpoint - midpoint/2]);

    const mH = mBins[mBins.length - 1].x1;
    const fH = fBins[fBins.length - 1].x1;
    console.log(mH + ' ' + fH);

    const yScale = d3.scaleLinear()
        .domain([0, Math.max(mH, fH)])
        .range([height - margin.bottom, margin.top]);

    const svg = d3.select('#viz')
        .append('svg')
            .attr('viewbox', [0, 0, width, height])
            .attr('width', width)
            .attr('height', height)
            .style('background', 'yellow');
    
    // x-Axis
    svg.append('line')
        .attr('x1', margin.left)
        .attr('y1', height - margin.bottom)
        .attr('x2', width - margin.right)
        .attr('y2', height - margin.bottom)
        .attr('stroke', '#333')
        .attr('stroke-width', 1);
    
    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).ticks(15).tickFormat(d3.format('~s')));

    svg.append('text')
        .attr('x', margin.left / 2)
        .attr('y', margin.top / 2)
        .text('Earnings of the top tennis players in 2019 (USD)')
        .attr('style', 'font-weight: bold;');
    
    mBins.unshift([0, 0]);
    mBins.push([0, 17000000]);
    fBins.unshift([0, 0]);
    fBins.push([0, 12000000]); 

    const mAreaGenerator = d3.area()
    .x0(margin.left + midpoint)
    .x1((d, i) => {
        if (i === 0 || i === mBins.length - 1) {
            return xScale(d[0]) + margin.left + midpoint;
        } else {
            return xScale(d.length) + margin.left + midpoint;
        }
    })
    .y((d, i) => {
        if (i === 0 || i === mBins.length - 1){
            return yScale(d[1]);
        } else {
            return yScale(d.x0) + (yScale(d.x1) - yScale(d.x0) - padding) / 2;
        }
    })
    .curve(d3.curveCatmullRom);

    svg
    .append('path')
      .attr('d', mAreaGenerator(mBins))
      .attr('opacity', .5)
      .attr('fill', 'orange')
      .attr('stroke', 'none');

    const fAreaGenerator = d3.area()
        .x0((d, i) => {
            if (i === 0 || i === fBins.length - 1) {
                return midpoint + margin.left;
            } else {
                return midpoint + margin.left - xScale(d.length);
            }
        })
        .x1(midpoint + margin.left)
        // .x1((d, i) => {
        //     if (i === 0 || i === fBins.length - 1) {
        //         return xScale(d[0] + margin.left + midpoint - d.length);
        //     } else {
        //         return xScale(d.length) + margin.left + midpoint - d.length;
        //     }
        // })
        .y((d, i) => {
            if (i === 0 || i === fBins.length - 1){
                return yScale(d[1]);
            } else {
                return yScale(d.x0) + (yScale(d.x1) - yScale(d.x0) - padding) / 2;
            }
        })
        .curve(d3.curveCatmullRom);

    svg
        .append('path')
        .attr('d', fAreaGenerator(fBins))
        .attr('opacity', .5)
        .attr('fill', 'green')
        .attr('stroke', 'none');
    
    
};