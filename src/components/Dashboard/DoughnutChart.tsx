import DoneIcon from '@mui/icons-material/Done'
import { Chip, Stack, Typography, useTheme } from '@mui/material'
import { useWindowWidth } from '@react-hook/window-size'
import { useEffect, useRef } from 'react'

interface Goal {
    baseWeight: string
    complete: boolean 
    formattedGoalDate: string 
    goalTarget: string
    goalWeight: string 
    id: string 
    incomplete: boolean
}

const DoughnutChart = (props: { selectedGoal: Goal | null, lastWeight: number }) => {
    const goalGraph = useRef(null)
    const { selectedGoal, lastWeight } = props
    const theme = useTheme()
    const width = useWindowWidth()
 
    useEffect(() => {
        if (selectedGoal) {
            const goalWeightDifference = 
                (Number(selectedGoal.goalWeight) - lastWeight).toFixed(2)
        
            const data = {
                labels: ['Current weight', 'Pounds left to reach your goal'],
                datasets: [{
                    data: [lastWeight, goalWeightDifference],
                    backgroundColor: [
                        theme.palette.secondary.main,
                        theme.palette.grey.main,
                    ],
                    borderWidth: 0.5
                }]
            }

            new Chart(goalGraph.current, {
                type: 'doughnut',
                data,
                options: {
                    legend: {
                        onClick: (e) => e.stopPropagation()
                    }
                }
            })
        }
    }, [selectedGoal])

    if (!selectedGoal || !lastWeight) {
        return <div></div>
    }

    return (
        <Stack 
            padding={3}
            borderRadius={.5}
            boxShadow={10}
            width={width > 700 ?"auto" : "100%"}
            sx={{
                backgroundColor: 'white.main',
                color: 'grey.main',
            }}>
            <Typography variant="overline">Target Weight</Typography>
            <Typography variant="h3">{ Number(selectedGoal.goalWeight).toFixed(1) } lbs. </Typography>
            <span>
                { selectedGoal.incomplete ? 
                    <Chip label="Incomplete" variant="outlined" />
                : null }
            </span>
            <span>
                { selectedGoal.complete ?  
                    <Chip icon={<DoneIcon />} label="Complete" color="secondary" variant="outlined" />
                : null }
            </span>
            <canvas ref={goalGraph} width="300" height="300"></canvas>
        </Stack> 
    )
}

export default DoughnutChart