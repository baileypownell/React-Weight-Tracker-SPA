
// TO-DO: eliminate complete/incomplete properties and replace with status with enum values

export default interface Goal {
    baseWeight: number
    complete: boolean
    goalTarget: string // ISO format
    goalWeight: number 
    id: string 
    incomplete: boolean
}

export interface FormattedGoal extends Goal {
    formattedGoalDate: string
}