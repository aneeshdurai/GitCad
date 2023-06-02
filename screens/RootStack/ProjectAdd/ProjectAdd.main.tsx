import React, { useState, useEffect } from "react";
import { Platform, View, Image } from "react-native";
import { Appbar, TextInput, Snackbar, Button} from "react-native-paper";
import { getFileObjectAsync, uuid } from "../../../Utils";
import { getApp, initializeApp } from "firebase/app";
import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackScreen";
import { Ticket } from "../../../models/ticket";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth, signOut } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";

interface Props {
    navigation: StackNavigationProp<RootStackParamList, "BuddySearchScreen">;
  }

export default function BuddySearchScreen({navigation}: Props) {
    

    const [desc, setDesc] = useState<string>('')
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const [name, setName] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [images, setImages] = useState<string[]>([]);

    const pickImage = async () => {
        console.log("picking image");
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        console.log("done");
        if (!result.cancelled) {
          setImage(result.uri);
        }
      };

    const asyncAwaitNetworkRequests = async () => {
        const db = getFirestore();
        //console.log(db)
        const requestCollection = collection(db, "tickets");
        const requestRef = doc(requestCollection);
        const storage = getStorage(getApp());
        console.log("Collected Data")
        
        console.log(currentUser.displayName)
        //const name = currentUser.displayName
        const uid = currentUser.uid
        console.log("My ID", uid)
        /*if (currentUser) {
            console.log("currentUser exists")
            console.log(currentUser?.displayName)
            setName(currentUser?.displayName)
            console.log(name)
        }*/
        
        console.log("getting file object");
        const object: Blob = (await getFileObjectAsync(image)) as Blob;
        const storageRef = ref(storage, requestRef.id + ".jpg");
        const result = await uploadBytes(storageRef, object);
        
        console.log("getting download url");
        const downloadURL = await getDownloadURL(result.ref);
        console.log(downloadURL)
        images.push(downloadURL);

        const request: Ticket = {
            name: name,
            description: desc,
            uid: uid,
            requested: false,
            image: downloadURL,
            images: images

        };

        
        //const docRef = await addDoc(collection(db, "requests"), request);
        await setDoc(requestRef, request);
        console.log("Added Ticket");
      };

    const match = () => {
        try {
            asyncAwaitNetworkRequests()
        }
        catch (e) {
            console.log("Error while writing request:", e);
        }
        navigation.navigate('HomeStackScreen')
    }

    const Bar = () => {
        return (
          <Appbar.Header>
            <Appbar.Action onPress={() => {signOut(auth)}} icon={"close"} />
            <Appbar.Content title="Add a New Project" />
          </Appbar.Header>
        );
      };

    return (
        <>
            <Bar/>
            <View>
                {<TextInput 
                    label = "Name"
                    value = {name}
                    onChangeText = {name => setName(name)}
                    autoComplete = "off"
                />}
                {<TextInput 
                    label = "Description"
                    value = {desc}
                    onChangeText = {desc => setDesc(desc)}
                    autoComplete = "off"
                />}
                {<Button mode="outlined" onPress={pickImage} style={{ marginTop: 20 }}>
                    {image ? "Change Image" : "Pick an Image"}
                </Button>}
                {<Button onPress = {match}>ADD PROJECT</Button>}
            </View>
        
        
        
        </>
    )
}