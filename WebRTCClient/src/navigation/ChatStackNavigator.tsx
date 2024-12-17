import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ChatListScreen from '../screens/ChatListScreen';
import ChatDetailScreen from '../screens/ChatScreen';

const ChatStack = createStackNavigator();

const ChatStackNavigator: React.FC = () => {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{title: 'Chat'}}
      />
      <ChatStack.Screen
        name="ChatDetail"
        component={ChatDetailScreen}
        options={{title: 'Chat Details'}}
      />
    </ChatStack.Navigator>
  );
};

export default ChatStackNavigator;
