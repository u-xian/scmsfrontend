import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";

const styles = (theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 2,
    paddingBottom: 2,
    color: "rgba(255, 255, 255, 0.7)",
    "&:hover,&:focus": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
  },
  itemCategory: {
    backgroundColor: "#232f3e",
    boxShadow: "0 -1px 0 #404854 inset",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  itemActiveItem: {
    color: "#4fc3f7",
  },
  itemPrimary: {
    fontSize: "inherit",
  },
  itemIcon: {
    minWidth: "auto",
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
});

function Navigator(props) {
  const { classes, user, ...other } = props;

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem className={clsx(classes.item, classes.itemCategory)}>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            SCMS
          </ListItemText>
        </ListItem>
        <ListItem className={classes.categoryHeader}>
          <ListItemText
            classes={{
              primary: classes.categoryHeaderPrimary,
            }}
          >
            Main Features
          </ListItemText>
        </ListItem>
        {user.usermenus.map((m) => (
          <ListItem
            key={m.id}
            button
            className={clsx(classes.item)}
            component={Link}
            to={m.pathname}
          >
            <ListItemIcon className={classes.itemIcon}>
              <Icon>{m.menuicon}</Icon>
            </ListItemIcon>
            <ListItemText
              classes={{
                primary: classes.itemPrimary,
              }}
            >
              {m.description}
            </ListItemText>
          </ListItem>
        ))}
        <Divider className={classes.divider} />
        <ListItem className={classes.categoryHeader}>
          <ListItemText
            classes={{
              primary: classes.categoryHeaderPrimary,
            }}
          >
            Reports
          </ListItemText>
        </ListItem>
        <ListItem
          button
          className={clsx(classes.item)}
          component={Link}
          to={"/test"}
        >
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            Test
          </ListItemText>
        </ListItem>
      </List>
    </Drawer>
  );
}

export default withStyles(styles)(Navigator);
