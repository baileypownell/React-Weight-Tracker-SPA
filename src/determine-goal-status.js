
var { DateTime } = require('luxon') 

export const determineGoalStatus = (goal, lastWeight) => {

    console.log(goal)
    console.log(DateTime.fromISO(new Date().toISOString()))
    console.log(DateTime.fromISO(new Date(goal.goalTarget).toISOString()))

    let today = DateTime.fromISO(new Date().toISOString())
    let targetCompletionDate = DateTime.fromISO(new Date(goal.goalTarget).toISOString())

    console.log(targetCompletionDate.diff(today, 'days'))



    //first and foremost this should account for time 
    // if today is before the goal, both incomplete and complete should be false 

    // Conclusion (gaining): 
    // Goal = 100 
    // Base weight = 90 
    // Current weight = 105 
    // If goal > base weight, and current weight is >= goal, then goal is complete 
    // If goal > base weight, and current weight is < goal, then goal is not complete 

    // Conclusion (losing):
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
    if (complete) {
        incomplete = false
    } else {
        incomplete = true
    }

    console.log(complete)
    console.log(incomplete)



    return {
        ...goal,
        complete, 
        incomplete
    }
}