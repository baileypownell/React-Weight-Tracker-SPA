import { DateTime } from "luxon";
import Goal from "../types/goal";
import LegacyGoal from "../types/legacy-goal";

export const compareGoals = (goal1: Goal | LegacyGoal, goal2: Goal | LegacyGoal): number => {
  const goal1Milliseconds = (goal1 as LegacyGoal).goalTargetUnix ? 
    DateTime.fromSeconds(Number((goal1 as LegacyGoal).goalTargetUnix)).toMillis() : 
    DateTime.fromISO((goal1 as Goal).goalTarget).toMillis();
  const goal2Milliseconds = (goal2 as LegacyGoal).goalTargetUnix ? 
    DateTime.fromSeconds(Number((goal2 as LegacyGoal).goalTargetUnix)).toMillis() : 
    DateTime.fromISO((goal2 as Goal).goalTarget).toMillis();

  let comparison = 0;
  if (goal1Milliseconds > goal2Milliseconds) {
    comparison = 1;
  } else if (goal1Milliseconds < goal2Milliseconds) {
    comparison = -1;
  }
  return comparison;
}