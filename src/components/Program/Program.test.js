// THIS TEST TESTS THE COMPONENT WITHOUT REDUX STORE
// MY current approach because it is easier and doesn't use a library in a way it was not intended to be used.

import React from 'react';
// Jest comes with test assertsions like toBe() and .toEqual() as well as Snapshot tests
// In Jest we use the expect function to set the element that we want to analyze, and we can use many functions like toHaveLength, toEqual, toMatchObject, among others to assert what we expect.
// .find() is Enzyme and can be used for CSS classes and ids, component constructors, component display names, and object property selectors. IT RETURNS AN ARRAY

import { mount, shallow, render } from 'enzyme';
// mounting => full DOM rendering including child components. If you are wanting to test interacting with a child component then the mount method can be used. Mount actually executes the html, css and js code like a browser would, but does so in a simulated way. It is “headless” for example, meaning it doesn’t render or paint anything to a UI, but acts as a simulated web browser and executes the code in the background.
// shallow => renders only the component, no children --- good for unit testing, has access to lifecycle methods by default but cannot access props passed into the root component.
// render => renders to static HTML, including kids but does not have access to lifecycle methods and is less costly than mount

// Mount/render is typically used for integration testing and shallow is used for unit testing.

// Enzyme is a testing library that requires an adapter
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// don't forget to configure the adapter with the import
Enzyme.configure({ adapter: new Adapter() });

// then, just import the UNCONNECTED component (not the default export)
import { Program } from './Program';
import WeightLogger from './WeightLogger/WeightLogger';
import Content from '../Content/Content';
// test suite
describe('Program Component', () => {
  const PROGRAM = shallow(<Program />);
  // a test block
  test('renders the <Content/> component', () => {
    const CONTENT = PROGRAM.find(Content);
    expect(CONTENT).toHaveLength(1);
  });
  // another test block
  test('displays a greeting', () => {
    expect(PROGRAM.find('h1').text()).toEqual('Hello, ');
  });
  test('renders the <WeightLogger/> component', () => {
    const WEIGHTLOGGER = PROGRAM.find(WeightLogger);
    expect(WEIGHTLOGGER).toHaveLength(1);
  });
  test('renders the <div/> holding <RecentWeightLogs/>, <LineGraph/>, and <AccountSettings/>', () => {
    const ACCOUNTOPTIONS = PROGRAM.find("#account-options");
    expect(ACCOUNTOPTIONS).toHaveLength(1);
  });
  test('<div/> holding <RecentWeightLogs/>, <LineGraph/>, and <AccountSettings/> renders each of those said components', () => {
    const ACCOUNTOPTIONS = PROGRAM.find("#account-options");
    expect(ACCOUNTOPTIONS.children()).toHaveLength(3);
  });
});
