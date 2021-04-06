import React from "react";
import { Link } from "react-router-dom";

import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import AssessmentIcon from "@material-ui/icons/Assessment";
import ShopIcon from "@material-ui/icons/Shop";
import Icon from "@material-ui/core/Icon";

const useStyles = makeStyles((theme) => ({
  menuIcon: {
    fontSize: "1.125rem",
    lineHeight: 1,
    marginLeft: "auto",
    color: "#bba8bff5",
    float: "right",
  },
}));

export default function Sidebar({ user }) {
  const classes = useStyles();

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      {user.first_login_flag === false && (
        <ul className="nav">
          {user.usermenus.map((m) => (
            <li className="nav-item" key={m.id}>
              <Link className="nav-link" to={m.pathname}>
                <span className="menu-title">{m.description}</span>
                <AssessmentIcon className={classes.menuIcon} />
              </Link>
            </li>
          ))}
          <li className="nav-item">
            <Link className="nav-link" to="/test">
              <span className="menu-title">Testing</span>
            </Link>
          </li>

          <li className="nav-item sidebar-actions">
            <span className="nav-link">
              <div className="mt-4">
                <div className="border-bottom">
                  <p className="font-weight-normal mb-3">Reports</p>
                </div>
                <ul className="gradient-bullet-list mt-4">
                  <li>
                    <Link to={"/test"}>Test</Link>
                  </li>
                </ul>
              </div>
            </span>
          </li>
        </ul>
      )}
    </nav>
  );
}
