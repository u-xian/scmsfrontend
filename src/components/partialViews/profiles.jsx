import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";

import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import { blue, grey } from "@material-ui/core/colors";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AccountBoxIcon from "@material-ui/icons/AccountBox";

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
import profileMethods from "../../services/profileService";

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

export default function Profiles() {
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
  const [profiles, setProfiles] = useState([]);
  const [profileID, setProfileID] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: response } = await profileMethods.getProfiles();
      if (response) {
        setLoading(false);
        setProfiles(response.data);
      }
    }
    fetchData();
  }, []);

  const handleUpdate = (profileId) => {
    setTitle("Edit");
    const profile = profiles.find((p) => p.id === Number(profileId));
    setValue("profilename", profile.profilename);
    setProfileID(profileId);
  };

  const handleDelete = async (profileId) => {
    const profilecopy = profiles.filter((p) => p.id !== Number(profileId));
    setProfiles(profilecopy);
    try {
      await profileMethods.deleteProfile(profileId);
      toast.success("This user is now deleted.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This user has already been deleted.");
    }
  };

  const lockUnlock = async (profileId) => {
    const profile = profiles.find((p) => p.id === Number(profileId));

    const updatedList = updateData(profiles, !profile.status, profileId);
    setProfiles(updatedList);

    try {
      const profileData = { status: !profile.status };
      const { data: response } = await profileMethods.updateStatusProfile(
        profileId,
        profileData
      );
      if (response.data.status === 1) {
        toast.success(response.data.statusMessage);
      } else {
        toast.error(response.data.statusMessage);
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This profile has already been deleted.");
    }
  };

  const onSubmit = async (data) => {
    const profileData = {
      profilename: data.profilename,
    };
    try {
      if (title === "Add") {
        setProfiles([
          ...profiles,
          {
            id: getMaxID(profiles) + 1,
            profilename: data.profilename,
            status: true,
            createdAt: dateFormat(new Date(), "isoDateTime"),
            updatedAt: dateFormat(new Date(), "isoDateTime"),
          },
        ]);
        setValue("profilename", "");
        const { data: response } = await profileMethods.createProfile(
          profileData
        );
        if (response.data.status === 1) {
          toast.success(response.data.statusMessage);
        } else {
          toast.error(response.data.statusMessage);
        }
      } else {
        setProfiles(
          profiles.map((x) => {
            if (x.id !== profileID) return x;
            return { ...x, profilename: data.profilename };
          })
        );
        setValue("profilename", "");
        setTitle("Add");
        const { data: response } = await profileMethods.updateProfile(
          profileID,
          profileData
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
          <AccountBoxIcon className="mr-2" color="primary" />
        </Grid>
        <Grid item>
          <Typography variant="h6" component="h6">
            Profiles
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
                    name="profilename"
                    placeholder="Profile Name"
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
            Profiles List
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
                  <TableCell>Profile Name</TableCell>
                  <TableCell align="left">Created At</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {profiles
                  .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
                  .reverse()
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.profilename}</TableCell>
                      <TableCell align="left">
                        {dateFormat(p.createdAt, "yyyy-mm-dd HH:MM:ss")}
                      </TableCell>
                      <TableCell align="center">
                        {p.status === true ? (
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
                            onClick={() => handleUpdate(p.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Lock / Unlock">
                          <IconButton
                            size="small"
                            aria-label="Lock / Unlock"
                            className={classes.lockUnlockButton}
                            onClick={() => lockUnlock(p.id)}
                          >
                            <LockOpenIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            aria-label="Delete"
                            className={classes.deleteButton}
                            onClick={() => handleDelete(p.id)}
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
            count={profiles.length}
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
