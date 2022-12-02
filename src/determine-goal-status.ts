
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { DateTime } from 'luxon';
import firebase from './firebase-config';

export const determineGoalStatus = async (goals: any[], lastWeight: number, userID: string) => {

    let shouldUpdate = false

    const db = getFirestore(firebase);
    let goalsToUpdate = goals;

    goals.forEach(goal => {
        // first, if the goal is already marked as incomplete, return as this means that there is no reason to recalculate 
        if (goal.incomplete) {
            return 
        }
        let goalID = goal.id
        let today = DateTime.fromISO(new Date().toISOString())
        let targetCompletionDate = DateTime.fromISO(new Date(goal.goalTarget).toISOString())
    
        let goalExpiresToday = targetCompletionDate.startOf('day') <= today.startOf('day')
        // first and foremost this should account for time 
        // if today is before the goal, both incomplete and complete should be false 
        // in other words, do nothing
        // else, if the goal expires today, determine the status and update accordingly 
        if (goalExpiresToday) {
            shouldUpdate = true
                const determineGainingGoalStatus = () => {
                    return lastWeight >= goal.goalWeight ? true : false
                }
    
                const determineLosingGoalStatus = () =>  {
                    return lastWeight <= goal.goalWeight ? true : false
                }
                let gaining, losing;
                gaining = goal.goalWeight > goal.baseWeight;
                losing = goal.goalWeight < goal.baseWeight;
        
                let complete, incomplete; 
    
                complete = gaining ? determineGainingGoalStatus() : determineLosingGoalStatus() 
                incomplete = !complete

                let goalToUpdateIndex = goals.findIndex(goal => goal.id === goalID)
                goalsToUpdate[goalToUpdateIndex].incomplete = incomplete 
                goalsToUpdate[goalToUpdateIndex].complete = complete 
                
        } else {
            return
        }
    })


    if (shouldUpdate) {
        const userRef = doc(db, 'users', userID);
        setDoc(userRef, { goals: goalsToUpdate }, { merge: true });
        const docSnap = await getDoc(userRef);

        return {
            message: 'Goals updated',
            updatedGoals: docSnap.data()?.goals
        }
    } else {
        return {message: 'No need to update any goals'}
    }
}