//*** Performance ops  */
export const logPerformance = (measure = false) => {
  if (measure) {
    const measures = performance.getEntriesByType('measure');
    if (measures.length) {
      const durations = measures.map((m) => m.duration);
      const max = Math.max(...durations);
      const min = Math.min(...durations);
      const sum = durations.reduce((a, b) => a + b, 0);
      console.log(`Max: ${max}`);
      console.log(`Min: ${min}`);
      console.log(`Avg: ${sum / measures.length}`);
      performance.clearMeasures();
    } else {
      console.log('No performance measures collected yet.');
    }
  } else {
    console.log('Performance measurement not enabled.');
  }
};
