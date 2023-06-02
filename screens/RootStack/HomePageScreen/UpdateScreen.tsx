import React, { useState, useEffect } from "react";
import { Platform, View, Image } from "react-native";
import { Appbar, TextInput, Snackbar, Button} from "react-native-paper";
import { getFileObjectAsync, uuid } from "../../../Utils";
import { getApp, initializeApp } from "firebase/app";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "./HomeStackScreen";
import { Ticket } from "../../../models/ticket";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth, signOut } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { getFirestore, collection, query, onSnapshot, orderBy, setDoc, doc, deleteDoc } from "firebase/firestore";


interface Props {
    navigation: StackNavigationProp<HomeStackParamList, "UpdateScreen">;
  }

export default function UpdateScreen({route, navigation}: any) {
    
    
  
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [image, setImage] = useState<string>('');
    const name = route.params
    const [desc, setDesc] = useState<string>('')
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const currentUserId = auth.currentUser!.uid;
    const db = getFirestore();
    const ticketCollection = collection(db, "tickets");

    useEffect(() => {
        const unsubscribe = onSnapshot(query(ticketCollection, orderBy("name")), (querySnapshot) => {
        var newTickets: Ticket[] = [];
            querySnapshot.forEach((ticket: any) => {
              const newTicket = ticket.data() as Ticket;
              newTicket.id = ticket.id;
              newTickets.push(newTicket);
            });
            setTickets(newTickets);
        });
        return unsubscribe;
    }, []);

    const findATicket = (uid: string) => {
        var id: Ticket = tickets[0]
        tickets.forEach((ticket: Ticket) => {
          if (ticket.uid === uid) {
            id = ticket;
          }
          }
        )
        return id
        
      }

    const myticket = findATicket(name);


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


    const update = async () => {
        const db = getFirestore();
        const requestCollection = collection(db, "tickets");
        const requestRef = doc(requestCollection);
        const storage = getStorage(getApp());
        console.log("Collected Data")
        
        console.log(currentUser.displayName)
        const uid = currentUser.uid
        console.log("My ID", uid)
        
        console.log("getting file object");
        const object: Blob = (await getFileObjectAsync(image)) as Blob;
        // Generate a brand new doc ID by calling .doc() on the socials node.
        const storageRef = ref(storage, requestRef.id + ".jpg");
        const result = await uploadBytes(storageRef, object);
        
        console.log("getting download url");
        const downloadURL = await getDownloadURL(result.ref);
        console.log(downloadURL)
        myticket.image = downloadURL
        myticket.images.push(downloadURL);

        

        if (myticket.id) {
            await setDoc(doc(db, "tickets", myticket.id), myticket);
        }
        
        navigation.navigate('HomePageScreen')
        console.log("Added Ticket");
      };
    
  

    const Bar = () => {
        return (
          <Appbar.Header>
            <Appbar.Action onPress={() => {navigation.navigate('HomePageScreen')}} icon={"close"} />
            <Appbar.Content title="Update Project" />
          </Appbar.Header>
        );
      };

    return (
        <>
            <Bar/>
            <View>
                {<Button mode="outlined" onPress={pickImage} style={{ marginTop: 20 }}>
                    {image ? "Change Image" : "Pick an Image"}
                </Button>}
                {<Button onPress = {update}>UPDATE</Button>}
            </View>
        
        
        
        </>
    )
}