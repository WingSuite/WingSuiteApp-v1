// Utility export function to calculate average
export function average(array) {
  return array.reduce((a, b) => a + b, 0) / array.length;
}

// Utility export function to calculate standard deviation
export function standardDeviation(values, avg) {
  const squareDiffs = values.map((value) => {
    const diff = value - avg;
    const sqrDiff = diff * diff;
    return sqrDiff;
  });

  const avgSquareDiff = average(squareDiffs);
  const stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

// Function to calculate number of datapoints
export function numOfDataPoints(data, metric, exam) {
  return data.filter((item) => item.name === exam && item[metric] !== undefined)
    .length;
}

// Function to calculate number of unique units
export function numOfUniqueUnits(data, metric, exam) {
  const uniqueUnits = new Set(
    data
      .filter((item) => item.name === exam && item[metric] !== undefined)
      .map((item) => item.unit)
  );
  return uniqueUnits.size;
}

// Function to calculate overall average metric value
export function overallAvgMetricValue(data, metric, exam = null) {
  var metricValues = [];
  if (exam == null) {
    metricValues = data
      .filter((item) => item[metric] !== undefined)
      .map((item) => item[metric]);
  } else {
    metricValues = data
      .filter((item) => item.name === exam && item[metric] !== undefined)
      .map((item) => item[metric]);
  }
  return average(metricValues);
}

// Function to calculate the max value
export function overallMaxValue(data, metric, exam = null) {
  var metricValues = [];
  if (exam == null) {
    metricValues = data
      .filter((item) => item[metric] !== undefined)
      .map((item) => item[metric]);
  } else {
    metricValues = data
      .filter((item) => item.name === exam && item[metric] !== undefined)
      .map((item) => item[metric]);
  }
  return Math.max(...metricValues);
}

// Function to calculate the max value
export function overallMinValue(data, metric, exam = null) {
  var metricValues = [];
  if (exam == null) {
    metricValues = data
      .filter((item) => item[metric] !== undefined)
      .map((item) => item[metric]);
  } else {
    metricValues = data
      .filter((item) => item.name === exam && item[metric] !== undefined)
      .map((item) => item[metric]);
  }
  return Math.min(...metricValues);
}

// Function to calculate overall standard deviation for that metric value
export function overallStdDev(data, metric, exam) {
  const metricValues = data
    .filter((item) => item.name === exam && item[metric] !== undefined)
    .map((item) => item[metric]);
  return standardDeviation(metricValues, average(metricValues));
}

// Function to calculate average metric value per unit
export function avgMetricValuePerUnit(data, metric, exam) {
  const units = new Set(data.map((item) => item.unit));
  let result = {};
  units.forEach((unit) => {
    const metricValues = data
      .filter(
        (item) =>
          item.unit === unit && item.name === exam && item[metric] !== undefined
      )
      .map((item) => item[metric]);
    result[unit] = average(metricValues);
  });
  return result;
}

// Function to calculate standard Deviation of the metric value per unit
export function stdDevPerUnit(data, metric, exam) {
  const units = new Set(data.map((item) => item.unit));
  let result = {};
  units.forEach((unit) => {
    const metricValues = data
      .filter(
        (item) =>
          item.unit === unit && item.name === exam && item[metric] !== undefined
      )
      .map((item) => item[metric]);
    result[unit] = standardDeviation(metricValues, average(metricValues));
  });
  return result;
}
