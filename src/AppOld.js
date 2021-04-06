import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Route, Switch } from "react-router-dom";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Authentication
import auth from "./services/authService";
import Login from "./components/authentication/login";
import Logout from "./components/authentication/logout";
import ChangePassword from "./components/forms/changepassword";

//Includes Views
import Header from "./components/includeViews/header";
import Sidebar from "./components/includeViews/sidebar";
import Footer from "./components/includeViews/footer";

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

function App() {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (user) setCurrentUser(user);
  }, []);

  return (
    <React.Fragment>
      {_.isEmpty(currentUser) && <Route exact path="/" component={Login} />}
      {_.isEmpty(currentUser) && (
        <Route path="/changepassword" component={ChangePassword} />
      )}
      {_.isEmpty(currentUser) === false && (
        <div className="container-scroller">
          <Header user={currentUser} />
          <div className="container-fluid page-body-wrapper">
            <Sidebar user={currentUser} />
            <div className="main-panel">
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
              <Footer />
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default App;
