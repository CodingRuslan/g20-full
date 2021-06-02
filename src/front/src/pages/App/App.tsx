import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import Trade from '../TradePage/Trade';
import Countries from '../Countries/Albom';
import AdminPanel from '../AdminPanel/AdminPanel';
import { compose } from 'redux';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import {clearMessage, clearSuccessMessage} from '../../actions/game';
import './App.scss';
import Header from '../../components/Header/Header';

const App = ({ loading, error, clearMessage, success, clearSuccessMessage }) => {
  return (
    <Fragment>
      <div className="error">
        <Collapse in={!!error}>
          <Alert
          severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  clearMessage();
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        </Collapse>
        <Collapse in={!!success}>
          <Alert
          severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  clearSuccessMessage();
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {success}
          </Alert>
        </Collapse>
      </div>
      <Header />
      {loading && <div className="loading-screen">
        <CircularProgress className="loading-circle" />
      </div>}
      <Switch>
              <Route
                exact
                path="/"
                render={() => <Trade />}
              />
              <Route
                exact
                path="/countries"
                render={() => <Countries />}
              />
              <Route
                exact
                path="/admin"
                render={() => <AdminPanel />}
              />
      </Switch>
    </Fragment>
  );
}

const mapToStateToProps = ({ game }) => ({
  loading: game.loading,
  error: game.error,
  success: game.success
});

export default compose(
  connect(mapToStateToProps, {
    clearMessage,
    clearSuccessMessage
  }))(App);
