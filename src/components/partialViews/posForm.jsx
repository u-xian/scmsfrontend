import React, { useState, useEffect } from "react";
import ProductTable from "./posTable";
import { useInput } from "../../utils/input-hook";
import Loader from "react-loader-spinner";

import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import blue from "@material-ui/core/colors/blue";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import Chip from "@material-ui/core/Chip";

import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import AddToQueueIcon from "@material-ui/icons/AddToQueue";

import { useDispatch } from "react-redux";
import { dealerAdded, cardsAdded } from "../../store/cart";
import dealerMethods from "../../services/dealerService";
import denominationMethods from "../../services/denominationService";

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
  saveButton: {
    float: "right",
    margin: theme.spacing(3, 0, 2),
  },
}));

const ProductFormList = ({ user }) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [dealers, setDealers] = useState([]);
  const [denominations, setDenominations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dealerID, setdealerID] = useState(0);
  const [denomID, setdenomID] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const { data: responseDealers } = await dealerMethods.getDealers();
      const {
        data: responseDenominations,
      } = await denominationMethods.getDenominations();
      if (responseDealers && responseDenominations) {
        setLoading(false);
        setDealers(responseDealers.data);
        setDenominations(responseDenominations.data);
      }
    }
    fetchData();
  }, []);

  const { value: s1, bind: bindS1, reset: resetS1 } = useInput("");
  const { value: s2, bind: bindS2, reset: resetS2 } = useInput("");

  const { value: s3, bind: bindS3, reset: resetS3 } = useInput("");
  const { value: s4, bind: bindS4, reset: resetS4 } = useInput("");

  const { value: s5, bind: bindS5, reset: resetS5 } = useInput("");
  const { value: s6, bind: bindS6, reset: resetS6 } = useInput("");

  const { value: s7, bind: bindS7, reset: resetS7 } = useInput("");
  const { value: s8, bind: bindS8, reset: resetS8 } = useInput("");

  const { value: s9, bind: bindS9, reset: resetS9 } = useInput("");
  const { value: s10, bind: bindS10, reset: resetS10 } = useInput("");

  const calculatePins = () => {
    let pin1 =
      s1.length === 12 && s2.length === 12 ? Number(s2) - Number(s1) + 1 : 0;
    let pin2 =
      s3.length === 12 && s4.length === 12 ? Number(s4) - Number(s3) + 1 : 0;
    let pin3 =
      s5.length === 12 && s6.length === 12 ? Number(s6) - Number(s5) + 1 : 0;
    let pin4 =
      s7.length === 12 && s8.length === 12 ? Number(s8) - Number(s7) + 1 : 0;
    let pin5 =
      s9.length === 12 && s10.length === 12 ? Number(s10) - Number(s9) + 1 : 0;

    return pin1 + pin2 + pin3 + pin4 + pin5;
  };

  const calculateCards = () => {
    if (denomID > 0) {
      const dn = denominations.find((d) => d.id === Number(denomID));
      return calculatePins() / dn.pinspercard;
    } else {
      return 0;
    }
  };

  const handleDealer = (e) => {
    setdealerID(e.target.value);
    const dealerID = e.target.value;
    if (Number(dealerID) > 0) {
      const dl = dealers.find((d) => d.id === Number(dealerID));
      dispatch(
        dealerAdded({
          dealerItem: {
            id: dl.id,
            name: dl.dealername,
          },
        })
      );
    }
  };

  const addItems = (startSerial, endSerial) => {
    const dn = denominations.find((d) => d.id === Number(denomID));
    const batchno = startSerial.substr(0, 6);
    const startsn = startSerial.substr(6, 12);
    const endsn = endSerial.substr(6, 12);
    const calcPin = Number(endsn) - Number(startsn) + 1;
    const calcCards = calcPin / dn.pinspercard;

    dispatch(
      cardsAdded({
        cardsItems: {
          denomID: Number(denomID),
          denomName: dn.label,
          batch: batchno,
          start_serial: startsn,
          end_serial: endsn,
          pins: calcPin,
          cards: calcCards,
          price: calcPin * dn.pinsvalue,
        },
      })
    );
  };

  const clearForm = () => {
    setdenomID(0);
    setdealerID(0);
  };
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (s1.length === 12 && s2.length === 12) {
      addItems(s1, s2);
      resetS1();
      resetS2();
    }

    if (s3.length === 12 && s4.length === 12) {
      addItems(s3, s4);
      resetS3();
      resetS4();
    }

    if (s5.length === 12 && s6.length === 12) {
      addItems(s5, s6);
      resetS5();
      resetS6();
    }

    if (s7.length === 12 && s8.length === 12) {
      addItems(s7, s8);
      resetS7();
      resetS8();
    }

    if (s9.length === 12 && s10.length === 12) {
      addItems(s9, s10);
      resetS9();
      resetS10();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container direction="row" alignItems="center">
        <Grid item>
          <AddShoppingCartIcon className="mr-2" color="primary" />
        </Grid>
        <Grid item>
          <Typography variant="h6" component="h6">
            Point of Sale
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <form onSubmit={handleSubmit}>
            <Grid container>
              <Grid container item xs={12} alignItems="center" spacing={1}>
                <Grid item md={6}>
                  <Select
                    native
                    name="dealer"
                    onChange={handleDealer}
                    value={dealerID}
                  >
                    <option value="0">Dealer</option>
                    {dealers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.dealername}
                      </option>
                    ))}
                  </Select>
                </Grid>
                <Grid item md={6}>
                  <Select
                    native
                    fullWidth
                    name="denomination"
                    onChange={(e) => setdenomID(e.target.value)}
                    value={denomID}
                  >
                    <option value="0">Denomination</option>
                    <option value="0">Select</option>
                    {denominations.map((denom) => (
                      <option key={denom.id} value={denom.id}>
                        {denom.label}
                      </option>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Grid>
            <hr />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth placeholder="Serial No " {...bindS1} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth placeholder="Serial No " {...bindS2} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth placeholder="Serial No " {...bindS3} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth placeholder="Serial No " {...bindS4} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth placeholder="Serial No " {...bindS5} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth placeholder="Serial No " {...bindS6} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth placeholder="Serial No " {...bindS7} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth placeholder="Serial No " {...bindS8} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth placeholder="Serial No " {...bindS9} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth placeholder="Serial No " {...bindS10} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Chip
                  label={
                    <React.Fragment>
                      <span>Total Pins </span>
                      <span style={{ fontWeight: "bold" }}>
                        {calculatePins().toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </React.Fragment>
                  }
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Chip
                  label={
                    <React.Fragment>
                      <span>Total Cards </span>
                      <span style={{ fontWeight: "bold" }}>
                        {calculateCards().toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </React.Fragment>
                  }
                  color="primary"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.saveButton}
              endIcon={<AddToQueueIcon />}
            >
              Add
            </Button>
          </form>
        </Grid>
        <Grid item xs={8}>
          <ProductTable onClearForm={clearForm} userData={user} />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default ProductFormList;
