import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, ScrollView, Text } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./AuthStackScreen";
import firebase from "firebase/app";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";


interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignInScreen">;
}

export default function SignInScreen({ navigation }: Props) {
  /* Screen Requirements:
      - AppBar
      - Email & Password Text Input
      - Submit Button
      - Sign Up Button (goes to Sign Up screen)
      - Reset Password Button
      - Snackbar for Error Messages
  
    All UI components on this screen can be found in:
      https://callstack.github.io/react-native-paper/

    All authentication logic can be found at:
      https://firebase.google.com/docs/auth/web/starts
  */

  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")

  const auth = getAuth();

  function login(username: string, password: string) {
    signInWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }
  
  function resetPassword(username: string) {
    sendPasswordResetEmail(auth, username)
    .then(() => {
    // Password reset email sent!
    // ..
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
          <Appbar.Content title="Sign In" />
        </Appbar.Header>
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
          onPress={() => login(username, password)}
        >
          SIGN IN
        </Button>
        <Button
          onPress={() => navigation.navigate('SignUpScreen')}
        >
          CREATE AN ACCOUNT
        </Button>
        <Button
          onPress={() => resetPassword(username)}
        >
          RESET PASSWORD
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
