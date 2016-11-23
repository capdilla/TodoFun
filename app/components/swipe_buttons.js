import React from 'react';
import { Text, View, StyleSheet, TouchableHighlight,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

 const SwipeRowButtons =({log,onPressEdit, onPressDelete,onPressCenter, iconColor='#a3a3ab',})=>(
  <View style={[styles.rowBack,{backgroundColor:"#282533"}]}>
        <TouchableOpacity
          onPress={onPressEdit}
          style={[styles.backRightBtn, styles.backRightBtnLeft]}>
            <Icon size={20} color={iconColor} name={'pencil'}/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressCenter}
          style={[styles.backRightBtn, styles.backBtnCenter]}>
            <Icon size={20} color={iconColor} name={'star-o'}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={onPressDelete}>
            <Icon size={20} color={iconColor} name={'trash-o'}/>
        </TouchableOpacity>
    </View>
);


const styles = StyleSheet.create({
  rowBack: {
		alignItems: 'center',
		backgroundColor: 'black',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 15,
	},
  rowFront: {
		alignItems: 'center',
		backgroundColor: '#A9BCD0',
		borderBottomColor: '#fff',
		borderBottomWidth: 1,
		justifyContent: 'center',
		height: 50,
	},
	backRightBtn: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		width: 75
	},
	backRightBtnLeft: {
		backgroundColor: 'transparent',
    //borderWidth:1,
    borderColor:'#fff',
		right: 100
	},
  backBtnCenter:{
    backgroundColor: 'transparent',
    //borderWidth:1,
    borderColor:'#fff',
		right: 50
  },
	backRightBtnRight: {
		backgroundColor: 'transparent',
    // borderWidth:1,
    borderColor:'#fff',
		right: 0
	},
})

export default SwipeRowButtons
