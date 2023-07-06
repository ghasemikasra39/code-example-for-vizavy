import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Dimensions, Animated, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import Globals from '../component-library/Globals';
import Button from '../component-library/Button';
import {
  locationFound,
  paperplane,
  locationIconAnimation,
} from '../component-library/graphics/Images';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import FadeIn from '../Animated Hooks/FadeIn';
import { useNavigation, useRoute } from '@react-navigation/native';

//This defines the style of the map: customize the map on: https://mapstyle.withgoogle.com
const mapStyle = [
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#f1004e',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#ffffff',
      },
      {
        lightness: 5,
      },
      {
        weight: 8,
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#767676',
      },
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#e2e2e3',
      },
    ],
  },
  {
    featureType: 'landscape.natural.terrain',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#cfcfcf',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ff7a90',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#3d3a3a',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ff9baf',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#ff9baf',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.icon',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#3d3a3a',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ff9baf',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#f6f7fb',
      },
    ],
  },
];


export default function SendOutPaperPlaneScreen() {
  const mapView = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const paperPlaneLanded = useRef(null);
  const paperPlaneLocationIcon = useRef(null);
  const paperPlaneAnimation = useRef(new Animated.Value(0)).current;
  const paperPlaneLandedAnimation = useRef(new Animated.Value(0)).current;
  const paperPlaneLandedOpacity = useRef(new Animated.Value(1)).current;
  const [mapLoaded, setMapLoaded] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [currentUserLocation, setCurrentUserLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  useEffect(() => {
    const destinationLocation = route?.params?.deliveryLocation;
    const actualLocation = route?.params?.currentUserLocation;
    setCurrentUserLocation(actualLocation);
    setDeliveryLocation(destinationLocation);
  }, [route]);

  useEffect(() => {
    if (mapLoaded && deliveryLocation?.locationCoordinates?.latitude) {
      animateCamera();
      animatePaperPlane();
      calculatePaperPlaneRotation();
    }
  }, [mapLoaded, deliveryLocation, currentUserLocation]);

  /**
   * This method is called when the MapView has finished loading
   * @method mapIsReady
   **/
  function mapIsReady() {
    setMapLoaded(true);
  }

  /**
   * Animates the movement of the paper plane when the destination location is found
   * @method animatePaperPlane
   * @param {Animated} paperPlaneAnimation - The animation to be used to move the paper plane up and down
   * @param {Animated} paperPlaneLandedOpacity - The animation to be used to let the paper plane dissappear
   **/
  function animatePaperPlane() {
    setTimeout(
      () =>
        //This animates the paper plane to move up
        Animated.timing(paperPlaneAnimation, {
          toValue: -150,
          duration: 800,
          useNativeDriver: true,
        }).start(() =>
          //This animates the paper plane to move down
          Animated.parallel([
            Animated.timing(paperPlaneAnimation, {
              toValue: 0,
              duration: 1200,
              useNativeDriver: true,
            }),
            //This decreases the paper planes opacity while flying
            Animated.timing(paperPlaneLandedOpacity, {
              toValue: 0,
              duration: 1600,
              useNativeDriver: true,
            }),
          ]).start(() =>
            //This displays the location Icon jumping up and down
            Animated.timing(paperPlaneLandedAnimation, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }).start(),
          ),
        ),
      2000,
    );
  }

  /**
   * This method animates the camera to the the destination location when the destination location is found
   * @method animateCamera
   **/
  function animateCamera() {
    const cameraObject = {
      center: {
        latitude: deliveryLocation?.locationCoordinates?.latitude,
        longitude: deliveryLocation?.locationCoordinates?.longitude,
      },
      pitch: 10,
      heading: 10,
      altitude: 100,
      zoom: 4.7,
    };
    //Set a timeout of 2 seconds when Map has finished loading
    setTimeout(
      () => mapView.current?.animateCamera(cameraObject, { duration: 2000 }),
      2000,
    );
  }

  /**
   * This method lets the paper plane always point into the direction of the destination location
   * @method calculatePaperPlaneRotation
   * @param {any} deliveryLocation - Inserts the destinationLocation object
   **/
  function calculatePaperPlaneRotation() {
    //Set coordinates of current location and destination location
    const currentLocationCoordinate = {
      x1: currentUserLocation.locationCoordinates.latitude,
      y1: currentUserLocation.locationCoordinates.longitude,
    };
    const destinationLocationCoordinate = {
      x2: deliveryLocation.locationCoordinates.latitude,
      y2: deliveryLocation.locationCoordinates.longitude,
    };

    //Calculate the degree from currentLocation and destination coordinates
    //Convert them from radians into degrees
    const angleDegrees =
      Math.atan2(
        destinationLocationCoordinate.y2 - currentLocationCoordinate.y1,
        destinationLocationCoordinate.x2 - currentLocationCoordinate.x1,
      ) *
      (180 / Math.PI);
    //Calculate bearing as this will point the paper plane into the destination direction
    const baring = (angleDegrees + 360) % 360;
    setRotationDegree(baring);
  }

  function reset() {
    setRotationDegree(0);
    navigation.navigate('PaperPlane', {});
  }

  return (
    <FadeIn duration={100} style={styles.modalContentContainer}>
      {renderMapView()}
      <Animated.View
        style={{
          ...styles.doneButton,
          opacity: paperPlaneLandedAnimation,
        }}>
        <Button
          onPress={reset}
          primary
          title={'Continue'}
          hapticFeedback={true}
        />
      </Animated.View>
    </FadeIn>
  );

  /**
   * Renders the map
   * @method renderMapView
   * @param {any} currentLocation - Displays the current location of the user
   * @param {any} deliveryLocation - Displays the destination location of the receiving user
   * @param {number} rotationDegree - Rotates the paper plane based on the rotationDegree
   **/
  function renderMapView() {
    const currentLocationCameraObject = {
      center: currentUserLocation,
      pitch: 10,
      heading: 10,
      altitude: 100,
      zoom: 3,
    };
    return (
      currentUserLocation && (
        <MapView
          ref={mapView}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          onMapReady={() => mapIsReady()}
          style={styles.map}
          customMapStyle={mapStyle}
          showsBuildings={true}
          zoomEnabled={true}
          mapType={'standard'}
          minZoomLevel={0}
          maxZoomLevel={20}
          camera={currentLocationCameraObject}
          loadingEnabled={true}
          scrollEnabled={false}>
          {deliveryLocation?.locationCoordinates?.latitude && renderMarker()}
          {deliveryLocation?.locationCoordinates?.latitude && renderPolyLine()}
        </MapView>
      )
    );
  }

  /**
   * Renders the marker on the map
   * @method renderMarker
   * @param {any} deliveryLocation - Displays the marker on the destination location of the receiving user
   **/

  function renderMarker() {
    return (
      <Marker coordinate={deliveryLocation?.locationCoordinates}>
        <Animated.View
          style={{
            ...styles.markerContainer,
            opacity: paperPlaneLandedAnimation,
          }}>
          <View style={styles.bubble}>
            <Text style={styles.functionalText}>
              Your paper plane's journey started in
            </Text>
            {deliveryLocation?.locationName && (
              <Text style={styles.deliveryLocationText}>
                {deliveryLocation?.locationName}
              </Text>
            )}
          </View>
          <View style={styles.arrowBorder} />
          <View style={styles.arrow} />
        </Animated.View>
      </Marker>
    );
  }

  /**
   * Animates the paper plane into the direction of the destination location
   * @method renderPolyLine
   **/

  function renderPolyLine() {
    return (
      <Polyline
        coordinates={[
          currentUserLocation,
          deliveryLocation?.locationCoordinates,
        ]}
        strokeColors={[
          '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
        ]}>
        <Animated.View
          style={{
            ...styles.paperPlaneContainer,
            transform: [{ translateY: paperPlaneAnimation }],
          }}>
          <Animated.View
            style={{
              ...styles.paperPlaneLandedContainer,
              opacity: paperPlaneLandedAnimation,
            }}>
            <LottieView
              ref={paperPlaneLanded}
              source={locationFound}
              style={styles.paperPlaneLanded}
              speed={0.7}
              autoPlay
              loop
            />
            <LottieView
              ref={paperPlaneLocationIcon}
              source={locationIconAnimation}
              style={styles.paperPlaneLocationIcon}
              speed={0.7}
              autoPlay
              loop
            />
          </Animated.View>
          <FadeIn duration={500}>
            <Animated.Image
              source={paperplane}
              style={{
                ...styles.paperPlaneIcon,
                transform: [{ rotate: rotationDegree.toString() + 'deg' }],
                opacity: paperPlaneLandedOpacity,
              }}
            />
          </FadeIn>
        </Animated.View>
      </Polyline>
    );
  }
}
const screenRatio = (width) => Dimensions.get('window').width / width;
const styles = StyleSheet.create({
  modalContentContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    backgroundColor: Globals.color.background.lightgrey,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7B500',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  imageBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('screen').width,
    height: 599 / screenRatio(398),
    position: 'absolute',
    bottom: 0,
  },
  animatedPaperPlane: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('screen').width,
    height: 182 / screenRatio(124),
    position: 'absolute',
    bottom: -120,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowColor: Globals.color.brand.primary,
    zIndex: 2,
  },
  successAnimationContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    paddingTop: 40,
  },
  successAnimation: {
    width: Dimensions.get('window').width / 2,
  },
  deliveryLocationContainer: {
    flex: 5,
  },
  functionalText: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    padding: Globals.dimension.padding.mini,
    textAlign: 'center',
    zIndex: 1,
  },
  deliveryLocationText: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    color: Globals.color.brand.primary,
    textAlign: 'center',
  },
  doneButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  markerContainer: {
    paddingBottom: 100,
  },
  bubble: {
    alignSelf: 'flex-start',
    backgroundColor: Globals.color.background.light,
    borderRadius: 6,
    padding: 15,
    shadowColor: Globals.color.background.dark,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowRadius: 16,
    shadowOpacity: 0.1,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: Globals.color.background.light,
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#F1004e',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,
  },
  name: {
    fontSize: 16,
    marginBottom: 5,
  },
  image: {
    width: 120,
    height: 80,
  },
  paperPlaneContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  paperPlaneIcon: {
    width: 50,
    height: 50,
  },
  paperPlaneLandedContainer: {
    position: 'absolute',
    paddingBottom: 30,
  },
  paperPlaneLanded: {
    width: 200,
    height: 200,
    position: 'absolute',
  },
  paperPlaneLocationIcon: {
    width: 200,
    height: 200,
  },
  loadingView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radar: {
    width: 300,
    height: 300,
    position: 'absolute',
  },
  radarBackground2: {
    backgroundColor: Globals.color.background.light,
    borderRadius: 200,
    opacity: 1,
    width: 200,
    height: 200,
    position: 'absolute',
  },
  radarBackground3: {
    backgroundColor: Globals.color.background.light,
    opacity: 0.3,
    borderRadius: 200,
    width: 230,
    height: 230,
    position: 'absolute',
  },
});
