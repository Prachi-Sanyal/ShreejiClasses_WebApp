{/*
    const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const path = require("path");
const fs = require("fs");

const width = 600;
const height = 400;
const chartJsNodeCanvas = new ChartJSNodeCanvas({ width, height });

/**
 * Generates a Bar Chart for Student Marks
 * @param {Array} marks - Array of marks data
 * @returns {string} - File path of the generated chart
 //
async function generateBarChart(marks, studentName) {
    const labels = marks.map(mark => mark.testTitle);
    const data = marks.map(mark => mark.marksObtained);

    const config = {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Marks Obtained",
                data: data,
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            }],
        },
        options: {
            scales: { y: { beginAtZero: true } },
        },
    };

    const imageBuffer = await chartJsNodeCanvas.renderToBuffer(config);
    const filePath = path.join(__dirname, "../charts", `bar_chart_${studentName}.png`);
    fs.writeFileSync(filePath, imageBuffer);
    return filePath;
}


//
 //* Generates a Line Chart for Student Marks
 //* @param {Array} marks - Array of marks data
 //* @returns {string} - File path of the generated chart
 //
async function generateLineChart(marks, studentName) {
    const labels = marks.map(mark => mark.testTitle);
    const data = marks.map(mark => mark.marksObtained);

    const config = {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Marks Trend",
                data: data,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderWidth: 2,
                fill: true,
            }],
        },
        options: {
            scales: { y: { beginAtZero: true } },
        },
    };

    const imageBuffer = await chartJsNodeCanvas.renderToBuffer(config);
    const filePath = path.join(__dirname, "../charts", `line_chart_${studentName}.png`);
    fs.writeFileSync(filePath, imageBuffer);
    return filePath;
}

module.exports = { generateBarChart, generateLineChart };

*/}
