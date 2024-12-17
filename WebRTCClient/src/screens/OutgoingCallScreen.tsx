import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import CallEnd from '../../asset/CallEnd';

// Define the props type for the component
type OutgoingCallScreenProps = {
  otherUserId: any;
  setType: any;
};

// Define the functional component with typed props
const OutgoingCallScreen: React.FC<OutgoingCallScreenProps> = ({
  otherUserId,
  setType,
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
            fontSize: 16,
            color: '#D0D4DD',
          }}>
          Calling to...
        </Text>

        <Text
          style={{
            fontSize: 36,
            marginTop: 12,
            color: '#ffff',
            letterSpacing: 6,
          }}>
          {otherUserId.current}
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            setType('JOIN');
            otherUserId.current = '';
          }}
          style={{
            backgroundColor: '#FF5D5D',
            borderRadius: 30,
            height: 60,
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CallEnd width={50} height={12} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OutgoingCallScreen;
