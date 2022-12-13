import { GoalStatus } from "./goal"

export default interface LegacyGoal {
    baseWeight: string 
    complete: boolean 
    goalTarget: string 
    goalTargetUnix: string 
    goalWeight: string 
    id: string 
    incomplete: boolean
    status?: GoalStatus
}