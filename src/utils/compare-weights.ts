import { DateTime } from 'luxon';
import LegacyWeight from "../types/legacy-weight";
import Weight from "../types/weight";

export const compareWeights = (weight1: Weight | LegacyWeight, weight2: Weight | LegacyWeight) => {
  const weight1Date = (weight1 as LegacyWeight).date.date ? 
    DateTime.fromSeconds((weight1 as LegacyWeight).date.date.seconds).toMillis() : 
    (weight1 as Weight).date // milliseconds
  const weight2Date = (weight2 as LegacyWeight).date.date ? 
    DateTime.fromSeconds((weight2 as LegacyWeight).date.date.seconds).toMillis() : 
    (weight2 as Weight).date // milliseconds

  let comparison = 0;
  if (weight1Date < weight2Date) {
    comparison = 1;
  } else if (weight1Date > weight2Date) {
    comparison = -1;
  }
  return comparison;
}
