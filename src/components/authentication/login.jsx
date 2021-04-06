import React, { useState } from "react";
import Loader from "react-loader-spinner";

import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import blue from "@material-ui/core/colors/blue";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

import auth from "../../services/authService";
import ChangePassword from "../forms/changepassword";

const theme = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: blue[600],
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#11cb5f",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authresponse, setAuthResponse] = useState({
    statusMessage: "Sign in to continue.",
  });
  const [styleresponse, setStyleResponse] = useState("font-weight-light");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

  const [userdata, setUserData] = useState({});

  const toggleForms = () => {
    setShowChangePasswordForm(true);
    setShowLoginForm(false);
  };

  const validateForm = () => {
    return username.length > 0 && password.length > 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await auth.login(username, password);
      /* 
        status : 0 --> Invalid username or password
        status : 1 --> Login successful
        status : 2 --> First Login
        status : 3 --> Password expired 
      */
      if (response.status === 0) {
        setLoading(false);
        setUsername("");
        setPassword("");
        setStyleResponse("text-danger");
        setAuthResponse(response);
      }
      if (response.status === 1) {
        setLoading(false);
        setUsername("");
        setPassword("");
        const user = auth.getCurrentUser();
        window.location = "/" + user.userdefaultmenu.pathname;
      }
      if (response.status === 2) {
        setLoading(false);
        setUsername("");
        setPassword("");
        setUserData({ userid: response.userId, resetType: response.status });
        toggleForms();
      }
      if (response.status === 3) {
        setLoading(false);
        setUsername("");
        setPassword("");
        setShow(true);
        setStyleResponse("text-danger");
        setAuthResponse(response);
        setUserData({ userid: response.userId, resetType: response.status });
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        setLoading(false);
        setUsername("");
        setPassword("");
      }
    }
  };

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        {showLoginForm && (
          <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
              <div>
                <img
                  src={"/assets/images/logo.png"}
                  alt=""
                  className="loginicon"
                />
              </div>

              <Typography component="h1" variant="h6">
                <span className={styleresponse}>
                  {authresponse.statusMessage}
                </span>
                {show && (
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleForms()}
                  >
                    Change Password
                  </span>
                )}
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
              <form className={classes.form} noValidate onSubmit={handleSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="Username"
                  label="Username"
                  name="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={!validateForm()}
                >
                  Sign In
                </Button>
              </form>
            </div>
          </Container>
        )}
        {showChangePasswordForm && <ChangePassword userData={userdata} />}
      </ThemeProvider>
    </React.Fragment>
  );
}
