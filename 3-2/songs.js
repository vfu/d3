const topRockSongs = [
    { artist: "Fleetwod Mac", title: "Dreams", sales_and_streams: 1882000 },
    { artist: "AJR", title: "Bang!", sales_and_streams: 1627000 },
    { artist: "Imagine Dragons", title: "Believer", sales_and_streams: 1571000 },
    { artist: "Journey", title: "Don't Stop Believin'", sales_and_streams: 1497000 },
    { artist: "Eagles", title: "Hotel California", sales_and_streams: 1393000 }
 ];

const topSongsSection = d3.select('#top-songs')
topSongsSection.append('h3').text('Top Rock Songs');

const circlesChartWidth = 550;
const circlesChartHeight = 130;
const circlesChart = topSongsSection
  .append('svg')
    .attr('viewbox', [0, 0, circlesChartWidth, circlesChartHeight])
    .attr('width', circlesChartWidth)
    .attr('height', circlesChartHeight);

circlesChart
  .append('line')
    .attr('x1', 0)
    .attr('y1', circlesChartHeight / 2)
    .attr('x2', circlesChartWidth)
    .attr('y2', circlesChartHeight / 2)
    .attr('stroke', '#333')
    .attr('stroke-width', '2px')

const circlesChartGroup = circlesChart
  .selectAll('g')
  .data(topRockSongs)
  .join('g')
    .attr('class', 'circle-group');

const maxRadius = 40;
circlesScale = d3.scaleSqrt()
  .domain([0, d3.max(topRockSongs, d => d.sales_and_streams)])
  .range([0, maxRadius]);

const circlesMargin = 15;
circlesChartGroup
  .append('circle')
    .attr('r', d => circlesScale(d.sales_and_streams))
    .attr('cx', (d, i) => maxRadius + circlesMargin + (i * 2 * (maxRadius + circlesMargin)))
    .attr('cy', circlesChartHeight / 2)
    .attr('fill', '#8da0cb');

circlesChartGroup
  .append('text')
    .attr('class', 'label label-value')
    .attr('x', (d, i) => maxRadius + circlesMargin + (i * 2 * (maxRadius + circlesMargin)))
    .attr('y', 20)
    .text(d => (d.sales_and_streams / 1000000) + 'M')
      .attr('text-anchor', 'middle');

circlesChartGroup
.append('text')
.attr('class', 'label label-value')
.attr('x', (d, i) => maxRadius + circlesMargin + (i * 2 * (maxRadius + circlesMargin)))
.attr('y', circlesChartHeight - 5)
.text(d => d.title)
    .attr('text-anchor', 'middle');