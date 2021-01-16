
var { DateTime } = require('luxon') 

export const determineGoalStatus = async (goals, lastWeight, userID) => {

    let shouldUpdate = false

    const db = firebase.firestore();
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
                // (gaining): 
                // Goal = 100 
                // Base weight = 90 
                // Current weight = 105 
                // If goal > base weight, and current weight is >= goal, then goal is complete 
                // If goal > base weight, and current weight is < goal, then goal is not complete 
    
                // (losing):
                // Goal = 100 
                // Base weight = 110 
                // Current weight 105
                // If goal < base weight, and current weight  <= goal, then goal is complete 
                // If goal < base weight, and current weight is > goal, then goal is not complete 
    
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
        return db.collection("users").doc(userID).update({
            goals: goalsToUpdate
        })
        .then((res) => {
            return db.collection("users").doc(userID).get()
            .then((doc) => { 
                return {
                    message: 'Goals updated',
                    updatedGoals: doc.data().goals
                }
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    } else {
        return {message: 'No need to update any goals'}
    }
        
}