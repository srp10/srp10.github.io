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
        type: d3.annotationCalloutElbow,
        note: {
          label: "",
          title: "Electric cars have the best fuel efficiency",
          wrap: 190
        },
        //settings for the subject, in this case the circle radius
        
        x: 100,
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
            label: "There might be other factors at play but definitely the market is growing. All the major players seem to be getting in the act. These times of high inflation and high oil prices may indeed provide a good reason for customers to relook at their choice of cars.",
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
        y: 220,
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
                
                tooltip.text('Model:' + item['Make'] + '; ' + 'Fuel Type:' + item['Fuel'] + '; ' + 'Engine Cylinders:' + item['EngineCylinders'])
            
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
                
                tooltip2.text('Model:' + item['Make'] + '; ' + 'Fuel Type:' + item['Fuel'] + '; ' + 'Engine Cylinders:' + item['EngineCylinders'])
            
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
                
                tooltip3.text('Model:' + item['Make'] + '; ' + 'Fuel Type:' + item['Fuel'] + '; ' + 'Engine Cylinders:' + item['EngineCylinders'])
            
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
    // Render scene 1 - page 1
    drawCanvas()
    generateScales()
    drawPoints()
    generateAxes()
    // Render scene 2 - page 2
    drawCanvas2()
    generateScales2()
    drawPoints2()
    generateAxes2()
    // Render scene 3 - page 3
    drawCanvas3()
    generateScales3()
    drawPoints3()
    generateAxes3()
}
req.send()


// References
//Professor Hart’s lecture slides/notes for Data Visualization 
//Cars2017 dataset from https://flunky.github.io/cars2017.csv
//Data Visualization examples on scatterplots: https://www.notion.so/Visualize-Data-with-a-Scatterplot-Graph-f3b277dc35294accb4d42a0358b92009
//D3 Transitions: https://www.d3indepth.com/transitions/
//D3 Transitions: https://medium.com/@codefoxx/how-to-create-a-slide-transition-between-separate-pages-with-html-css-and-javascript-bb7a14393d1
//D3 Transitions: https://css-tricks.com/almanac/properties/t/transform/
//D3 Annotations: https://d3-annotation.susielu.com/#examples
//D3 Annotations: https://bl.ocks.org/susielu/a464c24d8b42f0c4d9fafe7b48e9e60a

