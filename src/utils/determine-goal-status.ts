
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { DateTime } from 'luxon';
import firebase from '../firebase-config';
import { FormattedGoal, GoalStatus } from '../types/goal';
import LegacyGoal from '../types/legacy-goal';

enum GoalObjective {
    Lose,
    Gain,
    Maintain
}

const determineGoalStatus = (goal, goalObjective: GoalObjective, lastWeight: number): GoalStatus => {
    if (goalObjective === GoalObjective.Gain) {
        return lastWeight >= goal.goalWeight ? GoalStatus.Complete : GoalStatus.Incomplete
    } else if (goalObjective === GoalObjective.Lose) {
        return lastWeight <= goal.goalWeight ? GoalStatus.Complete : GoalStatus.Incomplete
    } else if (goalObjective === GoalObjective.Maintain) {
        return lastWeight === goal.goalWeight ? GoalStatus.Complete : GoalStatus.Incomplete
    } else {
        return GoalStatus.InProgress
    }
}

export const updateGoalStatuses = async (
    goals: (FormattedGoal | LegacyGoal)[], 
    lastWeight: number, 
    userID: string
) => {
    let shouldUpdate = false

    const db = getFirestore(firebase);
    const goalsToUpdate = goals;

    goals.filter(goal => goal.status === GoalStatus.InProgress).forEach(goal => {
        const goalID = goal.id
        const today = DateTime.fromISO(new Date().toISOString())
        const targetCompletionDate = DateTime.fromISO(new Date(goal.goalTarget).toISOString())
    
        const goalExpiresToday = targetCompletionDate.startOf('day') <= today.startOf('day')
   
        if (goalExpiresToday) {
            shouldUpdate = true
            let goalObjective: GoalObjective
            if (goal.goalWeight > goal.baseWeight) {
                goalObjective = GoalObjective.Gain
            } else if (goal.goalWeight < goal.baseWeight) {
                goalObjective = GoalObjective.Lose
            } else {
                goalObjective = GoalObjective.Maintain
            }

            const status: GoalStatus = determineGoalStatus(goal, goalObjective, lastWeight)

            const goalToUpdateIndex = goals.findIndex(goal => goal.id === goalID)
            goalsToUpdate[goalToUpdateIndex].status = status 
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