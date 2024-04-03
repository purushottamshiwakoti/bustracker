import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { apiUrl } from "./lib/url";
import axios from "axios";
import { View, TouchableOpacity } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome"; // Import heart icon from FontAwesome
import useAuthStore from "./hooks/useAuth,";
import { Modal, Portal, PaperProvider } from "react-native-paper";
import { TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";

const HospitalDetail = ({ route }) => {
  const navigation = useNavigation();
  const { id: userId } = useAuthStore();
  const { id } = route.params;

  const [data, setData] = useState();
  const [isFavorite, setIsFavorite] = useState(false); // State to track favorite status
  const [locding, setLoading] = useState(false);
  const [rating, setRating] = useState(false);

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/health-posts/${id}`);
      console.log("API Response:", res.data);
      const { hp } = res.data;
      setData(hp);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const addRating = async () => {
    console.log(rating, id, userId);
    try {
      setLoading(true);
      console.log;

      const res = await axios.post(`${apiUrl}/rating`, {
        rating,
        healthPostsId: id,
        userId,
      });

      alert("Successfully added rating");
      Toast.show({
        type: "success",
        text1: "Success",
      });

      hideModal();
      navigation.navigate("Detail");

      // Handle success response here
    } catch (error) {
      console.error("Signup failed:", error);
      alert(error);
      const { message } = error.response.data;
      Toast.show({
        type: "error",
        text1: message,
      });

      // Handle error response here
    } finally {
      setLoading(false);
    }
  };
  const addFavourites = async () => {
    console.log(id, userId);
    try {
      setLoading(true);
      console.log;
      const res = await axios.post(`${apiUrl}/favourties`, {
        healthPostsId: id,
        userId,
      });
      setIsFavorite(true);

      // alert("Successfully added rating");
      Toast.show({
        type: "success",
        text1: "Success",
      });

      hideModal();

      // Handle success response here
    } catch (error) {
      console.error("Signup failed:", error);
      alert(error);
      const { message } = error.response.data;
      Toast.show({
        type: "error",
        text1: message,
      });
      navigation.goBack();
      // Handle error response here
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  console.log(data?.ratings);

  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Appbar.Header>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Appbar.Content title="Go Back" />
        </Appbar.Header>
        <View style={{ marginHorizontal: 10 }}>
          <Card style={{}}>
            <Card.Cover source={{ uri: data?.image }} />
            <Card.Content style={{ marginTop: 10 }}>
              <Text variant="titleLarge">{data?.name}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={showModal}>Rate</Button>
              {/* Heart icon to add to favorites */}
              <TouchableOpacity onPress={toggleFavorite}>
                <Icon
                  name={isFavorite ? "heart" : "heart-o"}
                  size={30}
                  color={isFavorite ? "red" : "black"}
                />
              </TouchableOpacity>
            </Card.Actions>
          </Card>
        </View>
        <View style={{ marginTop: 20, marginHorizontal: 10 }}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>Ratings:</Text>
          {data?.ratings &&
            data.ratings.map((ratingItem, index) => (
              <Card key={index} style={{ marginBottom: 10 }}>
                <Card.Content>
                  <Text>Rating: {ratingItem.rating}</Text>
                </Card.Content>
                <Card.Actions>
                  {/* You can add more actions here if needed */}
                </Card.Actions>
              </Card>
            ))}
        </View>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}
          >
            <TextInput
              label="Rating"
              mode="outlined"
              value={rating}
              onChangeText={(text) => setRating(text)}
            />
            <Button onPress={addRating}>Rate</Button>
          </Modal>
        </Portal>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default HospitalDetail;
