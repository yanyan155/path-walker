import React from 'react';
const $ = require('jquery');
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import loginStore from '../reducers/loginStore';
import { setLoginError } from '../actions';
const redux = require('redux');
import PropTypes from 'prop-types';

const store = redux.createStore(loginStore);

async function loginSubmit(event, setError) {
  event.preventDefault();
  const data = {
    name: $('#name').val(),
    password: $('#password').val(),
  };

  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  });

  if (response.status === 200) {
    window.location.href = '/';
  } else {
    setError(response.status, response.responseText);
  }
}

const Login = ({ setError, status, responseText }) => {
  return (
    <form
      onSubmit={event => {
        loginSubmit(event, setError);
      }}
      action="/login"
      method="post"
    >
      <p className="text-danger">
        {status} {responseText}
      </p>
      <div className="form-group">
        <label htmlFor="name">name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="name"
          minLength="2"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="password"
          minLength="2"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

Login.propTypes = {
  setError: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  responseText: PropTypes.string.isRequired,
};

const mapStateToProps = ({ status, responseText }) => ({
  status,
  responseText,
});

const mapDispatchToProps = dispatch => ({
  setError: (status, responseText) =>
    dispatch(setLoginError(status, responseText)),
});

const LoginEl = connect(mapStateToProps, mapDispatchToProps)(Login);

render(
  <Provider store={store}>
    <LoginEl />
  </Provider>,
  document.getElementById('root')
);
