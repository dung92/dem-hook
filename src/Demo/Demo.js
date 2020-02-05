import React, {useCallback, useState, useEffect} from 'react';
import {getListUser} from './service/service';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from "@material-ui/core/TableFooter";
import useTheme from "@material-ui/core/styles/useTheme";
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import TableSortLabel from '@material-ui/core/TableSortLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from "@material-ui/core/Tooltip";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Filter from "@material-ui/icons/Search";
import './Demo.css';
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  table: {
    minWidth: 650,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  margin: {
    margin: '20px!important',
    width: '10%!important',
    float: 'left'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

const TablePaginationActions = (props) => {
  const classes = useStyles1();
  const theme = useTheme();
  const {count, page, rowsPerPage, onChangePage} = props;

  const handleFirstPageButtonClick = event => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = event => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = event => {
    onChangePage(event, page + 1);
  };
  const handleLastPageButtonClick = event => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon/> : <FirstPageIcon/>}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon/> : <LastPageIcon/>}
      </IconButton>
    </div>
  );
};
const Demo = () => {
  const headCells = [
    {id: 'id', label: 'Id'},
    {id: 'name', label: 'Name'},
    {id: 'username', label: 'Username'},
    {id: 'email', label: 'Email'},
    {id: 'company', label: 'Company'},
    {id: 'street', label: 'Street'},
    {id: 'city', label: 'City'},
    {id: 'phone', label: 'Phone'},
    {id: 'website', label: 'Website'},
    {id: 'action', label: 'Action'},
  ];

  function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }

  function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
  }

  function EnhancedTableHead(props) {
    const {classes, order, orderBy, onRequestSort} = props;
    const createSortHandler = property => event => {
      onRequestSort(event, property);
    };
    return (
      <TableHead>
        <TableRow>
          {
            headCells.map(headCell => headCell.id !== 'action' ? (
              <TableCell
                key={headCell.id}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ) : (
              <TableCell key={headCell.id}>
                {headCell.label}
              </TableCell>
            ))}
        </TableRow>
      </TableHead>
    );
  }

  const classes = useStyles();
  const handleClick = useCallback(() => {
  }, []);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pageFilter, setPageFilter] = useState(0);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rowsPerPageFilter, setRowsPerPageFilter] = React.useState(5);
  const [query, setQuery] = React.useState([]);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows && rows.length - page * rowsPerPage);
  const [open, setOpen] = React.useState(false);
  const [resultFinan, setResultFinan] = React.useState();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangePageFilter = (event, newPage) => {
    setPageFilter(newPage);
  };
  const handleChangeRowsPerPageFilter = event => {
    setRowsPerPageFilter(parseInt(event.target.value));
    setPageFilter(0);
  };
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };
  const handleIncrementClick = () => {
    setValue(prev => prev + 1)
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const searchChange = (event) => {
    if (event) {
      getListUser().then(res => {
        setTimeout(() => {
          const items = res.data.filter((item) => {
            return item.name.toLowerCase().search(
              event.toLowerCase()) !== -1;
          });
          setQuery(items);
          setRows([]);
        }, 2000);
      }).catch(err => {
      });
    } else {
      fetchListUser();
    }
  };
  const fetchListUser = () => {
    getListUser().then(res => {
      setTimeout(() => {
        const rows = res.data;
        setRows(rows);
        setLoading(false);
      }, 2000);
    }).catch(err => {
    });
  };
  const editUser = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const getItems = (array) =>
    Array.of(array).map(v => {
      return v;
    });
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const grid = 8;

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? "lightgreen" : "grey",
    ...draggableStyle
  });

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 250
  });
  const onDragEnd = result => {
    if (result && !result.destination) {
      return;
    }
    if (result) {
      resultFinan.forEach(element => {
        const items = reorder(
          element,
          result.source.index,
          result.destination.index
        );
        setResultFinan([[...items]])
      });
    }

  };
  useEffect(() => {
    getListUser().then(res => {
      setTimeout(() => {
        const rows = res.data;
        setLoading(false);
        setRows(rows);
        setResultFinan(getItems(res.data));
        onDragEnd();
      }, 2000);
    }).catch(err => {
    });
  }, []);
  return (
    <div>
      <div className={classes.root}>
        {
          loading ? <Backdrop
            className={classes.backdrop}
            open={loading}
          >
            <CircularProgress color="inherit"/>
          </Backdrop> : <> </>
        }
        <FormControl className={classes.margin}>
          <InputLabel htmlFor="standard-adornment-amount">Search Name</InputLabel>
          <Input
            fullWidth={true}
            type="search"
            margin="dense"
            onChange={(event) => searchChange(event.target.value)}
            endAdornment={<InputAdornment position="start"><Filter/></InputAdornment>}
          />
        </FormControl>
        {emptyRows > 0 ? <>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="custom pagination table">
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  classes={classes}
                />
                {rowsPerPage > 0 && rows && rows.length > 0 ? stableSort(rows, getSorting(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                  <TableBody>
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {
                          row.name
                        }
                      </TableCell>
                      <TableCell>{row.username}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.company?.name}</TableCell>
                      <TableCell>{row.address?.street}</TableCell>
                      <TableCell>{row.address?.city}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>{row.website}</TableCell>
                      <TableCell>
                        <Tooltip title="Delete">
                          <IconButton aria-label="delete">
                            <DeleteIcon/>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton aria-label="edit" onClick={() => editUser(row)}>
                            <EditIcon/>
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )) : stableSort(query, getSorting(order, orderBy)).slice(pageFilter * rowsPerPageFilter, pageFilter * rowsPerPageFilter + rowsPerPageFilter).map((row, index) => (
                  <TableBody>
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell>{row.username}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.company?.name}</TableCell>
                      <TableCell>{row.address?.street}</TableCell>
                      <TableCell>{row.address?.city}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>{row.website}</TableCell>
                      <TableCell>
                        <Tooltip title="Delete">
                          <IconButton aria-label="delete">
                            <DeleteIcon/>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton aria-label="edit">
                            <EditIcon/>
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  </TableBody>))}
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      colSpan={12}
                      SelectProps={{
                        inputProps: {'aria-label': 'rows per page'},
                        native: true,
                      }}
                      ActionsComponent={TablePaginationActions}
                      count={query && query.length}
                      rowsPerPage={rowsPerPageFilter}
                      page={pageFilter}
                      onChangePage={handleChangePageFilter}
                      onChangeRowsPerPage={handleChangeRowsPerPageFilter}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>No Result
          </> :
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="custom pagination table">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                classes={classes}
              />
              <TableBody>
                {rowsPerPage > 0 && rows.length > 0 ? stableSort(rows, getSorting(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.company?.name}</TableCell>
                    <TableCell>{row.address?.street}</TableCell>
                    <TableCell>{row.address?.city}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.website}</TableCell>
                    <TableCell>
                      <Tooltip title="Delete">
                        <IconButton aria-label="delete">
                          <DeleteIcon/>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton aria-label="edit" onClick={() => editUser(row)}>
                          <EditIcon/>
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )) : <></>}
              </TableBody>
              <TableFooter>
                <TableRow>
                  {
                    rows && <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      colSpan={12}
                      SelectProps={{
                        inputProps: {'aria-label': 'rows per page'},
                        native: true,
                      }}
                      ActionsComponent={TablePaginationActions}
                      count={rows && rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                  }
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 2000,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <h2 id="transition-modal-title">Transition modal</h2>
              <p id="transition-modal-description">react-transition-group animates me.</p>
            </div>
          </Fade>
        </Modal>
      </div>

      <p>You clicked {value} times</p>
      <h3>Demo Hook</h3>
      <div>{value}</div>
      <button onClick={handleClick}>Click Me</button>
      <button onClick={handleIncrementClick}>Increment</button>
      {resultFinan && resultFinan.map((result1, index) =>
        <div key={index}>
          {
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {result1 && result1.map((result2, index) => (
                      <Draggable key={result2.id} draggableId={result2.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            {result2.name}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          }
        </div>
      )}
    </div>
  );
};
export default Demo;