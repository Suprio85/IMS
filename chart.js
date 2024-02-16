const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');

const width = 800;
const height = 400;

const chartCallback = (ChartJS) => {
  // Register any plugins or perform Chart.js customization if needed
};

const canvasRenderService = new ChartJSNodeCanvas({ width, height, chartCallback });

const configuration = {
  type: 'line',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Monthly Sales',
        data: [50, 80, 60, 100, 75],
        borderColor: 'blue',
        borderWidth: 2,
        fill: false,
      },
    ],
  },
  options: {
    scales: {
      x: {
        type: 'category',
        position: 'bottom',
      },
      y: {
        type: 'linear',
        position: 'left',
      },
    },
  },
};

canvasRenderService.renderToBuffer(configuration).then((buffer) => {
  // Save the buffer to a file
  fs.writeFileSync('lineChart.png', buffer);
});
