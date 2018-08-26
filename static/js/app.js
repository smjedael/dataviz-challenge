function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((metaData) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var metaPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metaPanel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(metaData).forEach(([key, value]) => {
      metaPanel.append("b").text((`${key}: ${value}`).toUpperCase());
      metaPanel.append("br");
    });
  });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((sampleData) => {

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      mode: 'markers',
      type: 'scatter',
      text: sampleData.otu_labels,
      marker: { size: sampleData.sample_values,
                color: sampleData.otu_ids
             }
    };

    var data = [trace1];

    var layout = {
      xaxis: {title: 'OTU ID'},
      title: false
    };

    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    var sampleArray = [];

    for (var i=0; i < sampleData.otu_ids.length; i++) {
      sampleArray.push({'id': sampleData.otu_ids[i],'label': sampleData.otu_labels[i], 'value':sampleData.sample_values[i]});
    };

    sampleArray.sort((first, second) => second.value - first.value);
    var top10Values = sampleArray.slice(0,10);
    console.log(top10Values);

    var trace2 = {
      values: top10Values.map((top10) => top10.value),
      labels: top10Values.map((top10) => top10.id),
      type: 'pie',
      hoverinfo: top10Values.map((top10) => top10.label)
    };

    var data2 = [trace2];

    var layout2 = {
      margin: {
        l: 20,
        r: 20,
        b: 20,
        t: 20,
        pad: 5
      }, 
      title: false
    };

    Plotly.newPlot('pie', data2, layout2);

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
