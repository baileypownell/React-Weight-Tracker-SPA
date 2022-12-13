import { GoalStatus } from "../../types/goal"
import RotateRightRoundedIcon from '@mui/icons-material/RotateRightRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Chip, useTheme } from "@mui/material";

export const GoalChip = (props: { goalStatus: GoalStatus }) => {
    const theme = useTheme()
    const { goalStatus } = props
    if (goalStatus === GoalStatus.Complete) {
        return <Chip 
            icon={<CheckRoundedIcon />} 
            label="Complete" 
            variant="outlined" 
            sx={{ 
                color: theme.palette.green.main,
                borderColor: theme.palette.green.main,
                svg: {
                    color: `${theme.palette.green.main}!important`,
                }
            }} />
    }

    if (goalStatus === GoalStatus.Incomplete) {
        return <Chip icon={<CloseRoundedIcon />} color="warning" label="Incomplete" variant="outlined" />
    }
    
    if (goalStatus === GoalStatus.InProgress) {
        return <Chip icon={<RotateRightRoundedIcon /> } label="In Progress" variant="outlined" />
    }

    return null
}

export default GoalChip