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
        title: "Gasoline model cars still very popular",
        wrap: 200,
        align: "centre"
      },
      x: 150,
      y: 400,
      dy: -147,
      dx: 32
    },{
      note: {
        label: "Fewer diesel cars in the market with varying performance",
        title: "Diesel Car models seem to be going extinct slowly",
        wrap: 250,
        align: "left"
      },
      connector: {
        end: "arrow" // 'dot' also available
      },
      x: 380,
      y: 270,
      dy: -145,
      dx: 2
    },{
      //below in makeAnnotations has type set to d3.annotationLabel
      //you can add this type value below to override that default
      type: d3.annotationCalloutCircle,
      note: {
        label: "All the electric cars in the market have over 70 MPG",
        title: "Electric cars have the best fuel efficiency",
        wrap: 300
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
            label: "Not surprisingly, larger cars with more engine cylinders perform poorly on fuel efficiency",
            title: "Larger circles indicate larger car models",
            wrap: 350
        },
        connector: {
            end: "dot",
            type: "curve",
            //can also add a curve type, e.g. curve: d3.curveStep
            points: [[0, 0],[0, 0]]
        },
        x: 540,
        y: 450,
        dy: -287,
        dx: 162
    },{
        //below in makeAnnotations has type set to d3.annotationLabel
        //you can add this type value below to override that default
        type: d3.annotationCalloutCircle,
        note: {
          label: "",
          title: "Electric cars have the best fuel efficiency",
          wrap: 190
        },
        //settings for the subject, in this case the circle radius
        subject: {
          radius: 120
        },
        x: 70,
        y: 140,
        dy: 135,
        dx: 144
    }].map(function(d1){ d1.color = "#E8336D"; return d1})
    
const makeAnnotations2 = d3.annotation()
                            .type(d3.annotationLabel)
                            .annotations(annotations2)

const annotations3 = [
    {
        note: {
            label: "There might be other factors at play but definitely the market is growing. All the major players seem to be getting in the act",
            title: "Is fuel efficiency enough for customers to make a move to electric vehicles?",
            wrap: 450
        },
        connector: {
            end: "dot",
            type: "curve",
            //can also add a curve type, e.g. curve: d3.curveStep
            points: [[0, 0],[0, 0]]
        },
        x: 100,
        y: 200,
        dy: -37,
        dx: 462
    }].map(function(d2){ d2.color = "#E8336D"; return d2})
    
const makeAnnotations3 = d3.annotation()
                            .type(d3.annotationLabel)
                            .annotations(annotations3)

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

    //d3.select("svgb")
    svgb.append("g")
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

    svgc.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations3)
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
    console.log(annotations2)
    drawCanvas3()
    generateScales3()
    drawPoints3()
    generateAxes3()
}
req.send()