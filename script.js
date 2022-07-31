let url = 'https://raw.githubusercontent.com/srp10/srp10.github.io/main/cars2017.json'
let req = new XMLHttpRequest()

let values =[]

let xScale
let yScale

let xAxis
let yAxis

let width = 865
let height = 500
let padding = 40

let svg = d3.select('#canvas1')
let svgb = d3.select('#canvas2')
let svgc = d3.select('#canvas3')
let tooltip = d3.select('#tooltip')
let tooltip2 = d3.select('#tooltip2')
let tooltip3 = d3.select('#tooltip3')

const annotations = [
    {
      note: {
        label: "Most cars still run on gasoline",
        title: "Gasoline model cars still very popular"
      },
      x: 150,
      y: 350,
      dy: -107,
      dx: 62
    },{
      note: {
        label: "Fewer diesel cars in the market with varying performance",
        title: "Diesel Car models seem to be a dying species",
        wrap: 150,
        align: "left"
      },
      connector: {
        end: "arrow" // 'dot' also available
      },
      x: 380,
      y: 260,
      dy: -105,
      dx: 62
    },{
      //below in makeAnnotations has type set to d3.annotationLabel
      //you can add this type value below to override that default
      type: d3.annotationCalloutCircle,
      note: {
        label: "All the electric cars in the market have over 70 MPG",
        title: "Electric cars have the best fuel efficiency",
        wrap: 190
      },
      //settings for the subject, in this case the circle radius
      subject: {
        radius: 120
      },
      x: 770,
      y: 100,
      dy: 235,
      dx: -44
    }].map(function(d){ d.color = "#E8336D"; return d})

    const makeAnnotations = d3.annotation()
      .type(d3.annotationLabel)
      .annotations(annotations)


const annotations2 = [
    {
        note: {
            label: "Unsurprisingly, larger cars with more engine cylinders perform poorly on fuel efficiency",
            title: "Larger circles indicate larger car models",
            wrap: 150
        },
        connector: {
            end: "dot",
            type: "curve",
            //can also add a curve type, e.g. curve: d3.curveStep
            points: [[100, 14],[190, 52]]
        },
        x: 350,
        y: 150,
        dy: 137,
        dx: 262
    }].map(function(d){ d.color = "#E8336D"; return d})
    
    const makeAnnotations2 = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(annotations2)

let generateScales = () => {
    
    xScale = d3.scaleLog()
                        .domain([d3.min(values, (item) => {
                            return item['AverageCityMPG']
                        }) - 1 , d3.max(values, (item) => {
                            return item['AverageCityMPG']
                        }) + 1])
                        .range([padding, width-padding])

    yScale = d3.scaleLog()
                        .domain([d3.min(values, (item) => {
                            return item['AverageHighwayMPG']
                        }) - 1 , d3.max(values, (item) => {
                            return item['AverageHighwayMPG']
                        }) + 1])
                        .range([height-padding, padding])

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
            .attr('r', (item) => {
                return (item['EngineCylinders']+6)
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
                }else if (item['Fuel'] === 'Electricity') {
                    return 'red'
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

let generateAxes = () => {

    xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format('d'))

    yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.format('d'))  

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height-padding) +')')


    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform','translate(' + padding + ', 0)')

    d3.select("svg")
        .append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations)
        
}

let generateScales2 = () => {
    
    xScale = d3.scaleLinear()
                        .domain([d3.min(values, (item) => {
                            return item['EngineCylinders']
                        }) - 1 , d3.max(values, (item) => {
                            return item['EngineCylinders']
                        }) + 1])
                        .range([padding, width-padding])

    yScale = d3.scaleLinear()
                        .domain([d3.min(values, (item) => {
                            return item['AverageCityMPG']
                        }) - 1 , d3.max(values, (item) => {
                            return item['AverageCityMPG']
                        }) + 1])
                        .range([height-padding, padding])

}

let drawCanvas2 = () => {
    svgb.attr('width', width)
    svgb.attr('height', height)
}

let drawPoints2 = () => {

    svgb.selectAll('circle')
            .data(values)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('r', (item) => {
                return (item['EngineCylinders']+6)
            })
            .attr('data-xvalue', (item) => {
                return item['EngineCylinders']
            })
            .attr('data-yvalue', (item) => {
                return item['EngineCylinders']
            })
            .attr('cx', (item) => {
              return xScale(item['EngineCylinders'])
          })         
            .attr('cy', (item) => {
                return yScale(item['AverageCityMPG'])
            })
            .attr('fill', (item) => {
                if(item['Fuel'] === 'Gasoline'){
                    return 'lightgreen'
                }else if(item['Fuel'] === 'Electricity') {
                    return 'red'
                }else{
                    return 'orange'
                }
            })
            .on('mouseover', (item) => {
                tooltip2.transition()
                    .style('visibility', 'visible')
                
                tooltip2.text(item['Make'] + ' - ' + item['Fuel'] + ' - ' + item['EngineCylinders'])
            
            })
            .on('mouseout', (item) => {
                tooltip2.transition()
                    .style('visibility', 'hidden')
            })
}

let generateAxes2 = () => {

    xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format('d'))
                

    yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.format('d'))


    svgb.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height-padding) +')')

    svgb.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform','translate(' + padding + ', 0)')

    d3.select("svgb")
        .append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations2)
}

let generateScales3= () => {
    
    xScale = d3.scaleLinear()
                        .domain([d3.min(values, (item) => {
                            return item['EngineCylinders']
                        }) - 1 , d3.max(values, (item) => {
                            return item['EngineCylinders']
                        }) + 1])
                        .range([padding, width-padding])

    yScale = d3.scaleLinear()
                        .domain([d3.min(values, (item) => {
                            return item['AverageHighwayMPG']
                        }) - 1 , d3.max(values, (item) => {
                            return item['AverageHighwayMPG']
                        }) + 1])
                        .range([height-padding, padding])

}

let drawCanvas3 = () => {
    svgc.attr('width', width)
    svgc.attr('height', height)
}

let drawPoints3 = () => {

    svgc.selectAll('circle')
            .data(values)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('r', (item) => {
                return (item['EngineCylinders']+6)
            })
            .attr('data-xvalue', (item) => {
                return item['EngineCylinders']
            })
            .attr('data-yvalue', (item) => {
                return item['EngineCylinders']
            })
            .attr('cx', (item) => {
              return xScale(item['EngineCylinders'])
          })         
            .attr('cy', (item) => {
                return yScale(item['AverageHighwayMPG'])
            })
            .attr('fill', (item) => {
                if(item['Fuel'] === 'Gasoline'){
                    return 'lightgreen'
                }else if(item['Fuel'] === 'Electricity') {
                    return 'red'
                }else{
                    return 'orange'
                }
            })
            .on('mouseover', (item) => {
                tooltip3.transition()
                    .style('visibility', 'visible')
                
                tooltip3.text(item['Make'] + ' - ' + item['Fuel'] + ' - ' + item['EngineCylinders'])
            
            })
            .on('mouseout', (item) => {
                tooltip3.transition()
                    .style('visibility', 'hidden')
            })
}

let generateAxes3 = () => {

    xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format('d'))
                

    yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.format('d'))


    svgc.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height-padding) +')')

    svgc.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform','translate(' + padding + ', 0)')
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
    console.log(values)
    drawCanvas()
    generateScales()
    drawPoints()
    generateAxes()
    drawCanvas2()
    generateScales2()
    drawPoints2()
    generateAxes2()
    drawCanvas3()
    generateScales3()
    drawPoints3()
    generateAxes3()
}
req.send()