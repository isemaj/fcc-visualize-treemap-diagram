import * as d3 from 'd3';

import '../styles/app.scss';

const DATASETS = {
  videogames: {
    TITLE: 'Video Game Sales',
    DESCRIPTION: 'Top 100 Most Sold Video Games Grouped by Platform',
    FILE_PATH: 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json' 
  },
  movies: {
    TITLE: 'Movie Sales',
    DESCRIPTION: 'Top 100 Highest Grossing Movies Grouped By Genre',
    FILE_PATH: 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json'

  },
  kickstarter: {
    TITLE: 'Kickstarter Projects',
    DESCRIPTION: 'Top 100 Most Pledged Kickstarter Campaigns By Category',
    FILE_PATH: 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json'
  }
}

const defaultSet = 'videogames';
const svg = d3.select('svg');
const legend = d3.select('#legend');
const svg_width = +svg.attr('width')
const svg_height = +svg.attr('height')
const colorScheme = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabebe', '#469990', '#e6beff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '##FF6666', '#a9a9a9']
const fader = (color) => d3.interpolateRgb(color, '#fff')(0.3)
const color = d3.scaleOrdinal(colorScheme.map(fader));

const tooltip = d3.select('body')
  .append('div')
  .attr('id', 'tooltip')

d3.selectAll('a')
  .on('click', function() {
    setData(d3.select(this).attr('id'))
  })

const createTile = (file_path) => {
  d3.json(file_path).then(function(data) {

    const rootNode = d3.hierarchy(data) 
      .sum(d => d.value)
      .sort((a, b) => b.height - a.height || b.value - a.value)

    const treemapLayout = d3.treemap()
      .size([svg_width, svg_height])
      .round(true)
      .paddingInner(1);

    treemapLayout(rootNode);

    svg.selectAll('g')
      .remove()

    const treeNodes = svg.selectAll('g')
      .data(rootNode.leaves())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.x0}, ${d.y0})`)
      .on('mouseover', (d, i) => {
        tooltip.html(`
          <strong>Name:</strong> ${d.data.name} 
          <br> 
          <strong>Category:</strong> ${d.data.category}
          <br> 
          <strong>Value:</strong> ${d.data.value}`)
        .transition()
        .duration(700)
        .style('left', d3.event.pageX)
        .style('top', d3.event.pageY)
        .style('opacity', 0.9)
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0)
      })

    treeNodes.append('rect')
      .attr('fill', (d) => color(d.data.category))
      .transition()
      .duration(1000)
      .attr('class', 'legend-item')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0) 
      .style('stroke', '#2f2f2f')

    treeNodes.append('text')
      .selectAll('tspan')
      .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter()
      .append('tspan')
      .transition()
      .delay(400)
      .duration(1000)
      .attr('x', 4)
      .attr('y', (d,i) => 13 + i * 10)
      .text((d) => d)
      .style('fill', 'rgba(0,0,0,0.7)')

    let categories = rootNode.leaves().map((d) => d.data.category).filter((value, index, self) => self.indexOf(value) === index)

    let lWidth = +legend.attr('width');
    let legendHSpacer = 150;
    let legendVSpacer = 20;
    let elemsPerRow = Math.floor(lWidth/legendHSpacer)
    let tileSize = 15;

    legend.selectAll('g')
      .remove()

    let legendData = legend
      .append('g')
      .attr('transform', 'translate(60, 0)')
      .selectAll('g')
      .data(categories)
      .enter()
      .append('g')
      .attr('transform', (d,i) => `translate(${(i%elemsPerRow) * legendHSpacer}, ${(Math.floor(i / elemsPerRow)) * tileSize + (legendVSpacer * Math.floor( i / elemsPerRow))})`)

    legendData.append('rect')
      .attr('class', 'legend-item')
      .attr('width', tileSize)
      .attr('height', tileSize)
      .attr('fill', (d) => color(d))

    legendData.append('text')
      .attr('x', tileSize + 4)
      .attr('y', tileSize - 8)
      .text((d) => d)
  })
}

const setData = (dataID) => {
  document.getElementById('title').innerHTML = DATASETS[dataID].TITLE;
  document.getElementById('description').innerHTML = DATASETS[dataID].DESCRIPTION;

  createTile(DATASETS[dataID].FILE_PATH)
}

setData(defaultSet);
