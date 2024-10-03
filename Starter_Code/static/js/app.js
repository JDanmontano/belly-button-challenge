// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let Metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let dataArray = Metadata.filter(object => object.id == sample);
    let metaData = dataArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let datapanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    datapanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (const key in metaData) {
      datapanel.append("h6").text(`${key.toUpperCase()}: ${metaData[key]}`);
    }
  });
};

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let Sample = data.samples;
    console.log(Sample);

    // Filter the samples for the object with the desired sample number
    let sampleArray = Sample.filter(obj => obj.id == sample)
    let SampleData = sampleArray[0];
    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = SampleData.otu_ids;
    let otu_labels = SampleData.otu_labels;
    let sample_values = SampleData.sample_values;
    console.log(sample_values);

    // Build a Bubble Chart
    let bubblechartlayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: otu_ids},
      yaxis: {title: 'Number of Bacteria'},
      hovermode: 'closest'
    };
    
    
    let bubblechart = {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      text: otu_labels,
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth',
      }
    };


    // Render the Bubble Chart
    Plotly.newPlot('bubble', [bubblechart], bubblechartlayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let ytick = [];
    for (let i = 0; i < 10; i++) {
    ytick.push(`OTU ${otu_ids[i]}`);
    } 
    ytick.reverse();
    console.log(ytick);
   

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barchart =[{ 
      y: ytick,
      x: sample_values.slice(0,10).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    }];

      let Layout = {
        title:"Top 10 Bacteria Cultures Found",
        xaxis: {title: "Number of Bacteria"},
        margin:{t:100, l:150}
      };
    // Render the Bar Chart
    Plotly.newPlot('bar', barchart, Layout);
  });
};

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sample_name = data.names;
    console.log(sample_name);   

    // Use d3 to select the dropdown with id of `#selDataset`
    let namepanel = d3.select("#selDataset");
    

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
   
    for (let i = 0; i < sample_name.length; i++) {
      namepanel.append("option")
          .text(sample_name[i])
          .property("value", sample_name[i]);
  };

    // Get the first sample from the list
  let firstsample = sample_name[0];
  console.log(firstsample);

    // Build charts and metadata panel with the first sample
  buildCharts(firstsample);
  buildMetadata(firstsample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();
