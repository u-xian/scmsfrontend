import React, { useState } from "react";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import blue from "@material-ui/core/colors/blue";
import red from "@material-ui/core/colors/red";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import ClearAllIcon from "@material-ui/icons/ClearAll";

import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { useDispatch, useSelector } from "react-redux";
import { cardRemoved, cartCleared } from "../../store/cart";
import activationsMethods from "../../services/activationService";
import carddetailsMethods from "../../services/carddetailService";

const theme = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: blue[600],
    },
    secondary: {
      // This is green.A700 as hex.
      main: red[600],
    },
  },
});

const useStyles = makeStyles((theme) => ({
  tablecell: {
    fontSize: "8pt",
  },
}));
export default function ProductTable(props) {
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

  const dispatch = useDispatch();
  const { dealer, cards } = useSelector((state) => state.entities.cart);
  const [loading, setLoading] = useState(false);

  const total = () => {
    return cards.reduce((result, c) => result + c.price, 0);
  };

  const addData = async () => {
    setLoading(true);
    const activData = {
      dealer_id: dealer[0].id,
      userid: props.userData.userid,
    };
    const { data: response } = await activationsMethods.createActivation(
      activData
    );
    if (response.data.status === 1) {
      let cardsData = {
        batch: 0,
        start_serialnumber: 0,
        end_serialnumber: 0,
        pins: 0,
        cards: 0,
        denom_id: 0,
        act_id: 0,
      };

      cards.forEach(async (c) => {
        cardsData = {
          batch: c.batch,
          start_serialnumber: c.start_serial,
          end_serialnumber: c.end_serial,
          pins: c.pins,
          cards: c.cards,
          denom_id: c.denomID,
          act_id: response.data.activId,
        };
        await carddetailsMethods.createCarddetail(cardsData);
      });
      setLoading(false);
      dispatch(cartCleared());
      props.onClearForm();
      toast.success("Activation created!");
    } else {
      toast.error(response.data.statusMessage);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan="7">
                Dealer :
                {dealer.map((d) => (
                  <span key={d.id}> {d.name}</span>
                ))}
              </TableCell>
              <TableCell>
                <Tooltip title="Clear Cart">
                  <IconButton
                    size="small"
                    aria-label="Clear Cart"
                    onClick={() => dispatch(cartCleared())}
                  >
                    <ClearAllIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tablecell}>Denom </TableCell>
              <TableCell className={classes.tablecell}>Batch</TableCell>
              <TableCell className={classes.tablecell}>Start SN</TableCell>
              <TableCell className={classes.tablecell}>End SN</TableCell>
              <TableCell className={classes.tablecell}>Pins</TableCell>
              <TableCell className={classes.tablecell}>Cards</TableCell>
              <TableCell className={classes.tablecell}>Price</TableCell>
              <TableCell align="center">
                <DeleteIcon />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cards
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((c) => (
                <TableRow key={c.id}>
                  <TableCell className={classes.tablecell}>
                    {c.denomName}
                  </TableCell>
                  <TableCell className={classes.tablecell}>{c.batch}</TableCell>
                  <TableCell className={classes.tablecell}>
                    {c.start_serial}
                  </TableCell>
                  <TableCell className={classes.tablecell}>
                    {c.end_serial}
                  </TableCell>
                  <TableCell className={classes.tablecell}>{c.pins}</TableCell>
                  <TableCell className={classes.tablecell}>{c.cards}</TableCell>
                  <TableCell className={classes.tablecell}>
                    {c.price.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    RWF
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        aria-label="Delete"
                        color="secondary"
                        onClick={() => dispatch(cardRemoved({ cardID: c.id }))}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            <TableRow>
              <TableCell colSpan="7">
                <strong>
                  Total :{" "}
                  {total().toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}{" "}
                  RWF
                </strong>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<SaveIcon />}
                  onClick={() => addData()}
                >
                  Save
                  {loading && <Spinner animation="border" size="sm" />}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={cards.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </ThemeProvider>
  );
}
