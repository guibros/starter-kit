import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroText,
  ViroTrackingReason,
  ViroTrackingStateConstants,
  ViroAmbientLight,
  Viro3DObject
} from "@viro-community/react-viro";
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS } from 'react-native-permissions';
import React, { useEffect, useState } from "react";
import { StyleSheet, Platform, PermissionsAndroid } from "react-native";

const HelloWorldSceneAR = () => {
  const [text, setText] = useState("Initializing AR...");
  const [locationText, setLocationText] = useState('Fetching location...');


  function onInitialized(state: any, reason: ViroTrackingReason) {
    console.log("onInitialized", state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setText("Hello Worldfcxdxdxd!");
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      // Handle loss of tracking
    }
  }

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        let granted;
        if (Platform.OS === 'android') {
          granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Permission",
              message: "We need your location to provide better services.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
        } else {
          granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        }

        if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === 'granted') {
          Geolocation.getCurrentPosition(
            (position) => {
              console.log("Position:", position);
              setLocationText(`Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}, Accuracy: ${position.coords.accuracy} meters`);
            },
            (error) => {
              console.error("Geolocation Error:", error);
              setLocationText('Failed to fetch location');
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
          );
        } else {
          console.error("Permission Denied");
          setLocationText('Permission denied');
        }
      } catch (err) {
        console.error("Permission Error:", err);
        setLocationText('Failed to fetch location');
      }
    };

    requestLocationPermission();
  }, []);

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroAmbientLight color="#ffffff"/>
      <Viro3DObject
        source={require('./assets/skull/12140_Skull_v3_L2.obj')}
        scale={[0.2, 0.2, 0.2]}
        position={[0, 0, -30]}
        rotation={[-45,50,40]}
        type="OBJ"
        />
      <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0.4, -10]}
        style={styles.helloWorldTextStyle}
      />
         <ViroText
        text={locationText}
        scale={[0.5, 0.5, 0.5]}
        position={[0, -0.4, -1]}
        style={styles.helloWorldTextStyle}
      />
    </ViroARScene>
  );
};

export default () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: HelloWorldSceneAR,
      }}
      style={styles.f1}
    />
  );
};

var styles = StyleSheet.create({
  f1: { flex: 1 },
  helloWorldTextStyle: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});
