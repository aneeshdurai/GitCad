import React, { useState, useEffect } from "react";
import { View, FlatList, Image, Alert} from "react-native";
import { Appbar, Button, Card } from "react-native-paper";
import firebase from "firebase/app"
import { getFirestore, collection, query, onSnapshot, orderBy, setDoc, doc, deleteDoc } from "firebase/firestore";
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import { getAuth, signOut } from "firebase/auth";
import { Ticket } from "../../../models/ticket";
import { styles } from "./HomePage.styles";
import { HomeStackParamList } from "./HomeStackScreen";
import HomePageScreen from "./HomePageScreen";


interface Props {
    navigation: StackNavigationProp<HomeStackParamList, "LogScreen">;
  }


export default function LogScreen({route, navigation}: any) {
     
    //const RootStack = createStackNavigator<RootStackParamList>();

    const [tickets, setTickets] = useState<Ticket[]>([]);

    const auth = getAuth();
    const currentUserId = auth.currentUser!.uid;
    const name = route.params

    console.log(auth.currentUser)
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

    const findOurTicket = (uid: string) => {
      tickets.forEach((ticket: any) => {
        const newTicket = ticket.data() as Ticket;
        if (newTicket.uid === currentUserId) {
          return newTicket.id
        }
        }
      )
      
    }

    const checkout = async (image: string) => {
        myticket.image = image
        if (myticket.id) {
            await setDoc(doc(db, "tickets", myticket.id), myticket);
        }
        navigation.navigate('HomePageScreen')
    }

    const findATicket = (uid: string) => {
      var id: any = ""
      tickets.forEach((ticket: Ticket) => {
        if (ticket.name === name) {
          id = ticket;
        }
        }
      )
      return id
      
    }

    
    const myticket = findATicket(name);
      

    const deleteTicket = async (ticket: Ticket) => {
      
      if (ticket.id) {
        await deleteDoc(doc(db, "tickets", ticket.id));
      }
    };
    

    const renderTicket = ({ item }: { item: any }) => {
        
      return (
        <Card style={{ margin: 16 }}>
          <Card.Cover source={{ uri: item }} />
          <Card.Title
            title={name}

          />
          
          {
            <Card.Actions>  
              
              <Button onPress={() => {checkout(item)}}>
              CHECKOUT
              </Button>

            </Card.Actions>
                
           }
        </Card>
      );
    }
      const Bar = () => {
        return (
          <Appbar.Header>
            <Appbar.Action
              icon="exit-to-app"
              onPress={() => {
                deleteTicket(myticket);
                navigation.navigate('HomePageScreen')
                
              }}
            />
            <Appbar.Content title={"Projects"} />
            <Appbar.Action
              icon="close"
              onPress={() => {
                navigation.navigate("HomePageScreen");
                
              }}
            />
          </Appbar.Header>
        );
      };

    const ListEmptyComponent = () => {
        return (
            <Button onPress = {() => navigation.navigate('HomePageScreen')}>No Tickets At This Time</Button>
        )
      }

    return (
        <>
            <Bar/>
            <View style={styles.container}>
                <FlatList
                    data={myticket.images}
                    renderItem={renderTicket}
                    keyExtractor={(_: any, index: number) => "key-" + index}

                    ListEmptyComponent={ListEmptyComponent}
                 />
             </View>
             <Image
                style={styles.tinyLogo}
                source={{
                uri: 'assets/logo.png',
                }}
              />
        </>
        
    )
}