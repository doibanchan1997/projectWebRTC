import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import CallAnswer from '../../asset/CallAnswer';

// Define the props type for the component
type IncomingCallScreenProps = {
  otherUserId: any;
  setType: any;
  onProcessAccept: any;
};

// Define the functional component with typed props
const IncomingCallScreen: React.FC<IncomingCallScreenProps> = ({
  otherUserId,
  setType,
  onProcessAccept,
}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: '#050A0E',
      }}>
      <View
        style={{
          padding: 35,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 14,
        }}>
        <Text
          style={{
            fontSize: 36,
            marginTop: 12,
            color: '#ffff',
          }}>
          {otherUserId.current} is calling..
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            onProcessAccept();
            setType('WEBRTC_ROOM');
          }}
          style={{
            backgroundColor: 'green',
            borderRadius: 30,
            height: 60,
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CallAnswer height={28} fill={'#fff'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IncomingCallScreen;
