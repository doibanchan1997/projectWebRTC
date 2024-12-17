import React from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import TextInputContainer from '../../src/components/TextInputContainer';

import CallEnd from '../../asset/CallEnd';

// Define the props type for the component
type JoinScreenProps = {
  callerId: any;
  otherUserId: any;
  setType: any;
  onProcessCall: any;
  setValue: any;
};

// Define the functional component with typed props
const JoinScreen: React.FC<JoinScreenProps> = ({
  callerId,
  otherUserId,
  setType,
  onProcessCall,
  setValue,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        backgroundColor: '#050A0E',
        justifyContent: 'center',
        paddingHorizontal: 42,
      }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <View
            style={{
              padding: 35,
              backgroundColor: '#1A1C22',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 14,
            }}>
            <Text
              style={{
                fontSize: 18,
                color: '#D0D4DD',
              }}>
              Your Caller ID
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 12,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 32,
                  color: '#ffff',
                  letterSpacing: 6,
                }}>
                {callerId}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: '#1A1C22',
              padding: 40,
              marginTop: 25,
              justifyContent: 'center',
              borderRadius: 14,
            }}>
            <Text
              style={{
                fontSize: 18,
                color: '#D0D4DD',
              }}>
              Enter call id of another user
            </Text>
            <TextInputContainer
              placeholder={'Enter Caller ID'}
              value={otherUserId.current}
              setValue={setValue}
              keyboardType={'number-pad'}
            />
            <TouchableOpacity
              onPress={() => {
                onProcessCall();
                setType('OUTGOING_CALL');
              }}
              style={{
                height: 50,
                backgroundColor: '#5568FE',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 12,
                marginTop: 16,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#FFFFFF',
                }}>
                Call Now
              </Text>
            </TouchableOpacity>
          </View>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default JoinScreen;
