import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";

import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import { blue, grey } from "@material-ui/core/colors";

import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";

import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import Link from "@material-ui/core/Link";

import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import MessageIcon from "@material-ui/icons/Message";
import AssessmentIcon from "@material-ui/icons/Assessment";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";

import dateFormat from "dateformat";
import { activationsByStatus } from "../../../utils/ActivationsByStatus";
import activationsMethods from "../../../services/activationService";
import carddetailsMethods from "../../../services/carddetailService";
import commentMethods from "../../../services/commentService";

const theme = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: blue[600],
    },
    secondary: {
      // This is green.A700 as hex.
      main: grey[600],
    },
  },
});

const useStyles = makeStyles((theme) => ({
  editButton: {
    color: theme.palette.warning.dark,
    "&:hover": {
      color: theme.palette.warning.light,
    },
    marginRight: 4,
  },
  lockUnlockButton: {
    color: theme.palette.primary.dark,
    "&:hover": {
      color: theme.palette.primary.light,
    },
    marginRight: 4,
  },
  deleteButton: {
    color: theme.palette.secondary.dark,
    "&:hover": {
      color: theme.palette.secondary.light,
    },
    marginRight: 4,
  },
  progressColor: {
    color: "#FFF",
  },
  green: {
    backgroundColor: theme.palette.success.main,
    color: "#FFF",
    fontWeight: "bold",
  },
  red: {
    color: "#FFF",
    backgroundColor: theme.palette.secondary.main,
    fontWeight: "bold",
  },
  approveIcon: {
    backgroundColor: theme.palette.success.main,
    "&:hover": {
      color: theme.palette.success.main,
    },
    color: "#FFF",
    fontWeight: "bold",
    marginRight: 4,
  },
  rejectIcon: {
    backgroundColor: theme.palette.secondary.main,
    "&:hover": {
      color: theme.palette.secondary.main,
    },
    color: "#FFF",
    fontWeight: "bold",
    marginRight: 4,
  },
  root: {
    width: "100%",
    maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
    height: "400px",
    overflow: "scroll",
  },
  inline: {
    display: "inline",
  },
  typography: {
    padding: theme.spacing(2),
  },
}));

export default function ActivationsReport({ user }) {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [pageDetails, setPageDetails] = useState(0);
  const [rowsPerPageDetails, setRowsPerPageDetails] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePageDetails = (event, newPage) => {
    setPageDetails(newPage);
  };

  const handleChangeRowsPerPageDetails = (event) => {
    setRowsPerPageDetails(+event.target.value);
    setPageDetails(0);
  };

  const [activations, setActivations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [carddetails, setCarddetails] = useState([]);
  const [carddetailsByAct, setCarddetailsByAct] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentsByAct, setCommentsByAct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data: response } = await activationsMethods.getActivations(0);
      const {
        data: responseCardDetails,
      } = await carddetailsMethods.getCarddetails();
      const { data: responseComments } = await commentMethods.getComments();
      if (response) {
        setLoading(false);
        setActivations(response.data);
        setSearchResults(response.data);
        setCarddetails(responseCardDetails.data);
        setComments(responseComments.data);
      }
    }
    fetchData();
  }, []);

  const handleActivStatus = (e) => {
    const statusID = Number(e.target.value);
    const results = activationsByStatus(activations, statusID);
    setSearchResults(results);
  };

  const getCardDetailsByAct = (actID) => {
    const response = carddetails.filter((c) => c.act_id === Number(actID));
    setCarddetailsByAct(response);
  };

  const getCommentsByAct = (actID) => {
    const response = comments.filter((c) => c.act_id === Number(actID));
    setCommentsByAct(response);
  };

  const handleClickPopover = (event) => {
    setAnchorEl(event.currentTarget);
    const response = comments.filter(
      (c) => c.act_id === Number(event.currentTarget.value)
    );
    setCommentsByAct(response);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? "simple-popover" : undefined;

  const handleDelete = async (activId) => {
    const activationscopy = activations.filter((a) => a.id !== Number(activId));
    setSearchResults(activationscopy);
    setCarddetailsByAct([]);
    try {
      const response = await activationsMethods.deleteActivation(activId);
      if (response.status === 204) {
        const response1 = await carddetailsMethods.deleteCarddetailByActivId(
          activId
        );
        if (response1.status === 204) {
          toast.success("Activation deleted");
        }
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 404) toast.error(ex.response);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <div className="content-wrapper">
        <div className="page-header">
          <h3 className="page-title">
            <AssessmentIcon className="mr-2" color="primary" />
            Activations Status
          </h3>
          <nav aria-label="breadcrumb">
            <ul className="breadcrumb">
              <li className="breadcrumb-item active" aria-current="page">
                <span></span>Overview
                <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
              </li>
            </ul>
          </nav>
        </div>
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title float-left">Activations List</h4>
                {loading && (
                  <Loader
                    className="text-center"
                    color="#1e88e5"
                    type="ThreeDots"
                    height="50"
                    width="50"
                  />
                )}
                <div className="rounded-legend legend-horizontal legend-top-right float-right">
                  <div className="form-group">
                    <h4 className="card-title ">Status</h4>
                    <select
                      className="form-control"
                      onChange={(e) => handleActivStatus(e)}
                    >
                      <option value="0">Select Status</option>
                      <option value="1">Progress</option>
                      <option value="2">Approved</option>
                      <option value="3">Activated</option>
                      <option value="4">Rejected</option>
                      <option value="5">All</option>
                    </select>
                  </div>
                </div>
                <TableContainer>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Activation No</TableCell>
                        <TableCell>Agent Name</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Dealer Name</TableCell>
                        <TableCell>Approval 1</TableCell>
                        <TableCell>Approval 2</TableCell>
                        <TableCell>Approval 3</TableCell>
                        <TableCell>Activation Status</TableCell>
                        <TableCell align="center">
                          {user.profileId === 2
                            ? "Reject | Comment"
                            : "Comment"}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchResults
                        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
                        .reverse()
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((a) => (
                          <TableRow key={a.id}>
                            <TableCell>
                              <Link
                                component="button"
                                variant="body2"
                                underline="none"
                                onClick={() => {
                                  getCardDetailsByAct(a.id);
                                  getCommentsByAct(a.id);
                                }}
                              >
                                {a.actno}
                              </Link>
                            </TableCell>
                            <TableCell>{a.agents.name}</TableCell>
                            <TableCell>
                              {dateFormat(a.createdAt, "yyyy-mm-dd")}
                            </TableCell>
                            <TableCell>{a.dealers.dealername}</TableCell>
                            <TableCell>
                              {a.confirmation_lvl1 === 0 ? (
                                <Chip
                                  label="PROGRESS"
                                  color="primary"
                                  variant="outlined"
                                />
                              ) : a.confirmation_lvl1 === 1 ? (
                                <Chip label="APPROVED" color="primary" />
                              ) : (
                                <Chip label="REJECTED" color="secondary" />
                              )}
                            </TableCell>
                            <TableCell>
                              {a.confirmation_lvl2 === 0 ? (
                                <Chip
                                  label="PROGRESS"
                                  color="primary"
                                  variant="outlined"
                                />
                              ) : a.confirmation_lvl2 === 1 ? (
                                <Chip label="APPROVED" color="primary" />
                              ) : (
                                <Chip label="REJECTED" color="secondary" />
                              )}
                            </TableCell>
                            <TableCell>
                              {a.confirmation_lvl3 === 0 ? (
                                <Chip
                                  label="PROGRESS"
                                  color="primary"
                                  variant="outlined"
                                />
                              ) : a.confirmation_lvl3 === 1 ? (
                                <Chip label="APPROVED" color="primary" />
                              ) : (
                                <Chip label="REJECTED" color="secondary" />
                              )}
                            </TableCell>
                            <TableCell>
                              {a.status === 0 ? (
                                <Chip
                                  label="PROGRESS"
                                  color="primary"
                                  variant="outlined"
                                />
                              ) : a.status === 1 ? (
                                <Chip label="ACTIVATED" color="primary" />
                              ) : (
                                <Chip label="REJECTED" color="secondary" />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {a.status === 0 &&
                                a.confirmation_lvl2 === 2 &&
                                user.profileId === 2 && (
                                  <Tooltip title="Rejected">
                                    <IconButton
                                      size="small"
                                      aria-label="Rejected"
                                      color="primary"
                                      variant="outlined"
                                      onClick={() => handleDelete(a.id)}
                                    >
                                      <RemoveCircleOutlineIcon />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              <Tooltip title="Comments">
                                <IconButton
                                  size="small"
                                  aria-label="Comments"
                                  color="primary"
                                  variant="outlined"
                                  onClick={handleClickPopover}
                                  aria-describedby={id}
                                  value={a.id}
                                >
                                  <MessageIcon />
                                </IconButton>
                              </Tooltip>
                              <Popover
                                id={a.id}
                                open={openPopover}
                                anchorEl={anchorEl}
                                onClose={handleClosePopover}
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "center",
                                }}
                                transformOrigin={{
                                  vertical: "top",
                                  horizontal: "center",
                                }}
                              >
                                {commentsByAct.length > 0 ? (
                                  <List
                                    className={classes.root}
                                    aria-labelledby="nested-list-subheader"
                                    subheader={
                                      <ListSubheader
                                        component="div"
                                        id="nested-list-subheader"
                                      >
                                        <h4
                                          style={{
                                            margin: 30,
                                            textAlign: "left",
                                          }}
                                        >
                                          Comments
                                        </h4>
                                      </ListSubheader>
                                    }
                                  >
                                    {commentsByAct.map((c) => (
                                      <React.Fragment key={c.id}>
                                        <ListItem
                                          alignItems="flex-start"
                                          key={c.id}
                                        >
                                          <ListItemText
                                            primary={c.agents.name}
                                            secondary={
                                              <React.Fragment>
                                                {c.comment_text}
                                                <br />
                                                <br />
                                                {"Posted on " +
                                                  dateFormat(c.createdAt)}
                                              </React.Fragment>
                                            }
                                          />
                                        </ListItem>
                                        <Divider
                                          variant="inset"
                                          component="li"
                                        />
                                      </React.Fragment>
                                    ))}
                                  </List>
                                ) : (
                                  <Typography className={classes.typography}>
                                    No Comments
                                  </Typography>
                                )}
                              </Popover>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={activations.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Card details List</h4>
                <TableContainer>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Batch</TableCell>
                        <TableCell>Start Serial Number</TableCell>
                        <TableCell>End Serial Number</TableCell>
                        <TableCell>Pins</TableCell>
                        <TableCell>Cards</TableCell>
                        <TableCell>Denomination</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Activated At</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {carddetailsByAct
                        .slice(
                          pageDetails * rowsPerPageDetails,
                          pageDetails * rowsPerPageDetails + rowsPerPageDetails
                        )
                        .map((c) => (
                          <TableRow key={c.id}>
                            <TableCell>{c.batch}</TableCell>
                            <TableCell>{c.start_serialnumber}</TableCell>
                            <TableCell>{c.end_serialnumber}</TableCell>
                            <TableCell>{c.pins}</TableCell>
                            <TableCell>{c.cards}</TableCell>
                            <TableCell>{c.denominations.label}</TableCell>
                            <TableCell>
                              {dateFormat(c.createdAt, "yyyy-mm-dd")}
                            </TableCell>
                            <TableCell>
                              {dateFormat(c.activated_at, "yyyy-mm-dd")}
                            </TableCell>
                            <TableCell>
                              {c.status === true ? (
                                <Chip label="ACTIVATED" color="primary" />
                              ) : (
                                <Chip
                                  label="NOT ACTIVATED"
                                  color="primary"
                                  variant="outlined"
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={carddetailsByAct.length}
                  rowsPerPage={rowsPerPageDetails}
                  page={pageDetails}
                  onChangePage={handleChangePageDetails}
                  onChangeRowsPerPage={handleChangeRowsPerPageDetails}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
