import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./AuthStackScreen";
import firebase from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignUpScreen">;
}

export default function SignUpScreen({ navigation }: Props) {
  /* Screen Requirements:
      - AppBar
      - Email & Password Text Input
      - Submit Button
      - Sign In Button (goes to Sign In Screen)
      - Snackbar for Error Messages
  
    All UI components on this screen can be found in:
      https://callstack.github.io/react-native-paper/

    All authentication logic can be found at:
      https://firebase.google.com/docs/auth/web/start
  */

  const [name, setName] = useState("")
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")

  const auth = getAuth();

  function newAccount(username: string, password: string) {
    createUserWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      // Signed in 
      updateProfile(userCredential.user, {displayName: name})
      const user = userCredential.user;
      
      // ...

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
  }

  

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Create an Account" />
        </Appbar.Header>
        <TextInput
          label="Name"
          value={name}
          onChangeText={(name) => setName(name)}
          autoComplete={false}
        />
        <TextInput
          label="Email"
          value={username}
          onChangeText={(username) => setUserName(username)}
          autoComplete={false}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={(password) => setPassword(password)}
          autoComplete={false}
          secureTextEntry={true}
        />
        <Button
          onPress={() => newAccount(username, password)}
        >
          CREATE AN ACCOUNT
        </Button>
        <Button
          onPress={() => navigation.navigate('SignInScreen')}
        >
          OR, SIGN IN INSTEAD
        </Button>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: "#ffffff",
  },
});
