import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mount, shallow, render } from 'enzyme';
Enzyme.configure({ adapter: new Adapter() });
import { WeightLogger } from './WeightLogger';

describe('WeightLogger component', () => {
  const WEIGHTLOGGER = shallow(<WeightLogger />);
  test('renders the parent div with the right id', () => {
    expect(WEIGHTLOGGER.find('#weight-logger')).toHaveLength(1);
  });
  test('renders the form', () => {
    expect(WEIGHTLOGGER.find('form')).toHaveLength(1);
  });
  // test('input box calls the right function when its value changes', () => {
  //   // testing function calls means we use jest.fn to simulate a response (a spy function)
  //   // use toHaveBeenCalled or toHaveBeenCalledWith, also from Jest, to see if the spy was called or not
  //   // also possibilities include simulate() from Enzyme and mockReturnValue from Jest
  //   // if the called function depends on values from the event object, make a mock event object
  //   const onChangeSpy = jest.fn();
  //   const onChange = onChangeSpy;
  //   expect(onChangeSpy).not.toHaveBeenCalled();
  //   let input = WEIGHTLOGGER.find('input');
  //   const eventObj = { target: { value: 143 } };
  //   input.simulate('change', eventObj);
  //   expect(onChangeSpy).toHaveBeenCalled();
  // });
  test('LOG WEIGHT button calls the appropriate function when clicked', () => {
    const onClickSpy = jest.fn();
    const onClick = onClickSpy;
    expect(onClickSpy).not.toHaveBeenCalled();
    //let button = WEIGHTLOGGER.find('button').at(0);
    //expect(button.text()).toEqual('LOG WEIGHT')
    WEIGHTLOGGER.instance().logWeight();
    expect(onClickSpy).toHaveBeenCalled();
  });
})
