import React, {useState, useCallback} from 'react';
import {GiftedChat, IMessage, Bubble} from 'react-native-gifted-chat';
import {StyleSheet, View} from 'react-native';

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  // Load initial messages
  React.useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello! How can I help you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Support',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  // Handle sending a new message
  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages),
    );
  }, []);

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#0078fe', // Your message
        },
        left: {
          backgroundColor: '#f0f0f0', // Other person's message
        },
      }}
      textStyle={{
        right: {
          color: '#fff',
        },
        left: {
          color: '#000',
        },
      }}
    />
  );

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={newMessages => onSend(newMessages)}
        renderBubble={renderBubble}
        user={{
          _id: 1, // Current user ID
          name: 'You',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default ChatScreen;
