
import React, { Component } from 'react';
import {AppRegistry} from 'react-native';

import Root from "./app/Root";

export default class TodoFun extends Component {

  render() {
    return (<Root/>)
  }

}

AppRegistry.registerComponent('TodoFun', () => TodoFun);
