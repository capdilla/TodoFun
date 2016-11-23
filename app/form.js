import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ListView,
  Platform,
  Alert,
  AsyncStorage,
  Modal
} from 'react-native';

import { FormLabel,FormInput,Button } from 'react-native-elements'
// vals.key.split("-").pop()
const Form =({vals,onChange,save})=>(
  <View>
    <FormLabel>Create a new Task</FormLabel>
    <FormInput value={vals.name} onChangeText={(text)=>{ onChange("name",text) }}/>
    <Button
    small
    onPress={()=>save()}
    icon={{name: 'check', type: 'octicon' }}
    title='OCTICON' />
  </View>
)
export default Form
