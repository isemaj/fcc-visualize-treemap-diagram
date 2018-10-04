import * as d3 from 'd3';

import '../styles/app.scss';

// const DATASETS = {
//   videogames: {
//     TITLE: 'Video Game Sales',
//     DESCRIPTION: 'Top 100 Most Sold Video Games Groupedby Platform',
//     FILE_PATH: 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json' 
//   },
//   movies: {
//     TITLE: 'Movie Sales',
//     DESCRITION: 'Top 100 Highest Grossing Movies Grouped By Genre',
//     FILE_PATH: 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json'

//   },
//   kickstarter: {
//     TITLE: 'Kickstarter Projects',
//     DESCRITION: 'Top 100 Most Pledged Kickstarter Campaigns By Category',
//     FILE_PATH: 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json'
//   }
// }

// d3.selectAll('a')
//   .on('click', function() {
//     console.log(DATASETS[d3.select(this).attr('id')])
//   })

const video_game_dataset = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json';
const movie_dataset = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json';
const kickstarter_dataset = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json';

let urlParams = new URLSearchParams(window.location.search);

const files = [video_game_dataset, movie_dataset, kickstarter_dataset];
const promises = [];
files.forEach((url) => promises.push(d3.json(url)))

const svg = d3.select('svg')
const svg_width = +svg.attr('width')
const svg_height = +svg.attr('height')

const colorScheme = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabebe', '#469990', '#e6beff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9']
const fader = (color) => d3.interpolateRgb(color, '#fff')(0.3)
const color = d3.scaleOrdinal(colorScheme.map(fader));

Promise.all(promises)
  .then((res) => ready(res))
  .then((err) => readError(err))

const readError = (err) => {
  if (err) throw err;
}

const ready = (res) => {
  const root = d3.hierarchy(res[0])
    .eachBefore((d) => {
        d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; 
      })
    .sum(d => d.value)
    .sort((a,b) => b.height - a.height || b.value - a.value)

  const treemapLayout = d3.treemap()
    .size([svg_width, svg_height])
    .round(true)
    .paddingInner(1);

  treemapLayout(root)

  let treeNodes = svg.selectAll('g')
    .data(root.leaves())
    .enter()
    .append('g').attr('class', 'node')
    .attr('transform', (d) => `translate(${d.x0}, ${d.y0})`)
    // .attr('fill', (d) => console.log(d))

  treeNodes.append('rect')
    .attr('fill', (d) => color(d.data.category))
    .attr('width', (d) => d.x1 - d.x0)
    .attr('height', (d) => d.y1 - d.y0) 
    .style('stroke', '#2f2f2f')
    .style('overflow-wrap', )

  treeNodes.append('text')
    .selectAll('tspan')
    .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append('tspan')
    .attr('x', 4)
    .attr('y', (d,i) => 13 + i * 10)
    .text((d) => d)
    .style('fill', 'black')
}