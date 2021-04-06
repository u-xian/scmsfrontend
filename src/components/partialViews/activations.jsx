import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";

import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import { yellow, blue, grey } from "@material-ui/core/colors";

import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import Link from "@material-ui/core/Link";

import ShopIcon from "@material-ui/icons/Shop";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import MessageIcon from "@material-ui/icons/Message";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";

import dateFormat from "dateformat";
import activationsMethods from "../../services/activationService";
import carddetailsMethods from "../../services/carddetailService";
import commentMethods from "../../services/commentService";

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
  yellow: {
    color: "#FFF",
    backgroundColor: yellow[600],
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

export default function Activations({ user }) {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [pageDetails, setPageDetails] = useState(0);
  const [rowsPerPageDetails, setRowsPerPageDetails] = useState(5);

  const [anchorEl, setAnchorEl] = useState(null);

  const [anchorElReject, setAnchorElReject] = useState(null);

  const handleClickReject = (event) => {
    setAnchorElReject(event.currentTarget);
  };

  const handleCloseReject = () => {
    setAnchorElReject(null);
  };

  const openReject = Boolean(anchorElReject);
  const idReject = openReject ? "simple-popoverReject" : undefined;

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
  const [carddetails, setCarddetails] = useState([]);
  const [carddetailsByAct, setCarddetailsByAct] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentsByAct, setCommentsByAct] = useState([]);
  const [newcomment, setNewComment] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: response } = await activationsMethods.getActivations(
        user.profileId
      );
      const {
        data: responseCardDetails,
      } = await carddetailsMethods.getCarddetails();
      const { data: responseComments } = await commentMethods.getComments();
      if (response) {
        setLoading(false);
        setActivations(response.data);
        setCarddetails(responseCardDetails.data);
        setComments(responseComments.data);
      }
    }
    fetchData();
  }, [user.profileId]);

  const getCardDetailsByAct = (actID) => {
    const response = carddetails.filter((c) => c.act_id === Number(actID));
    setCarddetailsByAct(response);
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

  const getCommentsByAct = (actID) => {
    const response = comments.filter((c) => c.act_id === Number(actID));
    setCommentsByAct(response);
  };

  const changeConfirmStatus = async (actID, updateType) => {
    setLoading(true);
    try {
      if (updateType === "a") {
        const {
          data: response,
        } = await activationsMethods.updateConfirmActivation(actID, {
          level: user.profileId,
          confirmStatus: false,
        });
        if (response.data.status === 1) {
          setLoading(false);
          toast.success(response.data.statusMessage);
          window.location = "/activations";
        } else {
          setLoading(false);
          toast.error(response.data.statusMessage);
        }
      }
      if (updateType === "r") {
        const {
          data: response,
        } = await activationsMethods.updateConfirmActivation(actID, {
          level: user.profileId,
          confirmStatus: true,
        });
        if (response.data.status === 1) {
          const cmtData = {
            comment_text: newcomment.cmtText,
            act_id: actID,
            userid: user.userid,
          };
          const resp = await commentMethods.createComment(cmtData);
          console.log(resp);
          if (resp.data.status === 1) {
            setLoading(false);
            toast.success(response.data.statusMessage);
            window.location = "/activations";
          } else {
            setLoading(false);
            toast.error(resp.data.statusMessage);
          }
        } else {
          setLoading(false);
          toast.error(response.data.statusMessage);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = (e) => {
    setNewComment({
      id: e.target.id,
      cmtText: e.target.value,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="content-wrapper">
        <div className="page-header">
          <h3 className="page-title">
            <ShopIcon className="mr-2" color="primary" />
            Activations
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
                <TableContainer>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Activation No</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Dealer Name</TableCell>
                        <TableCell>Approval 1</TableCell>
                        <TableCell>Approval 2</TableCell>
                        <TableCell>Approval 3</TableCell>
                        <TableCell align="center">
                          Approve | Reject | Comment
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activations
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
                            <TableCell align="center">
                              <Tooltip title="Approve">
                                <IconButton
                                  size="small"
                                  aria-label="Approve"
                                  color="primary"
                                  onClick={() => changeConfirmStatus(a.id, "a")}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Rejected">
                                <IconButton
                                  size="small"
                                  aria-label="Rejected"
                                  color="primary"
                                  variant="outlined"
                                  onClick={handleClickReject}
                                >
                                  <RemoveCircleOutlineIcon />
                                </IconButton>
                              </Tooltip>
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
                                id={idReject}
                                open={openReject}
                                anchorEl={anchorElReject}
                                onClose={handleCloseReject}
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "center",
                                }}
                                transformOrigin={{
                                  vertical: "top",
                                  horizontal: "center",
                                }}
                              >
                                <Card style={{ minWidth: 275 }}>
                                  <CardContent>
                                    <Typography variant="h5" component="h2">
                                      Comment
                                    </Typography>
                                    <Typography
                                      style={{ fontSize: 14, marginBottom: 12 }}
                                      color="textSecondary"
                                    >
                                      Write comment below for rejection
                                    </Typography>
                                    <TextField
                                      name="comment"
                                      label="Notes"
                                      fullWidth
                                      variant="outlined"
                                      multiline
                                      onChange={handleComment}
                                    />
                                  </CardContent>
                                  <CardActions>
                                    <Button
                                      size="small"
                                      color="primary"
                                      variant="contained"
                                      onClick={() => {
                                        handleCloseReject();
                                        changeConfirmStatus(a.id, "r");
                                      }}
                                    >
                                      Reject
                                    </Button>
                                  </CardActions>
                                </Card>
                              </Popover>
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
