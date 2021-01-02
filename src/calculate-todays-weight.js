
export const calculateTodaysWeight = (weights) => {
    let todaysWeight = '';
    if (weights.length) {
        let lastWeightEntry = weights[0];
        let dateLast = lastWeightEntry.date.date.seconds;
        let now = Date.now()/1000;
        let timeElapsed = now - dateLast;
        if (timeElapsed < 86400) {
            todaysWeight = lastWeightEntry.weight;
        }
    } 
    return todaysWeight
}