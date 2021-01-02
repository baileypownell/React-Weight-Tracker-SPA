
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