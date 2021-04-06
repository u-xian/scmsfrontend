import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import { blue, grey } from "@material-ui/core/colors";

import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import TransferWithinAStationIcon from "@material-ui/icons/TransferWithinAStation";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

import dateFormat from "dateformat";
import { useForm } from "react-hook-form";
import { updateData } from "../../utils/updateData";
import { getMaxID } from "../../utils/getMaxID";
import dealerMethods from "../../services/dealerService";

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
  secondaryBar: {
    zIndex: 0,
  },
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

  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function Dealers() {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const { register, handleSubmit, setValue } = useForm();
  const [title, setTitle] = useState("Add Dealer");
  const [dealers, setDealers] = useState([]);
  const [dealerID, setDealerID] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: response } = await dealerMethods.getDealers();
      if (response) {
        setLoading(false);
        setDealers(response.data);
      }
    }
    fetchData();
  }, []);

  const handleUpdate = (dealerId) => {
    setTitle("Edit Dealer");
    const dealer = dealers.find((c) => c.id === Number(dealerId));
    setValue("dealername", dealer.dealername);
    setDealerID(dealerId);
  };

  const handleDelete = async (dealerId) => {
    try {
      await dealerMethods.deleteDealer(dealerId);
      const dealercopy = dealers.filter((c) => c.id !== Number(dealerId));
      toast.success("This dealer is now deleted.");
      setDealers(dealercopy);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This dealer has already been deleted.");
    }
  };

  const lockUnlock = async (dealerId) => {
    const dealer = dealers.find((c) => c.id === Number(dealerId));

    const updatedList = updateData(dealers, !dealer.status, dealerId);
    setDealers(updatedList);

    try {
      const dealerData = { status: !dealer.status };
      const { data: response } = await dealerMethods.updateStatusDealer(
        dealerId,
        dealerData
      );
      if (response.data.status === 1) {
        toast.success(response.data.statusMessage);
      } else {
        toast.error(response.data.statusMessage);
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This dealer has already been deleted.");
    }
  };

  const onSubmit = async (data) => {
    const dealerData = {
      dealername: data.dealername,
    };
    try {
      if (title === "Add") {
        setDealers([
          ...dealers,
          {
            id: getMaxID(dealers) + 1,
            dealername: data.dealername,
            status: true,
            createdAt: dateFormat(new Date(), "isoDateTime"),
            updatedAt: dateFormat(new Date(), "isoDateTime"),
          },
        ]);
        setValue("dealername", "");
        const { data: response } = await dealerMethods.createDealer(dealerData);
        if (response.data.status === 1) {
          toast.success(response.data.statusMessage);
        } else {
          toast.error(response.data.statusMessage);
        }
      } else {
        setDealers(
          dealers.map((x) => {
            if (x.id !== dealerID) return x;
            return { ...x, dealername: data.dealername };
          })
        );
        setValue("dealername", "");
        setTitle("Add");
        const { data: response } = await dealerMethods.updateDealer(
          dealerID,
          dealerData
        );
        if (response.data.status === 1) {
          toast.success(response.data.statusMessage);
        } else {
          toast.error(response.data.statusMessage);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Grid container direction="row" alignItems="center">
        <Grid item>
          <TransferWithinAStationIcon className="mr-2" color="primary" />
        </Grid>
        <Grid item>
          <Typography variant="h6" component="h6">
            Dealers
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Typography variant="h6" component="h6">
            {title}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container>
              <Grid container item xs={12} alignItems="center">
                <Grid item xs={8}>
                  <TextField
                    id="dealername"
                    placeholder="Dealer Name"
                    name="dealername"
                    inputRef={register}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    type="submit"
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item xs={9}>
          <Typography color="inherit" variant="h6" component="h6">
            Dealers List
          </Typography>
          {loading && (
            <Loader
              className="text-center"
              color="#1e88e5"
              type="ThreeDots"
              height="50"
              width="50"
            />
          )}
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Dealer Name</TableCell>
                  <TableCell align="left">Created At</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dealers
                  .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
                  .reverse()
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>{d.dealername}</TableCell>
                      <TableCell align="left">
                        {dateFormat(d.createdAt, "yyyy-mm-dd HH:MM:ss")}
                      </TableCell>
                      <TableCell align="center">
                        {d.status === true ? (
                          <Chip label="ACTIVE" color="primary" />
                        ) : (
                          <Chip label="LOCKED" ccolor="secondary" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            aria-label="Edit"
                            className={classes.editButton}
                            onClick={() => handleUpdate(d.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Lock / Unlock">
                          <IconButton
                            size="small"
                            aria-label="Lock / Unlock"
                            className={classes.lockUnlockButton}
                            onClick={() => lockUnlock(d.id)}
                          >
                            <LockOpenIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            aria-label="Delete"
                            className={classes.deleteButton}
                            onClick={() => handleDelete(d.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={dealers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
