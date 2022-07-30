let url = 'https://raw.githubusercontent.com/srp10/srp10.github.io/main/cars2017.json'
let req = new XMLHttpRequest()

let values2 =[]

let xScale2
let yScale2

let xAxis2
let yAxis2

let width2 = 865
let height2 = 500
let padding2 = 40

let svgb = d3.select('#canvas2')
let tooltip2 = d3.select('#tooltip')

let generateScales2 = () => {
    
    xScale2 = d3.scaleLog()
                        .domain([d3.min(values2, (item) => {
                            return item['AverageCityMPG']
                        }) - 1 , d3.max(values2, (item) => {
                            return item['AverageCityMPG']
                        }) + 1])
                        .range([padding2, width2-padding2])

    yScale2 = d3.scaleLog()
                        .domain([d3.min(values2, (item) => {
                            return item['AverageHighwayMPG']
                        }) - 1 , d3.max(values2, (item) => {
                            return item['AverageHighwayMPG']
                        }) + 1])
                        .range([height2-padding2, padding2])

}

let drawCanvas2 = () => {
    svgb.attr('width', width2)
    svgb.attr('height', height2)
}

let drawPoints = () => {

    svgb.selectAll('circle')
            .data(values2)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('r', (item) => {
                return item['EngineCylinders']
            })
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
                if(item['Fuel'] === 'Gasoline'){
                    return 'lightgreen'
                }else{
                    return 'orange'
                }
            })
            .on('mouseover', (item) => {
                tooltip.transition()
                    .style('visibility', 'visible')
                
                tooltip.text(item['Make'] + ' - ' + item['Fuel'] + ' - ' + item['EngineCylinders'])
            
            })
            .on('mouseout', (item) => {
                tooltip.transition()
                    .style('visibility', 'hidden')
            })
}

let generateAxes2 = () => {

    xAxis2 = d3.axisBottom(xScale2)
                .tickFormat(d3.format('d'))
                

    yAxis2 = d3.axisLeft(yScale2)
                .tickFormat(d3.format('d'))


    svgb.append('g')
        .call(xAxis2)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height2-padding2) +')')

    svgb.append('g')
        .call(yAxis2)
        .attr('id', 'y-axis')
        .attr('transform','translate(' + padding2 + ', 0)')
}

const pages = document.querySelectorAll(".page");
    const translateAmount = 100; 
    let translate = 0;

slide = (direction) => {
        
direction === "next" ? translate -= translateAmount : translate += translateAmount;
    
pages.forEach(
        pages => (pages.style.transform = `translateX(${translate}%)`)
     );
}

req.open('GET', url, true)
req.onload = () => {
    values = JSON.parse(req.responseText)
    console.log(values2)
    drawCanvas2()
    generateScales2()
    drawPoints2()
    generateAxes2()
}
req.send()
