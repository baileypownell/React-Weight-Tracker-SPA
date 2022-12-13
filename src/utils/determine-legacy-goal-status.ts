import { GoalStatus } from "../types/goal"
import LegacyGoal from "../types/legacy-goal"

const determineLegacyGoalStatus = (goal: LegacyGoal): GoalStatus => {
  let status 
  if (goal.incomplete && !goal.complete) {
    status = GoalStatus.Incomplete
  } else if (goal.complete && !goal.incomplete) {
    status = GoalStatus.Complete
  } else {
    status = GoalStatus.InProgress
  }
  return status
}

export default determineLegacyGoalStatus