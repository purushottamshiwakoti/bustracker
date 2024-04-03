import { View, Linking, ScrollView } from "react-native"; // Import ScrollView
import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, Portal, Provider as PaperProvider } from "react-native-paper"; // Rename Portal to Provider
import { buses } from "./data/bus"; // Import buses data
import axios from "axios";
import { apiUrl } from "./lib/url";
import { useNavigation } from "@react-navigation/native";

const images = [
  "https://shppasang.files.wordpress.com/2014/03/71555_528653800566443_1388079766_n1.jpg",
  "https://pbs.twimg.com/media/FMVjItFaQAA_P_Y.jpg",
  "https://samyuktayatayat.com.np/customer/slider/samyukta/samyukta11.jpg",
  "https://thehimalayantimes.com/uploads/imported_images/wp-content/uploads/2020/07/Sajha-Yatayat-Partial-Lockdown4.jpg",
];

const BusScreen = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(false);
  const [selectedBus, setSelectedBus] = React.useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/health-posts`);
      console.log("API Response:", res.data);
      const { hp } = res.data;
      setData(hp);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const showModal = (bus) => {
    console.log(bus);
    const filteredData = buses[0].places[bus];
    setSelectedBus(filteredData);
    setVisible(true);
  };
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20, margin: 10 };

  // Function to open Google Maps with specified coordinates
  const openGoogleMaps = () => {
    if (selectedBus) {
      const { latitude, longitude } = selectedBus.coordinates[0];
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  console.log(selectedBus);

  return (
    <PaperProvider>
      <ScrollView>
        <View>
          {data &&
            data.map((item, innerIndex) => (
              <View
                style={{ marginTop: 10, marginHorizontal: 10 }}
                key={innerIndex}
              >
                <Card>
                  <Card.Cover
                    source={{
                      uri: item.image,
                    }}
                  />
                  <Card.Content style={{ marginTop: 10 }}>
                    <Text variant="titleLarge">{item.name}</Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {Array.from({ length: 5 }, (_, index) => (
                        <MaterialCommunityIcons
                          key={index}
                          name="star"
                          size={24}
                          color="purple"
                          style={{ marginRight: 5 }}
                        />
                      ))}
                    </View>

                    {/* <Text>Total Stops: {bus.places.length}</Text> */}
                  </Card.Content>
                  <Card.Actions>
                    <Button
                      onPress={() =>
                        navigation.navigate("Detail", { id: item.id })
                      }
                    >
                      View Details
                    </Button>
                  </Card.Actions>
                </Card>
              </View>
            ))}
        </View>
      </ScrollView>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          {selectedBus && (
            <View>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 20,
                  textAlign: "center",
                  textTransform: "capitalize",
                }}
              >
                {selectedBus.name} Route
              </Text>
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 18 }}>
                  Number Of Seats:{selectedBus.seatNumber}
                </Text>
                <Text style={{ fontSize: 18, marginTop: 3 }}>
                  Waiting Time:{selectedBus.waitingTime}
                </Text>
                <Text style={{ fontSize: 18, marginTop: 3 }}>
                  Operation Time:5am-7pm
                </Text>
                <Text style={{ fontSize: 18, marginTop: 3 }}>
                  Rating:
                  {Array.from(
                    { length: Math.floor(selectedBus.rating) },
                    (_, index) => (
                      <MaterialCommunityIcons
                        key={index}
                        name="star"
                        size={18}
                        color="purple"
                        style={{ marginRight: 2 }}
                      />
                    )
                  )}
                </Text>
                <View>
                  <Text style={{ fontSize: 17, fontWeight: "600" }}>
                    Bus Stops
                  </Text>
                  {selectedBus.coordinates.map((item, ind) => (
                    <Text key={ind}>
                      {ind + 1} {item.name}
                    </Text>
                  ))}
                </View>
                {/* {selectedBus.places.map((place, index) => (
                  <Text key={index}>{`Stop ${index + 1}: ${place.name}`}</Text>
                ))} */}
                <Button
                  onPress={openGoogleMaps}
                  mode="contained-tonal"
                  style={{ marginTop: 10 }}
                >
                  Start Here
                </Button>
              </View>
            </View>
          )}
        </Modal>
      </Portal>
    </PaperProvider>
  );
};

export default BusScreen;
