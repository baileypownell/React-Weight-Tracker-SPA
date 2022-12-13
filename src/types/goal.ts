
export enum GoalStatus {
    Complete,
    Incomplete, 
    InProgress
}

export default interface Goal {
    baseWeight: number
    goalTarget: string // ISO format
    goalWeight: number 
    id: string 
    status: GoalStatus
}

export interface FormattedGoal extends Goal {
    formattedGoalDate: string
}