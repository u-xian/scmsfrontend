import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Loader from "react-loader-spinner";
import auth from "../../services/authService";

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

export default function ChangePassword(props) {
  const classes = useStyles();
  const [oldpassword, setOldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [counter, setCounter] = useState("");
  const [startTimer, setStartTimer] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Change Password");
  const [styleresponse, setStyleResponse] = useState("font-weight-light h6");

  useEffect(() => {
    if (counter > 0) {
      setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);
    }

    if (counter === 0 && startTimer) {
      setStartTimer(false);
    }
  }, [counter, startTimer]);

  const handleCountDown = () => {
    setCounter(5);
    setStartTimer(true);
  };

  const validateForm = () => {
    return (
      oldpassword.length > 0 &&
      newpassword.length > 0 &&
      confirmpassword.length > 0
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = {
        confirmpassword: confirmpassword,
        resetType: props.userData.resetType,
      };
      if (newpassword.localeCompare(confirmpassword) === 0) {
        const response = await auth.resetPassword(props.userData.userid, data);
        if (response.data.status === 1) {
          setLoading(false);
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setMessage("Success. Wait to be redirected on login page...in  ");
          setStyleResponse("text-success");
          handleCountDown();
          setTimeout(() => {
            auth.logout();
            window.location = "/";
          }, 5000);
        }
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        setLoading(false);
        //toast.error(ex.response.data);
      }
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <div>
          <img src={"/assets/images/logo.png"} alt="" className="loginicon" />
        </div>

        <Typography component="h1" variant="h6">
          <span className={styleresponse}>
            {message} {counter}
          </span>
        </Typography>
        {loading && (
          <Loader
            className="text-center"
            color="#3f51b5"
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
            name="oldpassword"
            label="Old Password"
            type="password"
            id="oldpassword"
            autoComplete="current-password"
            value={oldpassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="newpassword"
            label="New Password"
            type="password"
            id="newpassword"
            value={newpassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmpassword"
            label="Confirm Password"
            type="password"
            id="confirmpassword"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!validateForm()}
          >
            Change Password
          </Button>
        </form>
      </div>
    </Container>
  );
}
