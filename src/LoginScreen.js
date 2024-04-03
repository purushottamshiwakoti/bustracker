import { Alert, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Text, TextInput, Button } from "react-native-paper"; // Import TextInput from react-native-paper
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Toast from "react-native-toast-message";
import axios from "axios";
import { Colors } from "./colors";
import { loginSchema } from "../schemas";
import { apiUrl } from "./lib/url";
import useAuthStore from "./hooks/useAuth,";

const LoginScreen = ({ navigation }) => {
  const [isLoading, setLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const { setUserName, setId } = useAuthStore();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const { email, password } = data;
    console.log(password);

    try {
      setLoading(true);
      const res = await axios.post(`${apiUrl}/login`, {
        email: email,
        password: password,
      });

      const { message, user } = res.data;
      setId(user.id);
      setUserName(user.name);

      Toast.show({
        type: "success",
        text1: message,
      });

      // Handle success response here
    } catch (error) {
      console.error("Signup failed:", error);
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

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        variant="headlineMedium"
        style={{ color: Colors.primary, fontWeight: "700" }}
      >
        Welcome Back
      </Text>
      <View style={{ width: "95%", marginTop: 10 }}>
        {/* Adjust the width as needed */}
        <Controller
          control={control}
          name={"email"}
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            // <TextInput
            //   placeholder="email"
            //   style={styles.input}
            //   value={value}
            //   onChangeText={onChange}
            //   onBlur={onBlur}
            // />
            <>
              <TextInput
                label="Email"
                placeholder="Enter your email address here"
                value={value}
                style={{
                  width: "100%",
                  color: Colors.primary,
                  borderRadius: 20,
                }}
                keyboardType="email-address"
                mode="outlined"
                onChangeText={onChange}
                onBlur={onBlur}
              />
              {error && (
                <Text style={{ color: Colors.destructive, marginTop: 4 }}>
                  {error.message}
                </Text>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name={"password"}
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <>
              <TextInput
                label="Password"
                placeholder="Enter your password here"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={{
                  width: "100%",
                  color: Colors.primary,
                  borderRadius: 20,
                  marginTop: 10,
                }}
                secureTextEntry
                mode="outlined"
              />
              {error && (
                <Text style={{ color: Colors.destructive, marginTop: 4 }}>
                  {error.message}
                </Text>
              )}
            </>
          )}
        />

        <Button
          icon="logout"
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={{
            marginTop: 20,
            height: 50,
            marginLeft: 0,
            marginRight: 0,
            justifyContent: "center",
            backgroundColor: Colors.primary,
          }}
          disabled={isLoading}
        >
          Login
        </Button>
        <View
          style={{
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            flexDirection: "row",
          }}
        >
          <Text
            variant="bodyMedium"
            style={{
              textAlign: "right",
            }}
          >
            Don't have an account
          </Text>
          <TouchableOpacity
            style={{ marginLeft: 3 }}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={{ color: Colors.primary }}>Register Here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
