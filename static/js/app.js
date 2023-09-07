// Function to load data from samples.json
function loadData() {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
    // Populate the dropdown with Test Subject IDs
    var select = d3.select("#selDataset");
    data.names.forEach(function(name) {
      select.append("option").text(name).property("value", name);
    });
    
    // Function to create a horizontal bar chart
    function createBarChart(selectedID) {
      var selectedData = data.samples.find(sample => sample.id === selectedID);
      var top10Values = selectedData.sample_values.slice(0, 10).reverse();
      var top10Labels = selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
      var top10HoverText = selectedData.otu_labels.slice(0, 10).reverse();

      var trace = {
        type: "bar",
        x: top10Values,
        y: top10Labels,
        text: top10HoverText,
        orientation: "h"
      };

      var layout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" }
      };

      Plotly.newPlot("bar", [trace], layout);
    }

    // Function to create a bubble chart
    function createBubbleChart(selectedID) {
      var selectedData = data.samples.find(sample => sample.id === selectedID);
      var trace = {
        type: "bubble",
        x: selectedData.otu_ids,
        y: selectedData.sample_values,
        text: selectedData.otu_labels,
        mode: "markers",
        marker: {
          size: selectedData.sample_values,
          color: selectedData.otu_ids
        }
      };

      var layout = {
        title: "OTU Bubble Chart",
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Values" }
      };

      Plotly.newPlot("bubble", [trace], layout);
    }

    // Function to display sample metadata
    function showMetadata(selectedID) {
      var metadataPanel = d3.select("#sample-metadata");
      var selectedMetadata = data.metadata.find(metadata => metadata.id === parseInt(selectedID));
      metadataPanel.html("");
      Object.entries(selectedMetadata).forEach(([key, value]) => {
        metadataPanel.append("p").text(`${key}: ${value}`);
      });
    }

    // Function to handle the dropdown change
    function optionChanged(selectedID) {
      createBarChart(selectedID);
      createBubbleChart(selectedID);
      showMetadata(selectedID);
    }

    // Initialize the page with the first sample
    optionChanged(data.names[0]);
  });
}

// Call the function to load data when the page loads
loadData();
