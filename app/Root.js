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
} from 'react-native';

import * as firebase from 'firebase'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';
import update from 'react-addons-update';
import moment from 'moment';


import SwipeRowButtons from "./components/swipe_buttons";
import Form from "./form";

var config = {
    apiKey: "AIzaSyBTKPfxmGDQC38vWKsoRYscTqLO7sQve_I",
    authDomain: "react-9762e.firebaseapp.com",
    databaseURL: "https://react-9762e.firebaseio.com",
    storageBucket: "react-9762e.appspot.com",
    messagingSenderId: "998207864178"
   };
const firebaseApp = firebase.initializeApp(config);

export default class Root extends Component {


  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state= {
      dataSource:ds ,
      code:'',
      text:'',
      datas:[],
      modalVisible:false,
      form:{
        name:'',
        key:'',
      }
    }
    this.color=[
      "#f6808a",
      "#fec487",
      "#46e2c0",
      "#ca98ec",
    ];
    this.numbercolor=0;
    this.itemsRef = this.getRef().child('items');

  }

  getRef() {
    return firebaseApp.database().ref();
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {
      var items = [];
      snap.forEach((child) => {
        items.push({key:child.key,...child.val()});
      });
      this.store(items)
    });
  }

  async store(items){
    var data= JSON.stringify(items)
    await AsyncStorage.setItem('@Items:data',data);
    console.log("update");
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(items),
      datas:items
    });

  }

  async getSotore(){
    try {
      var items= await AsyncStorage.getItem("@Items:data")
      items= JSON.parse(items)
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items),
        datas:items
      })
    } catch (e) {

    }
  }

  componentDidMount() {
    this.getSotore()
    this.listenForItems(this.itemsRef);
  }


  save(){
    // this.itemsRef.push({name:'test',done:false,date:'2016-11-11',favorite:false,place:'Home'})
    var {form} = this.state
    if(form.key != ''){
      //is a update
      this.itemsRef.child(form.key).update(form)
      this.modalState(false);
    }else{
      if(form.name!=''){
        this.itemsRef.push({name:this.state.text,color:"#f6808a",fontSize:20,height:75})
        this.setState({form:''});
      }
    }

  }

  edit(data){
    console.log(data);
    this.setState({form:data});
    this.modalState(true);
  }

  favorite(data){
    data.favorite=!data.favorite;
    this.itemsRef.child(data.key).update(data,(e,cb)=>{
      console.log(e);
    })
  }

  done(data){
    data.done=!data.done;
    this.itemsRef.child(data.key).update(data,(e,cb)=>{
      console.log(e);
    })
    console.log(data);
  }

  onChange(field,val){
    this.setState({
      form :update(this.state.form,{$merge:{[field]:val}})
    })
    // this.setState({form:{[field]:val}});
  }

  modalState(state){
    console.log("tnssssssssss");
    this.setState({modalVisible:state});
  }



  /*
  * Renders
  */

  renderModal(state){
    return (
      <Modal
        style={{backgroundColor:"transparent"}}
        position="bottom"
        backdropPressToClose={true}
        isOpen={state}
        onClosed={()=>this.modalState(false)}
        >
        <View style={styles.modalView}>
          <Form vals={this.state.form}
            onChange={this.onChange.bind(this)}
            save={this.save.bind(this)}/>

        </View>

      </Modal>
    )
  }

  list(){
    return(
      <View style={{zIndex:-1}}>
        <SwipeListView
          dataSource={this.state.dataSource}
          renderRow={ data => this._renderRow(data)}
          renderHiddenRow={ (data, secId, rowId, rowMap) =>
            <SwipeRowButtons
              data={data}
              onPressEdit={()=>this.edit(data)}
              onPressCenter={()=>this.favorite(data)}
              onPressDelete={()=> console.log('delte')}
            />
          }
          enableEmptySections={true}
          leftOpenValue={100}
          disableRightSwipe={true}
          rightOpenValue={-170}
          closeOnRowPress={true}
        />
      </View>

    )
  }

  _renderRow(data){
    data.color=this.color[this.numbercolor]
    if(this.numbercolor>=this.color.length)this.numbercolor=0;
    this.numbercolor++;
    var height = (data.favorite==true)?80:50
    var fontSize=(data.favorite==true)?30:14
    var doneIcon = (data.done==true)? 'check-circle':'circle-o'
    var doneColor= (data.done==true)?"#44495b":"#4d556b"
    return (
      <View style={[styles.mainContainer,{height:height,backgroundColor:doneColor}]}>
        <View style={{flex:1,flexDirection:"row"}}>

          <View>
            <TouchableOpacity onPress={()=>this.done(data)} style={styles.checkContainer}>
              <Icon size={20} color={'#686a7b'} name={doneIcon}/>
            </TouchableOpacity>
          </View>

          <View style={styles.detailContainer}>
            <View style={{flex:1,flexDirection:"row",top:8}}>
              <Text style={{color:"#8c8d94"}}>{`At ${data.place}`}</Text>
              <Text style={{color:"#8c8d94"}}> | </Text>
              <Text style={{color:"#8c8d94"}}>{moment(data.date).format('dddd MMMM YYYY  hh:mm')}</Text>
            </View>
              <Text style={{color:"#fff",fontSize:fontSize}}>{data.name}</Text>
          </View>

          <View style={{flex:1,alignItems:"flex-end"}}>
              <View style={{flex:1,backgroundColor:data.color,width:8,justifyContent:"flex-end"}}/>
          </View>

        </View>
      </View>
    )
  }

  loading(){
    return(
      <Icon color={"red"} name={'pencil'}/>
    )
  }

  render() {
    return (
      <View style={{flex:1}}>
        {this.renderModal(this.state.modalVisible)}
        <TouchableOpacity onPress={()=>this.save()}><Text>Add</Text></TouchableOpacity>
        <View>
          {
            (this.state.dataSource.rowIdentities.length==0)?
                this.loading():this.list()
          }
        </View>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    borderWidth:1
  },
  modalView:{
    flex:1,
    backgroundColor:"rgb(53, 53, 65)",
    marginBottom:180,
    marginTop:60,
    marginLeft:20,
    marginRight:20,
    borderRadius:8,
  },
  add:{
    flex:1,
    justifyContent:"center",
    alignItems:'flex-start',
    flexDirection:"row",
    borderWidth:1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  camera: {
  flex: 1
},
rectangleContainer: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent'
},
rectangle: {
  height: 250,
  width: 250,
  borderWidth: 2,
  borderColor: '#00FF00',
  backgroundColor: 'transparent'
},
mainContainer:{
  backgroundColor:"#4d556b",
  flex:1,
  borderBottomWidth:0.5,
  borderColor:"#7a7c88"
},
checkContainer:{
  flex:1,
  backgroundColor:"#44495b",
  width:40,
  justifyContent:"center",
  alignItems:"center"
},
detailContainer:{
  justifyContent:"center",
  alignItems:"flex-start",
  marginLeft:10,
  paddingLeft:10,
  bottom:5
}
});
