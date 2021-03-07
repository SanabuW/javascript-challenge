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


// define the action for the event handler, gathering the filter conditions into formResults
function submitQuery () {
    // prevent full page refresh on event
    d3.event.preventDefault();
    // define what filters to iterate over
    var keysList = ["datetime", "city", "state", "country", "shape"];

    // retrieve text from only the form fields that have an input, building a dictionary
    //of current inputs
    var formResults = {};
    keysList.forEach(function(val){
        // target the element for the key of the current iteration ("datetime", "city", etc.) and get its value
        var tempValue = d3.select(`#${val}Filter`).property("value");
        // if the string isn't empty, pass that value into the dictionary
        if(!(tempValue === "")){
            formResults[val] = tempValue;
        };
    });



// ===============================================
    // begin filtering data

    // use formResults object's entries as the applicable filter criteria
    // code concept researched from:
    // https://stackoverflow.com/questions/17099029/how-to-filter-a-javascript-object-array-with-variable-parameters
    function topFilter (dataInput, filterCriteria) {
        // Retrieve source data, and filter on each object(sighting report) in the array
        return dataInput.filter(function(obj){
            // Begin reviewing each object individually at this level.
            //For every key in the search criteria, see if the current object's value
            //from the source data matches the search criteria's value. If so, return
            //'true' for this object to pass into dataInput.filter()
            return Object.keys(filterCriteria).every(function(value){
                // Return 'true' to .every() if the search criteria's value matches
                //the current object's value
                //(the "current object" is provided by .filter(function(obj)))
                return obj[value] === filterCriteria[value];
            });
        });
    };


    // Execute filtering
    var filteredData = topFilter(tableData, formResults);


    // begin building output
    // define target for output
    var outputBody = d3.select("tbody");
    // clear output of any previous queries
    outputBody.html("");


    // populate table, appending new rows for each new object, and new td elemnts for each column
    filteredData.forEach(function(f_Sighting) {
        var row = outputBody.append("tr");
        Object.values(f_Sighting).forEach(function(value){
            var cell = row.append("td").text(value);
        });
    });
};



// ===============================================
// For creating dropdown menus, create logic to dynamically find unique values
//depending on the source data, and then generate dropdown options referencing those values
// Parsing out values
var keyList = ["state", "country", "shape"];
var dropdownDict = {};

// Function to find/parse out unique values by building lists and checking existing values in that
//list
function keyParser(key) {
    var valList = [];
    tableData.forEach(function(x) {
        var currentVal = x[key];
        if(!(valList.includes(currentVal))) {
            valList.push(currentVal);
        };
    });
    // Sort values in alpha order for easier usability
    valList.sort();
    dropdownDict[key] = valList;
};


// Run parser function
keyList.forEach(keyParser);



// Building dynamic dropdowns in the HTML
// Refer to each list in dropdownDict to build new <option> tags for each dropdown

Object.entries(dropdownDict).forEach(function([key,value]){
//For each filter, look at each item gathered into dropdownDict for that filter
//For each item, add a new <option> in it's correlating dropdown

    var selectObj = d3.select(`#${key}Filter`);
    // Remove any pre-existing dropdown selection
    selectObj.html("");
    // Append a blank option element for the list to default to first
    selectObj.append("option").attr("value","");
    // Append option elements for each itm present in the dropdownDict
    value.forEach(function(x){
        selectObj.append("option").text(`${x}`);
    });
});
// ===============================================

