import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { buses } from "../src/data/bus";

export default function Home() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(buses);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      try {
        setLoading(true);
        const { coords } = await Location.getCurrentPositionAsync({});
        setLocation(coords);
      } catch (error) {
        console.error("Error fetching location:", error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            location && (
              <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title="Your Location"
                />
                <Marker
                  coordinate={{
                    latitude: 27.7088432,
                    longitude: 85.3210188,
                  }}
                  title="College Location"
                />
                {buses &&
                  buses.map((busCompany, companyIndex) => {
                    return busCompany.places.map((busStop, stopIndex) => {
                      return busStop.coordinates.map(
                        (coordinate, coordIndex) => {
                          return (
                            <Marker
                              key={`${companyIndex}-${stopIndex}-${coordIndex}`}
                              coordinate={{
                                latitude: parseFloat(coordinate.latitude),
                                longitude: parseFloat(coordinate.longitude),
                              }}
                              title={coordinate.name}
                              description={`Morning:${coordinate.morningArrivingTime} Evening:${coordinate.eveningArrivingTime}`}
                              // Add other details like waiting time, seat number, etc. if needed
                            >
                              <MaterialCommunityIcons
                                name="bus-school"
                                size={24}
                                color={"#d9ae04"}
                              />
                            </Marker>
                          );
                        }
                      );
                    });
                  })}
              </MapView>
            )
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
