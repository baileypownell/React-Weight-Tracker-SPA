import LegacyWeight from "../types/legacy-weight";
import Weight from "../types/weight";
import { DateTime } from 'luxon'

export const calculateTodaysWeight = (weightsSortedDescendingInTime: (Weight | LegacyWeight)[]): number | undefined => {
    let todaysWeight;
    if (weightsSortedDescendingInTime.length) {
        const lastWeightEntry = weightsSortedDescendingInTime[0];
        const dayRecorded = (lastWeightEntry as LegacyWeight).date.date ?
            DateTime.fromSeconds((lastWeightEntry as LegacyWeight).date.date.seconds) :
            DateTime.fromMillis((lastWeightEntry as Weight).date)

        const wasRecordedToday = dayRecorded.hasSame(DateTime.now(), 'day')
        if (wasRecordedToday) {
             todaysWeight = Number(lastWeightEntry.weight);
        }
    } 
    return todaysWeight
}