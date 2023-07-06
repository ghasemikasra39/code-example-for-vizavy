import React from 'react';
import checkPropTypes from 'check-prop-types';
import { shallow } from 'enzyme';
import { reducersCombined, defaultMiddleware } from '../src/store/index';
import { configureStore } from '@reduxjs/toolkit';
import { rootEpic } from '../src/store/Epics';
import { createEpicMiddleware } from 'redux-observable';

/**
 * Factory function to create a ShallowWrapper for the app component
 * @function setup
 * @param {JSX.Element} component - the component as the wrapper
 * @param {object} props - Component props specific to this setup
 * @param {object} state - Initial state for setup
 * @returns {ShallowWrapper}
 */
export const setup = (component, props = {}, state = null) => {
  const wrapper = shallow(component);
  if (state) {
    wrapper.setState(state);
  }
  return wrapper;
};

/**
 * Create a testing store with imported reducers, middleware, and initial state
 * globals: rootReducer
 * @function storeFactory
 * @param {object} initialState - Initial state for the store
 * @returns {store} - Redux store
 */
export const storeFactory = initialState => {
  const epicMiddleware = createEpicMiddleware();
  let store = configureStore({
    preloadedState: initialState,
    reducer: reducersCombined,
    middleware: [...defaultMiddleware, epicMiddleware],
  });

  epicMiddleware.run(rootEpic);

  return store;
};

/**
 * Return node(s) with the given data-test attribute.
 * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper.
 * @param {string} val - Value of data-test attribute for search.
 * @returns {ShallowWrapper}
 */
export const findByTestAttr = (wrapper, val) => {
  return wrapper.find(`[data-test="${val}"]`);
};

/**
 * Throw error if conformingProps do not pass propTypes validation.
 * @param {React.Component} component - Component to check props against.
 * @param {object} conformingProps - Props we expect to conform to defined propTypes.
 */
export const checkProps = (component, conformingProps) => {
  const propError = checkPropTypes(
    component.propTypes,
    conformingProps,
    'prop',
    component.name,
  );
  expect(propError).toBeUndefined();
};
