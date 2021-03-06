import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Route, Switch } from "react-router-dom";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  createMuiTheme,
  ThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Hidden from "@material-ui/core/Hidden";

//Authentication
import auth from "./services/authService";
import Login from "./components/authentication/login";
import Logout from "./components/authentication/logout";
import ChangePassword from "./components/forms/changepassword";

//Layout Views
import Navigator from "./layout/Navigator";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

//Partial Views
import Home from "./components/partialViews/home";
import Users from "./components/partialViews/users";
import Dealers from "./components/partialViews/dealers";
import Denominations from "./components/partialViews/denominations";
import MailReceivers from "./components/partialViews/mailreceivers";

import Activations from "./components/partialViews/activations";
import MenuAccess from "./components/partialViews/menuaccess";
import Profiles from "./components/partialViews/profiles";
import Pos from "./components/partialViews/posForm";

//Reports
import ActivationsReport from "./components/partialViews/reports/activationsReport";
import Test from "./components/partialViews/test";

const store = configureStore();

let theme = createMuiTheme({
  palette: {
    primary: {
      light: "#63ccff",
      main: "#009be5",
      dark: "#006db3",
    },
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  props: {
    MuiTab: {
      disableRipple: true,
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: "#18202c",
      },
    },
    MuiButton: {
      label: {
        textTransform: "none",
      },
      contained: {
        boxShadow: "none",
        "&:active": {
          boxShadow: "none",
        },
      },
    },
    MuiTabs: {
      root: {
        marginLeft: theme.spacing(1),
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: theme.palette.common.white,
      },
    },
    MuiTab: {
      root: {
        textTransform: "none",
        margin: "0 16px",
        minWidth: 0,
        padding: 0,
        [theme.breakpoints.up("md")]: {
          padding: 0,
          minWidth: 0,
        },
      },
    },
    MuiIconButton: {
      root: {
        padding: theme.spacing(1),
      },
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4,
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: "#404854",
      },
    },
    MuiListItemText: {
      primary: {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    MuiListItemIcon: {
      root: {
        color: "inherit",
        marginRight: 0,
        "& svg": {
          fontSize: 20,
        },
      },
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32,
      },
    },
  },
};

const drawerWidth = 256;

const styles = {
  root: {
    display: "flex",
    minHeight: "100vh",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  app: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
    padding: theme.spacing(6, 4),
    background: "#eaeff1",
  },
  footer: {
    padding: theme.spacing(2),
    background: "#eaeff1",
  },
};

function App(props) {
  const { classes } = props;
  const [currentUser, setCurrentUser] = useState({});
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (user) setCurrentUser(user);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {_.isEmpty(currentUser) && <Route exact path="/" component={Login} />}
      {_.isEmpty(currentUser) && (
        <Route path="/changepassword" component={ChangePassword} />
      )}
      {_.isEmpty(currentUser) === false && (
        <div className={classes.root}>
          <CssBaseline />
          <nav className={classes.drawer}>
            <Hidden smUp implementation="js">
              <Navigator
                PaperProps={{ style: { width: drawerWidth } }}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                user={currentUser}
              />
            </Hidden>
            <Hidden xsDown implementation="css">
              <Navigator
                PaperProps={{ style: { width: drawerWidth } }}
                user={currentUser}
              />
            </Hidden>
          </nav>
          <div className={classes.app}>
            <Header onDrawerToggle={handleDrawerToggle} user={currentUser} />
            <main className={classes.main}>
              <ToastContainer />
              <Switch>
                {/* Authentication Routes */}
                <Route path="/login" component={Login} />
                <Route path="/logout" component={Logout} />

                <Route path="/selfchangepassword">
                  <ChangePassword userData={currentUser} />
                </Route>

                {/* Partials Routes */}
                <Route path="/home" component={Home} />
                <Route path="/users" component={Users} />
                <Route path="/dealers" component={Dealers} />
                <Route path="/denominations" component={Denominations} />
                <Route path="/mailreceiver" component={MailReceivers} />
                <Route path="/activations">
                  <Activations user={currentUser} />
                </Route>
                {/* Reports Routes */}
                <Route path="/checkstatus">
                  <ActivationsReport user={currentUser} />
                </Route>
                <Route path="/test" component={Test} />

                <Route path="/menuaccess" component={MenuAccess} />
                <Route path="/profiles" component={Profiles} />

                <Provider store={store}>
                  <Route path="/pos">
                    <Pos user={currentUser} />
                  </Route>
                </Provider>
              </Switch>
            </main>
            <footer className={classes.footer}>
              <Footer />
            </footer>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
}

export default withStyles(styles)(App);
