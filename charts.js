var selectedArc;

async function selectCountry(){
    var cname = document.getElementById("autoComplete").value;
    var cselector = await d3.selectAll("#countryholder");
    var result = await fetchJSON(`search?cname=${cname}`);
    if(result == null){
        alert("Country not found");
    }
    else {
        d3.select("#searchcname").text(result[0].cname);
        d3.select("#cflag").attr("src", `flags/${result[0].countrykey}.png`);
        await cselector.selectAll("#select-flag").attr("src", `flags/${result[0].countrykey}.png`);
        await cselector.selectAll("#select-region").text(`Region: ${result[0].rname}`);
        await cselector.selectAll("#select-title").text(result[0].cname);
        //Population
        await cselector.selectAll("#select-population").text(`Population (in thousands): ${result[0].popnumber}`);
        await cselector.selectAll("#select-growthrate").text(`Population growth rate (average annual %): ${result[0].popgrowthrate}%`);
        await cselector.selectAll("#select-popdensity").text(`Population density (per km²): ${result[0].density}`);
        await cselector.selectAll("#select-SA").text(`Surface area: ${result[0].surfacearea} km²`);
        await cselector.selectAll("#select-sexratio").text(`Sex ratio (m per 100 f, 2017): ${result[0].sexratio}`);
        await cselector.selectAll("#select-urbanpop").text(`Urban population (% of total population): ${result[0].urbanpop}%`);
        await cselector.selectAll("#select-urbangrowthrate").text(`Urban population (% of total population): ${result[0].urbanpopgrowthrate}%`);
        //Economy
        await cselector.selectAll("#select-gdpval").text(`GDP: Gross domestic product (million current US$):  $${result[0].gdpval}`);
        await cselector.selectAll("#select-gdpgrowthrate").text(`GDP growth rate (annual %, const. 2005 prices): ${result[0].gdpgrowthrate}%`);
        await cselector.selectAll("#select-gdppercapita").text(`GDP per capita (current US$): $${result[0].gdppercapita}`);
        await cselector.selectAll("#select-agriculture").text(`Economy: Agriculture (% of GVA): ${result[0].agriculture} %`);
        await cselector.selectAll("#select-industry").text(`Economy: Industry (% of GVA): ${result[0].industry}%`);
        await cselector.selectAll("#select-other").text(`Economy: Services and other activity (% of GVA): ${result[0].other}%`);
        await cselector.selectAll("#select-imports").text(`International trade: Imports (million US$): $${result[0].imports}`);
        await cselector.selectAll("#select-exports").text(`International trade: Exports (million US$): $${result[0].exports}`);
        await cselector.selectAll("#select-unemployment").text(`Unemployment (% of labour force): ${result[0].unemployment}%`);
    }
    
}

async function lineupMouse(e){
    await tooltip.attr("style", `top: ${e.pageY}px; left: ${e.pageX+20}px; visibility: visible;`);
}

async function flagSelect(ckey){
    var xattr = $("#x-select option:selected");
    var yattr = $("#y-select option:selected");
    var data = dataset;
    var dat = data.filter(function(d){
        return (d.countrykey == ckey);
    });
    var content = tooltip.selectAll("#tooltip-content");
    await content.selectAll("*").remove();
    await tooltip.selectAll("#tooltip-flag").attr("src", `flags/${dat[0].countrykey}.png`);
    await tooltip.selectAll("#tooltip-title").text(dat[0].cname);
    await content.append("p").classed("ttxt", true).text(`X = ${xattr.text()}: ${dat[0][xattr.val()]}`);
    await content.append("p").classed("ttxt", true).text(`Y = ${yattr.text()}: ${dat[0][yattr.val()]}`);

}

async function barSelect(ckey){
    var data = dataset;
    var dat = data.filter(function(d){
        return (d.countrykey == ckey);
    });
    dat = dat[0];
    var content = tooltip.selectAll("#tooltip-content");
    await content.selectAll("*").remove();
    await tooltip.selectAll("#tooltip-flag").attr("src", `flags/${dat.countrykey}.png`);
    await tooltip.selectAll("#tooltip-title").text(dat.cname);
    await content.append("p").classed("ttxt", true).text(`Population (in thousands): ${dat.popnumber}`);
    await content.append("p").classed("ttxt", true).text(`Population growth rate (average annual %): ${dat.popgrowthrate}%`);
    await content.append("p").classed("ttxt", true).text(`Population density (per km²): ${dat.density}`);
    await content.append("p").classed("ttxt", true).text(`Surface area: ${dat.surfacearea} km²`);
    await content.append("p").classed("ttxt", true).text(`Sex ratio (m per 100 f, 2017): ${dat.sexratio}`);
    await content.append("p").classed("ttxt", true).text(`Urban population (% of total population): ${dat.urbanpop}%`);
    await content.append("p").classed("ttxt", true).text(`Urban population (% of total population): ${dat.urbanpopgrowthrate}%`);
}

async function gdpbarSelect(ckey){
    var data = dataset;
    var dat = data.filter(function(d){
        return (d.countrykey == ckey);
    });
    dat = dat[0];
    var content = tooltip.selectAll("#tooltip-content");
    await content.selectAll("*").remove();
    await tooltip.selectAll("#tooltip-flag").attr("src", `flags/${dat.countrykey}.png`);
    await tooltip.selectAll("#tooltip-title").text(dat.cname);
    await content.append("p").classed("ttxt", true).text(`GDP: Gross domestic product (million current US$):  $${dat.gdpval}`);
    await content.append("p").classed("ttxt", true).text(`GDP growth rate (annual %, const. 2005 prices): ${dat.gdpgrowthrate}%`);
    await content.append("p").classed("ttxt", true).text(`GDP per capita (current US$): $${dat.gdppercapita}`);
    await content.append("p").classed("ttxt", true).text(`Economy: Agriculture (% of GVA): ${dat.agriculture} %`);
    await content.append("p").classed("ttxt", true).text(`Economy: Industry (% of GVA): ${dat.industry}%`);
    await content.append("p").classed("ttxt", true).text(`Economy: Services and other activity (% of GVA): ${dat.other}%`);
    await content.append("p").classed("ttxt", true).text(`International trade: Imports (million US$): $${dat.imports}`);
    await content.append("p").classed("ttxt", true).text(`International trade: Exports (million US$): $${dat.exports}`);
    await content.append("p").classed("ttxt", true).text(`Unemployment (% of labour force): ${dat.unemployment}%`);
}

async function hide(e){
    await tooltip.attr("style", `top: ${e.pageY}px; left: ${e.pageX+20}px; visibility: hidden;`);
}

async function arcSelect(arc){
    setTimeout(async function(){
    await d3.selectAll("use").attr("xlink:href", `#rlabel${arc}`);
    var clist = await d3.selectAll("#clist");
    d3.selectAll("#clist").selectAll("*").remove();
    var countries = await fetchJSON(`query?regionkey=${rsum[arc].regionkey}`);
    clist.innerHTML = '';
    countries.forEach(function(d){
        var li = clist.append("li");
        li.append('img').attr("src", `flags/${d.countrykey}.png`).classed("flag", true);
        li.append('span').text(`${d.cname}, ${d.surfacearea} km²`);
    });
    selectedArc = d3.select(`#rlabel${arc}`);
    }, 100);
}

async function drawPieChart(){
    var data = rsum;
    var tots = d3.sum(data, function(d){return d.surfacearea;});
    data.forEach(function(d){ d.percentage = (d.surfacearea*100/tots).toFixed(2); });
    var svg = d3.select("#rsum"),
        width = svg.attr("width"),
        height = svg.attr("height"),
        radius = Math.min(width, height) / 2,
        g = svg.append("g")
        .classed("piechart", true)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var color = d3.scaleOrdinal([
        "#00cdf3",
        "#ff6a00",
        "#005bcd",
        "#00bc00",
        "#7000a4",
        "#00ffce",
        "#d2003f",
        "#00ebb5",
        "#7d0000",
        "#00a3ff",
        "#c89c00",
        "#004779",
        "#ffa859",
        "#005889",
        "#ce9443",
        "#95e2ff",
        "#190f14",
        "#ffc992",
        "#091c00",
        "#ef6e8f",
        "#1dc2a5",
        "#4c6800"
    ]);

    var pie = d3.pie().value(function(d) { return d.surfacearea; });

    var arc = d3.arc()
                .innerRadius(100)
                .outerRadius(radius);

    var arcs = g.selectAll("arc")
                .data(pie(data))
                .enter()
                .append("g")
                .classed("arc", true);

    arcs.append("path")
        .classed("arc", true)
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("onmouseover", function(d, i) {return `arcSelect(${i})`;})
        .attr("onclick", function(d, i) {return `arcSelect(${i})`;})
        .attr("d", arc);

    arcs.append("text")
        .classed("rlabel", true)
        .attr("text-anchor", "middle")
        .attr("id", function(d, i) {return "rlabel" + i;})
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")";  })
        .text(function(d) {
            return `${d.data.rname}`;
        });
    arcs.selectAll("text")
    .append("tspan")
    .attr("x", "0")
    .attr("dy", "1.2em")
    .text(function(d) {
        return `${d.data.percentage}%`;
    })
    arcs.selectAll("text")
    .append("tspan")
    .attr("x", "0")
    .attr("dy", "1.2em")
    .text(function(d) {
        return `${d.data.surfacearea} km²`;
    })
    d3.select(".piechart")
    .append("use")
    .attr("xlink:href", "0");
}

    async function drawBarGraph(){
    var data = population;
    var svg = d3.select("#population"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

    var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    xScale.domain(data.map(function(d) { return d.cname; }));
    yScale.domain([0, d3.max(data, function(d) { return d.popnumber; })]);
    g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

    g.append("g")
            .call(d3.axisLeft(yScale).tickFormat(function(d){
                return d;
            }).ticks(10))
            .append("text")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")

    g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("id", function(d, i){return `bar${i}`;})
            .attr("x", function(d) { return xScale(d.cname); })
            .attr("y", function(d) {return yScale(d.popnumber) - height + 400; })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {return height - yScale(d.popnumber); })
            .attr("onmousemove", function(d) {return `lineupMouse(event)` })
            .attr("onmouseover", function(d) {return `barSelect("${d.countrykey}")` })
            .attr("onmouseout", "hide(event)")

    svg.append('text')
        .attr('x', -(height / 4) - margin)
        .attr('y', margin / 5)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Total Population Number(Thousands)')

    svg.append('text')
        .attr('class', 'label')
        .attr('x', (width/2) + margin/2)
        .attr('y', height + margin/1.5)
        .attr('text-anchor', 'start')
        .text('Countries')

    svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2)
        .attr('y', 50)
        .attr('text-anchor', 'start')
        .text('Top 10 Population in Countries')
}

async function drawScatter(){
    var xattr = $("#x-select option:selected");
    var yattr =$("#y-select option:selected");
    var svg = d3.select("#scatterplot"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;
        var xScale = d3.scaleLinear().range ([0, width]),
        yScale = d3.scaleLinear().range ([height, 0]);

        svg.selectAll("*").remove();

        var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

        xScale.domain([0, d3.max(dataset, function(d) {
            if(d[yattr.val()] > 0){
                return d[xattr.val()]; 
            }
            else return 0;
        })]);
        yScale.domain([0, d3.max(dataset, function(d) {
            if(d[xattr.val()] > 0){
            return d[yattr.val()]; 
            }
            else return 0;
        })]);

        g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

        g.append("g")
                .call(d3.axisLeft(yScale).tickFormat(function(d){
                    return d;
                }).ticks(10))
                .append("text")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")

        svg.append('text')
                .attr('x', -(height / 4) - margin)
                .attr('y', margin / 5)
                .attr('transform', 'rotate(-90)')
                .attr('text-anchor', 'middle')
                .text(yattr.text());
        
        svg.append('text')
            .attr('class', 'label')
            .attr('x', width / 2)
            .attr('y', height + margin/1.5)
            .attr('text-anchor', 'start')
            .text(xattr.text());
        g.selectAll(".flagdot")
            .data(dataset)
            .enter()
            .append('svg:image')
            .classed('flagdot', true)
            .attr('width', 15)
            .attr('height', 15)
            .attr('x', function(d) {
                if (d[xattr.val()] > 0.001){
                    return xScale(d[xattr.val()])-7.5; 
                }
                else return -9999;
            })
            .attr('y', function(d) {
                if (d[yattr.val()] > 0.001){
                    return yScale(d[yattr.val()])-7.5;
                }
                else return -9999;
                })
            .attr("onmousemove", function(d) {return `lineupMouse(event)` })
            .attr("onmouseover", function(d) {return `flagSelect("${d.countrykey}")` })
            .attr("onmouseout", "hide(event)")
            .attr("xlink:href", function(d) { return `flags/${d.countrykey}.png`; });

            d3.selectAll(".flagdot")['_groups'][0].forEach(function(d) {
                if(d.getAttribute("x") < 0 || d.getAttribute("y") < 0){
                    d.remove();
                }
            });
}

async function GDPGraph(){
    var data = gdp;
    console.log(gdp);
    var svg = d3.select("#gdp"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

    var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    xScale.domain(data.map(function(d) { return d.cname; }));
    yScale.domain([0, d3.max(data, function(d) { return d.gdpval; })]);
    console.log(data.forEach(function(d){console.log(d.cname, d.gdpval);}));
    console.log("max: " + d3.max(data, function(d) { return d.gdpval; }));
    g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

    g.append("g")
            .call(d3.axisLeft(yScale).tickFormat(function(d){
                return d;
            }).ticks(10))
            .append("text")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")

    g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("id", function(d, i){return `bar${i}`;})
            .attr("x", function(d) { return xScale(d.cname); })
            .attr("y", function(d) {return yScale(d.gdpval) - height + 400; })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {return height - yScale(d.gdpval); })
            .attr("onmousemove", function(d) {return `lineupMouse(event)` })
            .attr("onmouseover", function(d) {return `gdpbarSelect("${d.countrykey}")` })
            .attr("onmouseout", "hide(event)")

    svg.append('text')
        .attr('x', -(height / 4) - margin)
        .attr('y', margin / 5)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('GDP Value')

    svg.append('text')
        .attr('class', 'label')
        .attr('x', width / 2 + margin)
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'middle')
        .text('Countries')

    svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2)
        .attr('y', 50)
        .attr('text-anchor', 'start')
        .text('Top 10 GDP in Countries')
}