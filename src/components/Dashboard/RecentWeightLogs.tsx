import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';
import { DateTime } from 'luxon'
import { useState } from 'react';

const RecentWeightLogs = (props) => {
  const weights = props.weights.map(el => ({...el, 
    parsedDate: DateTime.fromSeconds(el.date.date.seconds).toLocaleString() 
  }))

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - weights.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ boxShadow: 10 }} minWidth="325px" borderRadius={1}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{
            // backgroundColor: lighten($green, 15%),
            'th': {
              textTransform: 'uppercase',
              fontWeight: 'bold',
              // color: $white,
            },
            'span': {
              textTransform: 'none',
            }
          }}>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Weight <span>(lbs)</span></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? weights.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : weights
            ).map((weightEntry, index: number) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                {weightEntry.parsedDate}
                </TableCell>
                <TableCell align="right">{ Number(weightEntry.weight).toFixed(1)}</TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, { label: 'All', value: -1 }]}
                colSpan={3}
                count={weights.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default RecentWeightLogs;
