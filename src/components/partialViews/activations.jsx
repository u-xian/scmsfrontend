import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { blue, grey } from "@material-ui/core/colors";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import ShopIcon from "@material-ui/icons/Shop";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";

import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import MessageIcon from "@material-ui/icons/Message";

import TablePagination from "@material-ui/core/TablePagination";

import dateFormat from "dateformat";
import activationsMethods from "../../services/activationService";
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

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  tablecell: {
    fontSize: "8pt",
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  tablecell: {
    fontSize: "8pt",
  },
}));

function Row(props) {
  const { row, user } = props;
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newcomment, setNewComment] = useState({});
  const [commentsByAct, setCommentsByAct] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElReject, setAnchorElReject] = useState(null);
  const [loading, setLoading] = useState(false);

  const [pageDetails, setPageDetails] = useState(0);
  const [rowsPerPageDetails, setRowsPerPageDetails] = useState(5);

  useEffect(() => {
    async function fetchData() {
      const { data: responseComments } = await commentMethods.getComments();
      if (responseComments) {
        setComments(responseComments.data);
      }
    }
    fetchData();
  });

  const handleChangePageDetails = (event, newPage) => {
    setPageDetails(newPage);
  };

  const handleChangeRowsPerPageDetails = (event) => {
    setRowsPerPageDetails(+event.target.value);
    setPageDetails(0);
  };

  const handleClickReject = (event) => {
    setAnchorElReject(event.currentTarget);
  };

  const handleCloseReject = () => {
    setAnchorElReject(null);
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

  const openReject = Boolean(anchorElReject);
  const idReject = openReject ? "simple-popoverReject" : undefined;
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell className={classes.tablecell}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Chip
            label={row.actno}
            color="primary"
            variant="outlined"
            size="small"
            className={classes.tablecell}
          />
        </TableCell>
        <TableCell className={classes.tablecell}>
          {dateFormat(row.createdAt, "yyyy-mm-dd")}
        </TableCell>
        <TableCell className={classes.tablecell}>
          {row.dealers.dealername}
        </TableCell>
        <TableCell>
          {row.confirmation_lvl1 === 0 ? (
            <Chip
              label="Progress"
              color="primary"
              variant="outlined"
              size="small"
              className={classes.tablecell}
            />
          ) : row.confirmation_lvl1 === 1 ? (
            <Chip
              color="primary"
              size="small"
              label="Approved"
              className={classes.tablecell}
            />
          ) : (
            <Chip
              color="secondary"
              size="small"
              label="Rejected"
              className={classes.tablecell}
            />
          )}
        </TableCell>
        <TableCell>
          {row.confirmation_lvl2 === 0 ? (
            <Chip
              label="Progress"
              color="primary"
              variant="outlined"
              size="small"
              className={classes.tablecell}
            />
          ) : row.confirmation_lvl2 === 1 ? (
            <Chip
              label="Approved"
              color="primary"
              size="small"
              className={classes.tablecell}
            />
          ) : (
            <Chip
              label="Rejected"
              color="secondary"
              size="small"
              className={classes.tablecell}
            />
          )}
        </TableCell>
        <TableCell>
          {row.confirmation_lvl3 === 0 ? (
            <Chip
              label="Progress"
              color="primary"
              variant="outlined"
              size="small"
              className={classes.tablecell}
            />
          ) : row.confirmation_lvl3 === 1 ? (
            <Chip
              label="Approved"
              color="primary"
              size="small"
              className={classes.tablecell}
            />
          ) : (
            <Chip
              label="Rejected"
              color="secondary"
              size="small"
              className={classes.tablecell}
            />
          )}
        </TableCell>
        <TableCell align="center" className={classes.tablecell}>
          {loading && (
            <Loader
              className="text-center"
              color="#1e88e5"
              type="ThreeDots"
              height="50"
              width="50"
            />
          )}
          <Tooltip title="Approve">
            <IconButton
              size="small"
              aria-label="Approve"
              color="primary"
              onClick={() => changeConfirmStatus(row.id, "a")}
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
              value={row.id}
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
                    changeConfirmStatus(row.id, "r");
                  }}
                >
                  Reject
                </Button>
              </CardActions>
            </Card>
          </Popover>
          <Popover
            id={row.id}
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
                  <ListSubheader component="div" id="nested-list-subheader">
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
                    <ListItem alignItems="flex-start" key={c.id}>
                      <ListItemText
                        primary={c.agents.name}
                        secondary={
                          <React.Fragment>
                            {c.comment_text}
                            <br />
                            <br />
                            {"Posted on " + dateFormat(c.createdAt)}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
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

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Card details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tablecell}>Batch</TableCell>
                    <TableCell className={classes.tablecell}>
                      Start SN
                    </TableCell>
                    <TableCell className={classes.tablecell}>End SN</TableCell>
                    <TableCell className={classes.tablecell}>Pins</TableCell>
                    <TableCell className={classes.tablecell}>Cards</TableCell>
                    <TableCell className={classes.tablecell}>
                      Denomination
                    </TableCell>
                    <TableCell className={classes.tablecell}>Created</TableCell>
                    <TableCell className={classes.tablecell}>
                      Activated
                    </TableCell>
                    <TableCell className={classes.tablecell}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.cardsdetails
                    .slice(
                      pageDetails * rowsPerPageDetails,
                      pageDetails * rowsPerPageDetails + rowsPerPageDetails
                    )
                    .map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className={classes.tablecell}>
                          {c.batch}
                        </TableCell>
                        <TableCell className={classes.tablecell}>
                          {c.start_serialnumber}
                        </TableCell>
                        <TableCell className={classes.tablecell}>
                          {c.end_serialnumber}
                        </TableCell>
                        <TableCell className={classes.tablecell}>
                          {c.pins}
                        </TableCell>
                        <TableCell className={classes.tablecell}>
                          {c.cards}
                        </TableCell>
                        <TableCell className={classes.tablecell}>
                          {c.denominations.label}
                        </TableCell>
                        <TableCell className={classes.tablecell}>
                          {dateFormat(c.createdAt, "yyyy-mm-dd")}
                        </TableCell>
                        <TableCell className={classes.tablecell}>
                          {dateFormat(c.activated_at, "yyyy-mm-dd")}
                        </TableCell>
                        <TableCell className={classes.tablecell}>
                          {c.status === true ? (
                            <Chip
                              label="Activated"
                              color="primary"
                              size="small"
                              className={classes.tablecell}
                            />
                          ) : (
                            <Chip
                              label="Not Activated"
                              color="primary"
                              variant="outlined"
                              size="small"
                              className={classes.tablecell}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={row.cardsdetails.length}
                rowsPerPage={rowsPerPageDetails}
                page={pageDetails}
                onChangePage={handleChangePageDetails}
                onChangeRowsPerPage={handleChangeRowsPerPageDetails}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Activations({ user }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [activations, setActivations] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data: response } = await activationsMethods.getActivations(
        user.profileId
      );
      if (response) {
        setLoading(false);
        setActivations(response.data);
      }
    }
    fetchData();
  }, [user.profileId]);

  return (
    <ThemeProvider theme={theme}>
      <Grid container direction="row" alignItems="center">
        <Grid item>
          <ShopIcon className="mr-2" color="primary" />
        </Grid>
        <Grid item>
          <Typography variant="h6" component="h6">
            Activations
          </Typography>
        </Grid>
      </Grid>
      <Grid container direction="row" alignItems="center">
        {loading && (
          <Loader
            className="text-center"
            color="#1e88e5"
            type="ThreeDots"
            height="50"
            width="50"
          />
        )}
        <TableContainer aria-label="sticky table" size="small">
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell className={classes.tablecell}>
                  Activation No
                </TableCell>
                <TableCell className={classes.tablecell}>Created At</TableCell>
                <TableCell className={classes.tablecell}>Dealer Name</TableCell>
                <TableCell className={classes.tablecell}>Approval 1</TableCell>
                <TableCell className={classes.tablecell}>Approval 2</TableCell>
                <TableCell className={classes.tablecell}>Approval 3</TableCell>
                <TableCell align="center" className={classes.tablecell}>
                  Approve | Reject | Comment
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activations
                .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
                .reverse()
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <Row key={row.id} row={row} user={user} />
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
      </Grid>
    </ThemeProvider>
  );
}
