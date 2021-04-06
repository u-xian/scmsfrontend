import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";

import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import { blue, grey } from "@material-ui/core/colors";

import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PeopleIcon from "@material-ui/icons/People";

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
import userMethods from "../../services/userService";
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

export default function Users() {
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
  const [users, setUsers] = useState([]);
  const [userID, setUserID] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [profileID, setprofileID] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: response } = await userMethods.getUsers();
      const { data: responseProfiles } = await profileMethods.getProfiles();
      if (response) {
        setLoading(false);
        setUsers(response.data);
        setProfiles(responseProfiles.data);
      }
    }
    fetchData();
  }, []);

  const resetFields = () => {
    setValue("names", "");
    setValue("username", "");
    setValue("email", "");
    setValue("phone", "");
    setValue("occupation", "");
    setValue("location", "");
    setValue("profileuser", "");
  };
  const handleUpdate = (userId) => {
    setTitle("Edit");
    const user = users.find((c) => c.id === Number(userId));
    setValue("names", user.name);
    setValue("username", user.username);
    setValue("email", user.email);
    setValue("phone", user.phone);
    setValue("occupation", user.occupation);
    setValue("location", user.location);
    setUserID(userId);
  };

  const handleDelete = async (userId) => {
    try {
      await userMethods.deleteUser(userId);
      const usercopy = users.filter((c) => c.id !== Number(userId));
      toast.success("This user is now deleted.");
      setUsers(usercopy);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This user has already been deleted.");
    }
  };

  const lockUnlock = async (userId) => {
    const user = users.find((c) => c.id === Number(userId));

    const updatedList = updateData(users, !user.status, userId);
    setUsers(updatedList);

    try {
      const userData = { status: !user.status };
      const { data: response } = await userMethods.updateStatusUser(
        userId,
        userData
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
    const userData = {
      name: data.names,
      username: data.username,
      email: data.email,
      phone: data.phone,
      occupation: data.occupation,
      location: data.location,
      profil_id: profileID,
    };
    const userprofile = profiles.find((p) => p.id === Number(profileID));
    try {
      if (title === "Add") {
        setUsers([
          ...users,
          {
            id: getMaxID(users) + 1,
            name: data.names,
            username: data.username,
            email: data.email,
            phone: data.phone,
            occupation: data.occupation,
            location: data.location,
            profiles: {
              profilename: userprofile.profilename,
            },
            status: true,
            createdAt: dateFormat(new Date(), "isoDateTime"),
            updatedAt: dateFormat(new Date(), "isoDateTime"),
          },
        ]);
        resetFields();
        const { data: response } = await userMethods.createUser(userData);
        if (response.data.status === 1) {
          toast.success(response.data.statusMessage);
        } else {
          toast.error(response.data.statusMessage);
        }
      } else {
        setUsers(
          users.map((x) => {
            if (x.id !== userID) return x;
            return {
              ...x,
              name: data.names,
              username: data.username,
              email: data.email,
              phone: data.phone,
              occupation: data.occupation,
              location: data.location,
              profiles: {
                profilename: userprofile.profilename,
              },
            };
          })
        );
        resetFields();
        setTitle("Add");
        const { data: response } = await userMethods.updateUser(
          userID,
          userData
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
          <PeopleIcon className="mr-2" color="primary" />
        </Grid>
        <Grid item>
          <Typography variant="h6" component="h6">
            Users
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
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
                    type="text"
                    name="username"
                    margin="normal"
                    placeholder="Username"
                    inputRef={register}
                  />
                  <TextField
                    type="email"
                    name="email"
                    margin="normal"
                    placeholder="Email"
                    inputRef={register}
                  />
                  <TextField
                    type="text"
                    name="phone"
                    margin="normal"
                    placeholder="Phone Number"
                    inputRef={register}
                  />
                  <TextField
                    type="text"
                    name="occupation"
                    margin="normal"
                    placeholder="Occupation"
                    inputRef={register}
                  />
                  <TextField
                    type="text"
                    name="location"
                    margin="normal"
                    placeholder="Location"
                    inputRef={register}
                  />
                  <Select
                    native
                    className="mt-4"
                    fullWidth
                    name="profileuser"
                    inputRef={register}
                    onChange={(e) => setprofileID(e.target.value)}
                  >
                    <option aria-label="None" value="">
                      Choose Profile
                    </option>
                    {profiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.profilename}
                      </option>
                    ))}
                  </Select>

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
            Users List
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
                  <TableCell>Username</TableCell>

                  <TableCell>Profile</TableCell>

                  <TableCell>Created At</TableCell>

                  <TableCell>Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
                  .reverse()
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.username}</TableCell>
                      <TableCell>{u.profiles.profilename}</TableCell>
                      <TableCell>
                        {dateFormat(u.createdAt, "yyyy-mm-dd")}
                      </TableCell>
                      <TableCell>
                        {u.status === true ? (
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
                            onClick={() => handleUpdate(u.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Lock / Unlock">
                          <IconButton
                            size="small"
                            aria-label="Lock / Unlock"
                            className={classes.lockUnlockButton}
                            onClick={() => lockUnlock(u.id)}
                          >
                            <LockOpenIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            aria-label="Delete"
                            className={classes.deleteButton}
                            onClick={() => handleDelete(u.id)}
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
            count={users.length}
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
