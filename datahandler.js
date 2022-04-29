var dataset;
var rsum;
var population;
var gdp;
var tooltip;
var countries;
//fetch data from json page and return it
async function fetchJSON(page){
    var d;
    await $.getJSON(page, async function(data){
        d = data;
    }).fail(function(){
        console.log("An error has occurred.");
    });
    return d;
}


document.addEventListener('DOMContentLoaded', async() => {
    dataset = await fetchJSON("data.json");
    countries = await dataset.map(function(d) { return d.cname;});
    gdp = await fetchJSON("gdp.json");
    rsum = await fetchJSON("rsum.json");
    population = await fetchJSON("population.json");
    tooltip = d3.selectAll("#tooltip");
    const autoCompleteJS = new autoComplete({
        placeHolder: "Search for Country...",
        data: {
            src: countries,
            cache: true,
        },
        resultItem: {
            highlight: true
        },
        events: {
            input: {
                selection: (event) => {
                    const selection = event.detail.selection.value;
                    autoCompleteJS.input.value = selection;
                    console.log("ENTERED!!");
                    selectCountry();
                }
            }
        }
    });
    $("#autoComplete").on('keyup', async function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            selectCountry();
        }
    });
    await drawScatter();
    await drawPieChart();
    await drawBarGraph();
    await GDPGraph();
});