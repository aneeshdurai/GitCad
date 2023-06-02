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
    navigation: StackNavigationProp<HomeStackParamList, "HomePageScreen">;
  }


export default function ListofBuddies({navigation}: Props) {
     
    //const RootStack = createStackNavigator<RootStackParamList>();

    const [tickets, setTickets] = useState<Ticket[]>([]);

    const auth = getAuth();
    const currentUserId = auth.currentUser!.uid;
    
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
            //console.log(newTickets);
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

    const findATicket = (uid: string) => {
      var id: any = ""
      tickets.forEach((ticket: Ticket) => {
       // const newTicket = ticket.data() as Ticket;
        if (ticket.uid === uid) {
          //console.log("FOUND!!", ticket.id, "+", uid, "+", ticket.uid)
          id = ticket;
        }
        }
      )
      return id
      
    }

    
    const myticket = findATicket(currentUserId);
      

    const deleteTicket = async (ticket: Ticket) => {
      
      if (ticket.id) {
        await deleteDoc(doc(db, "tickets", ticket.id));
      }
    };
    /*
    const request = async (ticket: Ticket) => {
      //console.log(myticket)
      ticket.requests.push(myticket.uid)
      if (ticket.id) {
        await setDoc(doc(db, "tickets", ticket.id), ticket);
      }
      console.log(ticket)
      //myticket.requests.push(ticket.uid)
      //console.log(findATicket(ticket.uid))
    
    }*/

    const renderTicket = ({ item }: { item: Ticket }) => {
        /*
        if (currentUserId != item.uid) {
          if (myticket.course == item.course) {
            return (

              <Card style={{ margin: 16 }}>
                <Card.Title
                  title={item.name +
                    " at " + item.location}
                  subtitle={
                    item.description
                  }
                />
                <Card.Actions>
                  <Button onPress={() => {request(item)}}>
                    REQUEST
                  </Button>
                </Card.Actions>
              </Card>
            );
          }
        }
        else {
          return (
            <Card style={{ margin: 16 }}>
              <Card.Title
                title={item.name +
                  " at " + item.location}
                subtitle={
                  item.description
                }
              />
            </Card>
          )
        }
      };
      */
      return (
        <Card style={{ margin: 16 }}>
          <Card.Cover source={{ uri: item.image }} />
          <Card.Title
            title={item.name}
            subtitle={
              item.description
            }
          />
          
          {/* TODO: Add a like/interested button & delete soccial button. See Card.Actions
                in React Native Paper for UI/UX inspiration.
                https://callstack.github.io/react-native-paper/card-actions.html */
            <Card.Actions>  
              
              <Button onPress={() => {navigation.navigate("UpdateScreen", item.name)}}>
              UPDATE
              </Button>
              
              <Button onPress={() => {navigation.navigate("LogScreen", item.name)}}>
              LOG
              </Button>
  
              <Button onPress={() => {deleteTicket(item)}}>
              DELETE
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
                /*if (auth.currentUser?.uid != null) {
                  signOut(auth);
                }*/
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
                    data={tickets}
                    renderItem={renderTicket}
                    keyExtractor={(_: any, index: number) => "key-" + index}
                    // TODO: Uncomment the following line, and figure out how it works
                    // by reading the documentation :)
                    // https://reactnative.dev/docs/flatlist#listemptycomponent

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