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
const svg = d3.select('svg')
const svg_width = +svg.attr('width')
const svg_height = +svg.attr('height')
const colorScheme = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabebe', '#469990', '#e6beff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9']
const fader = (color) => d3.interpolateRgb(color, '#fff')(0.3)
const color = d3.scaleOrdinal(colorScheme.map(fader));

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

    const treeNodes = svg.selectAll('g')
      .exit()
      .remove()
      .data(rootNode.leaves())
      .enter()
      .append('g').attr('class', 'node')
      .attr('transform', (d) => `translate(${d.x0}, ${d.y0})`)

    treeNodes.append('rect')
      .attr('fill', (d) => color(d.data.category))
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0) 
      .style('stroke', '#2f2f2f')

    treeNodes.append('text')
      .selectAll('tspan')
      .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter()
      .append('tspan')
      .attr('x', 4)
      .attr('y', (d,i) => 13 + i * 10)
      .text((d) => d)
      .style('fill', 'black')

  })
}

const setData = (dataID) => {
  document.getElementById('title').innerHTML = DATASETS[dataID].TITLE;
  document.getElementById('description').innerHTML = DATASETS[dataID].DESCRIPTION;

  createTile(DATASETS[dataID].FILE_PATH)
}

setData(defaultSet);
