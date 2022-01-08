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
            .attr('height', height);
            // .style('background', 'yellow');
    
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

    const violinSymmetryAxisPosition = margin.left + (width - margin.right - margin.left) / 2;
    const mAreaGenerator = d3.area()
    .x0(violinSymmetryAxisPosition)
    .x1((d, i) => {
        if (i === 0 || i === mBins.length - 1) {
            return xScale(d[0]) + violinSymmetryAxisPosition;
        } else {
            return xScale(d.length) + violinSymmetryAxisPosition;
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
    const colorMenCircles = '#BF9B30';
    const colorWomenCircles = '#718233';
    const colorMenArea = '#F2C53D';
    const colorWomenArea = '#A6BF4B';
    svg
    .append('path')
      .attr('d', mAreaGenerator(mBins))
      .attr('opacity', .8)
      .attr('fill', colorMenArea)
      .attr('stroke', 'none')
      .style('filter', 'url(#glow)');

    const fAreaGenerator = d3.area()
        .x0((d, i) => {
            if (i === 0 || i === fBins.length - 1) {
                return violinSymmetryAxisPosition - xScale(d[0]);
            } else {
                return violinSymmetryAxisPosition - xScale(d.length);
            }
        })
        .x1(violinSymmetryAxisPosition)
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
        .attr('opacity', .8)
        .attr('fill', colorWomenArea)
        .attr('stroke', 'none')
        .style('filter', 'url(#glow)');
    
    const circlesRadius = 3;
    const circlesPadding = 1;
    
    const simulation = d3.forceSimulation(data)
        .force('forceX', d3.forceX(violinSymmetryAxisPosition).strength(0.1))
        .force('forceY', d3.forceY(d => yScale(d.earnings_USD_2019)).strength(10))
        .force('collide', d3.forceCollide(circlesRadius + circlesPadding))
        .force('axis', () => {
            data.forEach(d => {
                if(d.gender === 'men' && d.x < violinSymmetryAxisPosition + circlesRadius) {
                    d.vx += 0.004 * d.x;
                }

                if(d.gender === 'women' && d.x > violinSymmetryAxisPosition - circlesRadius) {
                    d.vx -= 0.004 * d.x;
                }
            })
        })
        .stop()
        .tick(300);
    console.log(data);
    
    svg
        .append('g')
        .selectAll('circle')
        .data(data)
        .join('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', circlesRadius)
            .style('fill', d => d.gender === 'women' ? colorWomenCircles : colorMenCircles)
            .style('stroke', d => d.gender === 'women' ? colorWomenCircles : colorMenCircles)
            .attr('fill-opacity', 0.6);

    d3.selectAll('circle')
        .on('mouseover', (event, d) => {
            handleMouseOver(event, d);
        })
        .on('mouseout', (event, d) => {
            handleMouseOut();
        });

    const tooltip = d3.select('.tooltip');
    const f = d3.format('.4s');
    const handleMouseOver = (event, d) => {
        console.log(event);
        tooltip.select('.name').text(d.name);
        tooltip.select('.home').text(d.country);
        tooltip.select('.total-earnings').text(f(d.earnings_USD_2019));
        tooltip.classed('visible', true);
        tooltip.style('top', event.pageY + 20+ "px" );
        tooltip.style('left', event.pageX + 20 + "px");
        
    }

    const handleMouseOut = () => {
        tooltip.classed('visible', false);
    }
    const rectWidth = 40;
    const rectHeight = 20;
    svg.append('rect')
        .attr('x', margin.left + margin.right)
        .attr('y', margin.top )
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', colorWomenArea)
        .attr('fill-opacity', 0.8)
    svg.append('text')
        .attr('x', margin.left + margin.right + rectWidth + 10)
        .attr('y', margin.top + rectHeight - 4)
        .text('Women');
    
        svg.append('rect')
        .attr('x', margin.left + margin.right)
        .attr('y', margin.top + rectHeight + 10)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', colorMenArea)
        .attr('fill-opacity', 0.8)
    svg.append('text')
        .attr('x', margin.left + margin.right + rectWidth + 10)
        .attr('y', margin.top + rectHeight + 10 + rectHeight - 4)
        .text('Men');
    
    // Append container for the effect: defs
   const defs = svg.append('defs');

   // Add filter for the glow effect
   const filter = defs
      .append('filter')
         .attr('id', 'glow');
   filter
      .append('feGaussianBlur')
         .attr('stdDeviation', '3.5')
         .attr('result', 'coloredBlur');
   const feMerge = filter
      .append('feMerge');
   feMerge.append('feMergeNode')
      .attr('in', 'coloredBlur');
   feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');
};