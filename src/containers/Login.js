import React from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import loginStore from '../reducers/loginStore';
import { setLoginError } from '../actions';
const redux = require('redux');
import PropTypes from 'prop-types';

const store = redux.createStore(loginStore);

async function loginSubmit(event, setError, name, password) {
  event.preventDefault();
  const data = {
    name,
    password,
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
  const nameInputRef = React.createRef();
  const passwordInputRef = React.createRef();
  return (
    <form
      onSubmit={event => {
        loginSubmit(
          event,
          setError,
          nameInputRef.current.value,
          passwordInputRef.current.value
        );
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
          ref={nameInputRef}
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
          ref={passwordInputRef}
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
