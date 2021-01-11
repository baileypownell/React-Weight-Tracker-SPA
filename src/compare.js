var { DateTime } = require('luxon') 

export const compare = (a, b) => {
    const secondsA = a.date.date.seconds;
    const secondsB = b.date.date.seconds;
    let comparison = 0;
    if (secondsA < secondsB) {
      comparison = 1;
    } else if (secondsA > secondsB) {
      comparison = -1;
    }
    return comparison;
  }

export const compareGoals = (goal1, goal2) => {
  const secondsA = goal1.goalTargetUnix;
  const secondsB = goal2.goalTargetUnix;
  let comparison = 0;
  if (secondsA > secondsB) {
    comparison = 1;
  } else if (secondsA < secondsB) {
    comparison = -1;
  }
  return comparison;
}