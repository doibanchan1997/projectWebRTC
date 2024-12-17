import HomeScreen from '../screens/HomeScreenn';
// import ChatListScreen from '../screens/ChatListScreen';
import ChatStackNavigator from './ChatStackNavigator';

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Define types for navigation
type RootTabParamList = {
  Home: undefined;
  Chats: undefined;
  Profile: undefined;
};

const SettingsScreen: React.FC = () => (
  <View style={styles.screen}>
    <Text>Settings Screen</Text>
  </View>
);

const ProfileScreen: React.FC = () => (
  <View style={styles.screen}>
    <Text>Profile Screen</Text>
  </View>
);

// Create Tab Navigator
const Tab = createBottomTabNavigator<RootTabParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => {
            let iconName: string = 'home-outline';

            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Chats') {
              iconName = 'settings-outline';
            } else if (route.name === 'Profile') {
              iconName = 'person-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen
          name="Chats"
          component={ChatStackNavigator}
          options={{headerShown: false}}
        />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
