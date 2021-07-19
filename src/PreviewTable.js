import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

// export const DataSourceComponent = (props) => {
export const PreviewTable = (props) => {
  const { title , rows, column , totalRows = 5 , totalCols = 5  } = props;

  return (
    <>
      {title && <Typography variant="h6" gutterBottom>
        {title}
      </Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {column &&
                column.map((header, colIndex) => {
                  if (colIndex < totalCols) {
                    return <TableCell key={`preview-tbl-header-${colIndex}`}> {header.toUpperCase()} </TableCell>;
                  }
                })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows &&
              rows.map((row, index) => {
                if (index < totalRows) {
                  return (
                    <TableRow key={`preview-tbl-${index}`}>
                      {column.map((header, colIndex) => {
                        if (colIndex < totalCols) {
                          return (
                            <TableCell key={`preview-tb-cell-${colIndex}`} component="th" scope="row">
                              {" "}
                              {row[header] || "-"}{" "}
                            </TableCell>
                          );
                        }
                      })}
                    </TableRow>
                  );
                }
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
