import React from 'react';
import { connect } from 'react-redux';
import { setLoginError } from '../../actions';
import PropTypes from 'prop-types';
import loginSubmit from '../utils/loginHelpers';

const LoginContainer = ({ setError, status, responseText }) => {
  const nameInputRef = React.createRef();
  const passwordInputRef = React.createRef();
  return (
    <>
      <h1>Login form</h1>
      <p>Please log in to continue</p>
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
        {status ? (
          <p className="text-danger">
            Error:{status} {responseText}
          </p>
        ) : null}
        <div className="form-group">
          <label htmlFor="name">user name</label>
          <input
            className="form-control"
            id="name"
            name="name"
            type="text"
            placeholder="user name"
            minLength="2"
            ref={nameInputRef}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">password</label>
          <input
            className="form-control"
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
    </>
  );
};

LoginContainer.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
