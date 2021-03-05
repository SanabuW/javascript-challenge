// from data.js
var tableData = data;


// Select form
var form = d3.select("form");
// Select button
var button = d3.select("#filter-btn");

// Event handlers for both form and button
// Will run the same event handler function
form.on("submit", submitQuery);
button.on("click", submitQuery);


function submitQuery () {
    // prevent full page refresh on event
    d3.event.preventDefault();

    // retrieve text from the input field
    // select input field
    var inputField = d3.select("#datetime");
    var queryInput = inputField.property("value");
    // create array of filtered data
    var filteredData = tableData.filter(sighting => sighting.datetime === queryInput);


    // begin building output
    // define target for output
    var outputBody = d3.select("tbody");
    //clear output of any previous queries
    outputBody.html("");


    filteredData.forEach(function(f_Sighting) {
        var row = outputBody.append("tr");
        Object.values(f_Sighting).forEach(function(value){
            var cell = row.append("td").text(value);
        });
    });
};




