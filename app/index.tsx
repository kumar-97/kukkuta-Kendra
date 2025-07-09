import {Text, View} from "react-native"
import React from "react"
import AppNavigation from "./navigation/Navigation"
import WelcomeScreen from "./screens/WelcomeScreen"
const Index = () =>{
  return (
    <View style={{flex:1}}>
      {/* <view style={{flex:1,backgroundColor:"red"}}>abc </view>
      <view style={{flex:2,backgroundColor:"blue"}}>abc</view>
      <view style={{flex:1,backgroundColor:"green"}}>abc</view> */}
      {/* <Text>Hello first work </Text> */}
      <WelcomeScreen/>
    </View>
    
  )
}


export default Index