import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import loginStore from '../../reducers/loginStore';
import { createStore } from 'redux';
import LoginContainer from '../LoginContainer/LoginContainer';

const store = createStore(loginStore);

render(
  <Provider store={store}>
    <LoginContainer />
  </Provider>,
  document.getElementById('root')
);
