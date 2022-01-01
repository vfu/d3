d3.csv('../data/top_albums.csv').then(data => {
    createBubbleChart(data);
});

const createBubbleChart = (data) => {
    const metrics = ['total_album_consumption_millions', 'album_sales_millions', 'song_sales', 'on_demand_audio_streams_millions', 'on_demand_video_streams_millions'];
    const artists = [];
    console.log(data);
    
    data.forEach(datum => {
        metrics.forEach(metric => {
            datum[metric] = parseFloat(datum[metric]);
        });
        artists.push(datum);
    });
    console.log(artists);

    const margin = {top: 40, right: 30, bottom: 60, left: 40};
    const width = 1160;
    const height = 380;
    
    const bubbleChart = d3.select('#bubble-chart')
      .append('svg')
        .attr('viewbox', [0, 0, width, height])
        .attr('width', width)
        .attr('height', height);

    const audioStreamsScale = d3.scaleLinear()
      .domain([0, d3.max(artists, d => d.on_demand_audio_streams_millions) + 500])
      .range([0, width - margin.left - margin.right]);

    bubbleChart
      .append('g')
         .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
         .call(d3.axisBottom(audioStreamsScale));
    
    bubbleChart.append('text')
      .text('On-demand Audio Streams (millions)')
      .attr('text-anchor', 'end')
      .attr('x', width)
      .attr('y', height - margin.top/2)
      .attr('style', 'font-weight:bold;');
    
    const videoStreamsScale = d3.scaleLinear()
      .domain([0, d3.max(artists, d => d.on_demand_video_streams_millions) + 300])
      .range([height - margin.bottom, margin.top]);

    bubbleChart
      .append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(videoStreamsScale));

    bubbleChart.append('text')
      .text('On-demand Video Streams (millions)')
      .attr('text-anchor', 'start')
      .attr('x', 0)
      .attr('y', margin.top/2)
      .attr('style', 'font-weight:bold;');
    
    const maxRadius = 25;
    const bubblesAreaScale = d3.scaleSqrt()
    .domain([0, d3.max(artists, d => d.album_sales_millions)])
    .range([0, maxRadius]);

    const colorScale = d3.scaleOrdinal()
      .domain(artists)
      .range(d3.schemeTableau10);
    
    bubbleChart
      .append('g')
        .attr('class', 'bubbles-group')
      .selectAll('circle')
      .data(artists)
      .join('circle')
        .attr('cx', d => audioStreamsScale(d.on_demand_audio_streams_millions) + margin.left)
        .attr('cy', d => videoStreamsScale(d.on_demand_video_streams_millions))
        .attr('r', d => bubblesAreaScale(d.album_sales_millions))
        .attr('fill', d => colorScale(d))
    
    const legendAlbum = d3.select('.legend-color')
      .append('ul')
      .selectAll('li')
      .data(artists)
      .join('li')
        .attr('class', 'legend-album');
    
    legendAlbum
      .append('span')
        .attr('class', 'legend-circle')
        .style('background-color', (d, i) => colorScale(d));
    
    legendAlbum
      .append('span')
        .attr('class', 'legend-label')
        .text(d => d.title);
    
    const sWidth = 200;
    const sHeight = 100;
    const legendSales = d3.select('.legend-area')
      .append('svg')
        .attr('viewbox', [0, 0, sWidth, sHeight])
        .attr('width', sWidth)
        .attr('height', sHeight)
    
    legendSales
      .append('circle')
        .attr('r', 7)
        .attr('cx', sWidth/2)
        .attr('cy', sHeight/2 + 27 - 3.5)
        .attr('fill', '#727a87')
        .attr('opacity', '0.4');

    legendSales
    .append('circle')
        .attr('r', 20)
        .attr('cx', sWidth/2)
        .attr('cy', sHeight/2 + 10)
        .attr('fill', '#727a87')
        .attr('opacity', '0.4');
    
    legendSales
    .append('circle')
        .attr('r', 30)
        .attr('cx', sWidth/2)
        .attr('cy', sHeight/2)
        .attr('fill', '#727a87')
        .attr('opacity', '0.4');
    
    legendSales
      .append('line')
        .attr('x1', sWidth/2)
        .attr('y1', sHeight/2 + 18)
        .attr('x2', sWidth/2 + 60)
        .attr('y2', sHeight/2 + 18)
        .attr('stroke', '#333')
        .attr('stroke-dasharray', '6 4');

    legendSales
        .append('line')
          .attr('x1', sWidth/2)
          .attr('y1', sHeight/2 - 10)
          .attr('x2', sWidth/2 + 60)
          .attr('y2', sHeight/2 - 10)
          .attr('stroke', '#333')
          .attr('stroke-dasharray', '6 4');

    legendSales
    .append('line')
        .attr('x1', sWidth/2)
        .attr('y1', sHeight/2 - 30)
        .attr('x2', sWidth/2 + 60)
        .attr('y2', sHeight/2 - 30)
        .attr('stroke', '#333')
        .attr('stroke-dasharray', '6 4');

    legendSales
      .append('text')
        .attr('class', 'label label-value')
        .attr('x', sWidth/2 + 70)
        .attr('y', 25)
        .text('1.5M');
    
    legendSales
    .append('text')
        .attr('class', 'label label-value')
        .attr('x', sWidth/2 + 70)
        .attr('y', 45)
        .text('0.5M');

    legendSales
    .append('text')
        .attr('class', 'label label-value')
        .attr('x', sWidth/2 + 70)
        .attr('y', 73)
        .text('0.5M');
};



