import { Box, Stack, Typography, useTheme } from '@mui/material'
import { useWindowWidth } from '@react-hook/window-size'
import { Chart, ChartItem } from 'chart.js/auto'
import { useEffect, useRef } from 'react'
import { FormattedGoal } from '../../types/goal'
import GoalChip from './GoalChip'

let chart

const DoughnutChart = (props: { selectedGoal: FormattedGoal | null, lastWeight: number }) => {
    const goalGraph = useRef<any>(null)
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
                        theme.palette.gray.main,
                    ],
                    borderWidth: 0.5
                }]
            }
            
            chart?.destroy()
            chart = new Chart(goalGraph.current as ChartItem, {
                type: 'doughnut',
                data,
                options: {
                    plugins: {
                        legend: {
                            onClick: (e) => (e as any).stopPropagation()
                        }
                    }
                }
            })
        }
    }, [selectedGoal])

    if (!selectedGoal || !lastWeight) {
        return null
    }

    return (
        <Stack 
            padding={3}
            borderRadius={.5}
            boxShadow={10}
            width={width > 700 ?"auto" : "100%"}
            sx={{
                backgroundColor: 'white.main',
                color: 'gray.main',
            }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end" spacing={5}>
                <Box>
                    <Typography variant="overline">Target Weight</Typography>
                    <Typography variant="h3">{ Number(selectedGoal.goalWeight).toFixed(1) } lbs. </Typography>
                </Box>
                <Box sx={{ marginBottom: '10px!important' }}>
                    <GoalChip goalStatus={selectedGoal.status} />
                </Box>
            </Stack>
            <canvas ref={goalGraph}></canvas>
        </Stack> 
    )
}

export default DoughnutChart