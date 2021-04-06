import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";

import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import { blue, grey } from "@material-ui/core/colors";

import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormLabel from "@material-ui/core/FormLabel";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import MenuIcon from "@material-ui/icons/Menu";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import dateFormat from "dateformat";
import { useForm } from "react-hook-form";
import { updateData } from "../../utils/updateData";
import menuMethods from "../../services/menuService";
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
  tablecell: {
    fontSize: "10pt",
  },
}));

export default function MenuAccess() {
  const classes = useStyles();

  const { register, handleSubmit, setValue } = useForm();
  const [title, setTitle] = useState("Add");
  const [accesslevelsChecked, setAccesslevelsChecked] = useState([]);
  const [menus, setMenus] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [menuID, setMenuID] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await menuMethods.getAllMenus();
      const { data: responseProfiles } = await profileMethods.getProfiles();
      if (response) {
        setLoading(false);
        setMenus(response);
        setProfiles(responseProfiles.data);
      }
    }
    fetchData();
  }, []);

  const onAccessLevelChange = (e, id) => {
    let result = [...accesslevelsChecked];
    if (result.includes(id) && !e.target.checked) {
      const filteredResult = result.filter((r) => r !== id);
      setAccesslevelsChecked(filteredResult);
    } else {
      result = [...accesslevelsChecked, id];
      setAccesslevelsChecked(result);
    }
  };

  const handleUpdate = (menuId) => {
    setTitle("Edit");
    const menu = menus.find((c) => c.id === Number(menuId));
    setValue("pathname", menu.pathname);
    setValue("description", menu.description);
    setValue("menuicon", menu.menuicon);
    setIsSwitchOn(menu.defaultmenuitem);
    setMenuID(menuId);
  };

  const handleDelete = async (menuId) => {
    const menucopy = menus.filter((c) => c.id !== Number(menuId));
    setMenus(menucopy);
    try {
      await menuMethods.deleteMenu(menuId);
      toast.success("This menu is now deleted.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This menu has already been deleted.");
    }
  };

  const lockUnlock = async (menuId) => {
    const menu = menus.find((c) => c.id === Number(menuId));

    const updatedList = updateData(menus, !menu.status, menuId);
    setMenus(updatedList);

    try {
      const menuAccessData = { status: !menu.status };
      const { data: response } = await menuMethods.updateStatusMenu(
        menuId,
        menuAccessData
      );
      if (response.data.status === 1) {
        toast.success(response.data.statusMessage);
      } else {
        toast.error(response.data.statusMessage);
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This menu has already been deleted.");
    }
  };

  const onSubmit = async (data) => {
    const menuAccessData = {
      pathname: data.pathname,
      description: data.description,
      accesslevel: accesslevelsChecked,
      menuicon: data.menuicon,
      defaultmenuitem: isSwitchOn,
    };
    console.log(menuAccessData);
    try {
      if (title === "Add") {
        const { data: response } = await menuMethods.createMenu(menuAccessData);
        if (response.data.status === 1) {
          toast.success(response.data.statusMessage);
          window.location = "/menuaccess";
        } else {
          toast.error(response.data.statusMessage);
        }
      } else {
        const { data: response } = await menuMethods.updateMenu(
          menuID,
          menuAccessData
        );
        if (response.data.status === 1) {
          toast.success(response.data.statusMessage);
          window.location = "/menuaccess";
        } else {
          toast.error(response.data.statusMessage);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* const [rst, setRst] = useState([]);
  let f1 = [];

  const alevel = menus.find((m) => m.id === 2);
  const d1 = alevel.accesslevel;
  console.log(d1);
  console.log(profiles);

  d1.forEach((s) => {
    let r1 = profiles.find((p) => p.id === s);
    f1.push(r1);
  });
  console.log(f1);
  const menuNew = [...menus, f1];
  console.log(menuNew); */

  return (
    <ThemeProvider theme={theme}>
      <Grid container direction="row" alignItems="center">
        <Grid item>
          <MenuIcon className="mr-2" color="primary" />
        </Grid>
        <Grid item>
          <Typography variant="h6" component="h6">
            Menu Access
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
                    name="pathname"
                    margin="normal"
                    placeholder="Pathname"
                    inputRef={register}
                  />
                  <TextField
                    type="text"
                    name="description"
                    margin="normal"
                    placeholder="Description"
                    inputRef={register}
                  />

                  <FormLabel margin="normal">Access Levels</FormLabel>

                  {profiles.map((p) => (
                    <FormGroup key={p.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="checkedB"
                            color="primary"
                            value={p.id}
                            onChange={(e) => onAccessLevelChange(e, p.id)}
                          />
                        }
                        label={p.profilename}
                      />
                    </FormGroup>
                  ))}
                  <TextField
                    type="text"
                    name="menuicon"
                    margin="normal"
                    placeholder="Menu Icon"
                    inputRef={register}
                  />
                  <FormControlLabel
                    value="start"
                    control={
                      <Switch
                        color="primary"
                        name="defaultmenuitem"
                        id="custom-switch"
                        onChange={() => setIsSwitchOn(!isSwitchOn)}
                        checked={isSwitchOn}
                      />
                    }
                    label="Default Menu"
                    labelPlacement="start"
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
            Menu Access List
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
                  <TableCell className={classes.tablecell}>Pathname</TableCell>
                  <TableCell className={classes.tablecell}>
                    Description
                  </TableCell>
                  <TableCell className={classes.tablecell}>
                    Access Level
                  </TableCell>
                  <TableCell className={classes.tablecell}>
                    Default Menu
                  </TableCell>
                  <TableCell className={classes.tablecell}>
                    Created At
                  </TableCell>
                  <TableCell className={classes.tablecell}>Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menus.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className={classes.tablecell}>
                      {m.pathname}
                    </TableCell>
                    <TableCell className={classes.tablecell}>
                      {m.description}
                    </TableCell>
                    <TableCell className={classes.tablecell}>
                      {m.profileLevels.map((l) => (
                        <span key={l.id}>
                          {l.profilename}
                          <br />
                        </span>
                      ))}
                    </TableCell>
                    <TableCell className={classes.tablecell}>
                      {m.defaultmenuitem === true ? "Yes" : "No"}
                    </TableCell>

                    <TableCell className={classes.tablecell}>
                      {dateFormat(m.createdAt, "yyyy-mm-dd")}
                    </TableCell>
                    <TableCell className={classes.tablecell}>
                      {m.status === true ? (
                        <Chip label="ACTIVE" color="primary" size="small" />
                      ) : (
                        <Chip label="LOCKED" color="secondary" size="small" />
                      )}
                    </TableCell>

                    <TableCell align="center" className={classes.tablecell}>
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
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
