let myMap = L.map("map", {
    center: [36.778259, -119.417931],
    zoom: 7
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function to set marker size based on magnitude
function markerSize(magnitude) {
    return Math.sqrt(magnitude) * 10000;
}

// Function to get color based on depth- from red to green
function getColor(depth) {
    return depth > 90 ? '#ff5f65' :
           depth > 70 ? '#ff5f65' :
           depth > 50 ? '#fca35d' :
           depth > 30 ? '#fdb72a' :
           depth > 10 ? '#f7db11' :
           depth > -10 ? '#dcf400' :
                        '#a3f600' ;
}

// Get the data with d3.
d3.json(url).then(function(data) {

    // Loop through the features array and create circles for each earthquake
    data.features.forEach(feature => {
        let location = feature.geometry.coordinates;
        let magnitude = feature.properties.mag;
        let depth = feature.geometry.coordinates[2]
        if (magnitude > 0) {
            L.circle([location[1], location[0]], {
                fillOpacity: 0.75,
                color: "black", // Making outline black
                weight: 0.5, // Changing weight of black outline
                fillColor: getColor(depth),
                radius: markerSize(magnitude)
            }).bindPopup(`<h1>${feature.properties.place}</h1> <hr> <h3>Magnitude: ${magnitude} <br>Depth: ${depth} </br></h3>`).addTo(myMap);
        }
    });

    // Set up the legend.
    let legend = L.control({ position: "bottomright" });
    console.log(legend)
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let limits = [-10, 10, 30, 50, 70, 90];
        let labels = [];

        // Title of Legend
        div.innerHTML = "<h4>Earthquake Depths</h4>";

        // Loop through the limits to create the legend items
        for (let i = 0; i < limits.length; i++) {
            let color = getColor(limits[i]);
            let range = `${limits[i]} ${limits[i + 1] ? "&ndash; " + limits[i + 1]  : "+"}`;

            labels.push(
                `<li style="display: flex; align-items: center;"><span style="background-color: ${color}; width: 20px; height: 20px; display: inline-block; margin-right: 5px;"></span>${range}</li>`
            );
        }

        div.innerHTML += "<ul style='list-style-type: none; padding: 0; margin: 0;'>" + labels.join("") + "</ul>";
        return div;
    };

    // Adding the legend to the map
    legend.addTo(myMap);
});