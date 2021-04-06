import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";

import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import { blue, grey } from "@material-ui/core/colors";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import MailIcon from "@material-ui/icons/Mail";

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
import mailreceiverMethods from "../../services/mailreceiverService";

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

export default function MailReceivers() {
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
  const [mailreceivers, setMailreceivers] = useState([]);
  const [mailreceiverID, setMailreceiverID] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: response } = await mailreceiverMethods.getMailreceivers();
      if (response) {
        setLoading(false);
        setMailreceivers(response.data);
      }
    }
    fetchData();
  }, []);

  const resetFields = () => {
    setValue("names", "");
    setValue("email", "");
  };

  const handleUpdate = (mailreceiverId) => {
    setTitle("Edit");
    const mailreceiver = mailreceivers.find(
      (c) => c.id === Number(mailreceiverId)
    );
    setValue("names", mailreceiver.names);
    setValue("email", mailreceiver.email);
    setMailreceiverID(mailreceiverId);
  };

  const handleDelete = async (mailreceiverId) => {
    try {
      await mailreceiverMethods.deleteMailreceiver(mailreceiverId);
      const mailreceivercopy = mailreceivers.filter(
        (c) => c.id !== Number(mailreceiverId)
      );
      toast.success("This mail receiver is now deleted.");
      setMailreceivers(mailreceivercopy);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This mail receiver has already been deleted.");
    }
  };

  const lockUnlock = async (mailreceiverId) => {
    const mailreceiver = mailreceivers.find(
      (c) => c.id === Number(mailreceiverId)
    );

    const updatedList = updateData(
      mailreceivers,
      !mailreceiver.status,
      mailreceiverId
    );
    setMailreceivers(updatedList);

    try {
      const mailreceiversData = { status: !mailreceiver.status };
      const {
        data: response,
      } = await mailreceiverMethods.updateStatusMailreceiver(
        mailreceiverId,
        mailreceiversData
      );
      if (response.data.status === 1) {
        toast.success(response.data.statusMessage);
      } else {
        toast.error(response.data.statusMessage);
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This user has already been deleted.");
    }
  };

  const onSubmit = async (data) => {
    const mailreceiversData = {
      names: data.names,
      email: data.email,
    };
    try {
      if (title === "Add") {
        setMailreceivers([
          ...mailreceivers,
          {
            id: getMaxID(mailreceivers) + 1,
            names: data.names,
            email: data.email,
            status: true,
            createdAt: dateFormat(new Date(), "isoDateTime"),
            updatedAt: dateFormat(new Date(), "isoDateTime"),
          },
        ]);
        resetFields();

        const { data: response } = await mailreceiverMethods.createMailreceiver(
          mailreceiversData
        );
        if (response.data.status === 1) {
          toast.success(response.data.statusMessage);
          //window.location = "/mailreceiver";
        } else {
          toast.error(response.data.statusMessage);
        }
      } else {
        setMailreceivers(
          mailreceivers.map((x) => {
            if (x.id !== mailreceiverID) return x;
            return {
              ...x,
              names: data.names,
              email: data.email,
            };
          })
        );
        resetFields();
        setTitle("Add");
        const { data: response } = await mailreceiverMethods.updateMailreceiver(
          mailreceiverID,
          mailreceiversData
        );
        if (response.data.status === 1) {
          toast.success(response.data.statusMessage);
          //window.location = "/mailreceiver";
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
          <MailIcon className="mr-2" color="primary" />
        </Grid>
        <Grid item>
          <Typography variant="h6" component="h6">
            Mail Receivers
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
                    type="text"
                    name="names"
                    margin="normal"
                    placeholder="Names"
                    inputRef={register}
                  />
                  <TextField
                    type="email"
                    name="email"
                    margin="normal"
                    placeholder="Email"
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
            Mail Receivers List
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
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mailreceivers
                  .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
                  .reverse()
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{m.names}</TableCell>
                      <TableCell>{m.email}</TableCell>
                      <TableCell>
                        {dateFormat(m.createdAt, "yyyy-mm-dd")}
                      </TableCell>
                      <TableCell>
                        {m.status === true ? (
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
                            onClick={() => handleUpdate(m.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Lock / Unlock">
                          <IconButton
                            size="small"
                            aria-label="Lock / Unlock"
                            className={classes.lockUnlockButton}
                            onClick={() => lockUnlock(m.id)}
                          >
                            <LockOpenIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            aria-label="Delete"
                            className={classes.deleteButton}
                            onClick={() => handleDelete(m.id)}
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
            count={mailreceivers.length}
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
