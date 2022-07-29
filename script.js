let url = 'https://github.com/srp10/srp10.github.io/blob/main/cars2017.json'
let req = new XMLHttpRequest()

let values =[]

let xScale
let yScale

let xAxis
let yAxis

let width = 800
let height = 600
let padding = 40

let svg = d3.select('svg')
let tooltip = d3.select('#tooltip')

let generateScales = () => {
    
    xScale = d3.scaleLinear()
                        .domain([10, 600])
                        .range([padding, width-padding])

    yScale = d3.scaleLinear()
                        .domain([d3.min(values, (item) => {
                            return item['AverageHighwayMPG']
                        }), d3.max(values, (item) => {
                            return item['AverageHighwayMPG']
                        })])
                        .range([padding, height-padding])

}

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let drawPoints = () => {

    svg.selectAll('circle')
            .data(values)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('r', '5')
            .attr('data-xvalue', (item) => {
                return item['AverageCityMPG']
            })
            .attr('data-yvalue', (item) => {
                return item['AverageHighwayMPG']
            })
          .attr('cx', (item) => {
              return xScale(item['AverageCityMPG'])
          })         
            .attr('cy', (item) => {
                return yScale(item['AverageHighwayMPG'])
            })
            .attr('fill', (item) => {
                    return 'lightgreen'
            })
            .on('mouseover', (item) => {
                tooltip.transition()
                    .style('visibility', 'visible')
                
                tooltip.attr('make', item['Make'])
            })
            .on('mouseout', (item) => {
                tooltip.transition()
                    .style('visibility', 'hidden')
            })
}

let generateAxes = () => {

    xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format("~s"))
                

    yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.format("~s"))


    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height-padding) +')')

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform','translate(' + padding + ', 0)')
}


req.open('GET', url, true)
req.onload = () => {
    values = JSON.parse(req.responseText)
    console.log(values)
    drawCanvas()
    generateScales()
    drawPoints()
    generateAxes()
}
req.send()