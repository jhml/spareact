import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import { withRouter } from "react-router-dom";

function createData(country, todayCases, cases, recovered, deaths ) {
  return { country, todayCases, cases, recovered, deaths };
}

/* sorting logic start */
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
/* sorting logic end */

//heading definition
const headCells = [
  { 
    id: "country", 
    label: "Country"
   },
  {
    id: "todayCases",
    label: "New confirmed"
  },
  { 
    id: "cases", 
    label: "Total cases" 
  },
  {
    id: "recovered",
    label: "Total recovered"
  },
  { 
    id: "deaths", 
    label: "Total deaths" 
  }
];

/* heading component */
const EnhancedTableHead = (props) => {
  const {
    classes,
    order,
    orderBy,
    onRequestSort
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className={classes.tableHead}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"left"}
            padding={"default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};


//styles for base class
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "0 1rem",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 520
  },
  tableHead: {
    background: '#EFEBD6',
    fontWeight: 'bold',
    fontSize: '1rem',
    color: '#FF9900',
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  },
  tableRow: {
    "&:hover": {
      cursor: "pointer"
    }
  },
  headingTop: {
    fontFamily: 'Roboto',
    fontSize: '1.5rem',
    margin: '0.75rem 0',
    color: '#666666'
  },
  fontRoboto: {
    fontFamily: 'Roboto'
  }
}));

/* complete table component */
const EnhancedTable = (props) => {

  const rows = props.stats.map((data) => {
    return createData(
      data.country,
      data.todayCases,
      data.cases,
      data.recovered,
      data.deaths
    );
  });

  
  const classes = useStyles();
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("cases");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(30);

  //sorting click handler
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  //country navigation click handler
  const handleClick = (e, name) => {
    props.history.push('/country/'+ encodeURI(name));
  };

  //material UI function
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  //material UI function
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  
  return (
      <Paper className={classes.paper}>
        <h5 className={classes.headingTop}>Covid Case Tracker - Main page</h5>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"small"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      onClick={(e) => handleClick(e, row.country)}
                      className={classes.tableRow}
                      tabIndex={-1}
                      key={row.country}
                    >
                      <TableCell
                        component="th"
                        id={index}
                        align={"left"}
                        scope={"row"}
                        padding={"default"}
                      >
                        {row.country}
                      </TableCell>
                      <TableCell align="left" >{row.todayCases}</TableCell>
                      <TableCell align="left">{row.cases}</TableCell>
                      <TableCell align="left">{row.recovered}</TableCell>
                      <TableCell align="left">{row.deaths}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 30]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <b className={classes.fontRoboto}>Features covered in this implementation:</b>
        <ul className={classes.fontRoboto}>
          <li>Code splitting using react lazy/async await for api</li>
          <li>Brotli/gzip compression`</li>
          <li>Usage of react router</li>
          <li>Usage of material ui</li>
          <li>Sorting</li>
          <li>Use of Grid/Flex</li>
          <li>Custom webpack configuration</li>
          <li>Detail page with sharable URL and back button</li>
          <li>Application hosted on Google Firebase</li>
        </ul>
      </Paper>
  );
}

EnhancedTable.propTypes = {
  stats: PropTypes.array
}

export default withRouter(EnhancedTable);
