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
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

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
import denominationMethods from "../../services/denominationService";

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
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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
}));

export default function Denominations() {
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
  const [title, setTitle] = useState("Add");
  const [denominations, setDenominations] = useState([]);
  const [denominationID, setDenominationID] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: response } = await denominationMethods.getDenominations();
      if (response) {
        setLoading(false);
        setDenominations(response.data);
      }
    }
    fetchData();
  }, []);

  const handleUpdate = (denominationId) => {
    setTitle("Edit");
    const denomination = denominations.find(
      (c) => c.id === Number(denominationId)
    );
    setValue("label", denomination.label);
    setValue("pinspercard", denomination.pinspercard);
    setValue("pinsvalue", denomination.pinsvalue);
    setDenominationID(denominationId);
  };

  const handleDelete = async (denominationId) => {
    try {
      await denominationMethods.deleteDenomination(denominationId);
      const denominationcopy = denominations.filter(
        (c) => c.id !== Number(denominationId)
      );
      toast.success("This denomination is now deleted.");
      setDenominations(denominationcopy);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This denomination has already been deleted.");
    }
  };

  const lockUnlock = async (denominationId) => {
    const denomination = denominations.find(
      (c) => c.id === Number(denominationId)
    );

    const updatedList = updateData(
      denominations,
      !denomination.status,
      denominationId
    );
    setDenominations(updatedList);

    try {
      const denominationData = { status: !denomination.status };
      const {
        data: response,
      } = await denominationMethods.updateStatusDenomination(
        denominationId,
        denominationData
      );
      if (response.data.status === 1) {
        toast.success(response.data.statusMessage);
      } else {
        toast.error(response.data.statusMessage);
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This denomination has already been deleted.");
    }
  };

  const resetFields = () => {
    setValue("label", "");
    setValue("pinspercard", "");
    setValue("pinsvalue", "");
  };

  const onSubmit = async (data) => {
    const denominationData = {
      label: data.label,
      pinspercard: Number(data.pinspercard),
      pinsvalue: Number(data.pinsvalue),
    };
    try {
      if (title === "Add") {
        setDenominations([
          ...denominations,
          {
            id: getMaxID(denominations) + 1,
            label: data.label,
            pinspercard: Number(data.pinspercard),
            pinsvalue: Number(data.pinsvalue),
            status: true,
            createdAt: dateFormat(new Date(), "isoDateTime"),
            updatedAt: dateFormat(new Date(), "isoDateTime"),
          },
        ]);
        resetFields();
        const { data: response } = await denominationMethods.createDenomination(
          denominationData
        );
        if (response.data.status === 1) {
          toast.success(response.data.statusMessage);
        } else {
          toast.error(response.data.statusMessage);
        }
      } else {
        setDenominations(
          denominations.map((x) => {
            if (x.id !== denominationID) return x;
            return {
              ...x,
              label: data.label,
              pinspercard: Number(data.pinspercard),
              pinsvalue: Number(data.pinsvalue),
            };
          })
        );
        resetFields();
        setTitle("Add");
        const { data: response } = await denominationMethods.updateDenomination(
          denominationID,
          denominationData
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
          <MonetizationOnIcon className="mr-2" color="primary" />
        </Grid>
        <Grid item>
          <Typography variant="h6" component="h6">
            Denominations
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
                    margin="normal"
                    type="text"
                    name="label"
                    placeholder="Label"
                    inputRef={register}
                  />
                  <TextField
                    margin="normal"
                    type="number"
                    InputProps={{
                      inputProps: {
                        min: 1,
                      },
                    }}
                    name="pinspercard"
                    placeholder="Pins per Card"
                    inputRef={register}
                  />
                  <TextField
                    margin="normal"
                    type="number"
                    name="pinsvalue"
                    InputProps={{
                      inputProps: {
                        min: 1,
                      },
                    }}
                    placeholder="Pins value"
                    inputRef={register}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
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
            Denominations List
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
                  <TableCell>Label</TableCell>
                  <TableCell>Pins / Card </TableCell>
                  <TableCell>Pins Value</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {denominations
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>{d.label}</TableCell>
                      <TableCell>{d.pinspercard}</TableCell>
                      <TableCell>{d.pinsvalue}</TableCell>
                      <TableCell align="left">
                        {dateFormat(d.createdAt, "yyyy-mm-dd HH:MM:ss")}
                      </TableCell>
                      <TableCell align="center">
                        {d.status === true ? (
                          <Chip label="ACTIVE" color="primary" />
                        ) : (
                          <Chip label="LOCKED" color="secondary" />
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
            count={denominations.length}
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
