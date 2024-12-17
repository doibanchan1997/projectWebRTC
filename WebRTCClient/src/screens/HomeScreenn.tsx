import React, {useEffect, useState, useRef} from 'react';
import {RTCSessionDescription, RTCIceCandidate} from 'react-native-webrtc';
import JoinScreen from './JoinScreen';
import IncomingCallScreen from './IncomingCallScreen';
import OutgoingCallScreen from './OutgoingCallScreen';
import WebrtcRoomScreen from './WebrtcRoomScreen';
import SignalingService from '../services/signalingService';
import PeerConnectionService from '../services/peerConnection';
import {PermissionsAndroid, Platform} from 'react-native';

export default function HomeScreen({}) {
  const [type, setType] = useState('JOIN');
  const [callerId] = useState(
    Math.floor(100000 + Math.random() * 900000).toString(),
  );

  const otherUserId = useRef('');
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  let remoteRTCMessage = useRef(null);
  const peerConnection = useRef<PeerConnectionService | null>(null);
  const signalingService = useRef(
    SignalingService.getInstance('http://192.168.0.118:4000', callerId),
  ).current;

  async function requestPermissions() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        if (
          granted['android.permission.CAMERA'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Camera and Microphone permissions granted');
        } else {
          console.log('Permissions denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

  useEffect(() => {
    signalingService.connect();
    signalingService.onMessage('newCall', handleNewCall);
    signalingService.onMessage('callAnswered', handleCallAnswered);
    signalingService.onMessage('ICEcandidate', handleICEcandidate);
    const setupPeerConnection = async () => {
      const service = new PeerConnectionService();
      peerConnection.current = service;
      try {
        const stream: any = await service.initLocalStream();
        setLocalStream(stream);

        service.onRemoteStream((stream: any) => {
          console.log(`onRemoteStream ${callerId} ${JSON.stringify(stream)}`);
          setRemoteStream(stream);
        });
        service.onIceCandidate((event: any) => {
          if (event.candidate) {
            sendICEcandidate({
              calleeId: otherUserId.current,
              rtcMessage: event,
            });
          } else {
            console.log('End of candidates.');
          }
        });
      } catch (error) {
        console.error('Error setting up peer connection:', error);
      }
    };
    setupPeerConnection();
    requestPermissions();
    return () => {
      console.log('disconnect socket');
      signalingService.disconnect();
      peerConnection.current?.close();
    };
  }, []);

  const handleNewCall = async (message: any) => {
    if (peerConnection.current && message.rtcMessage) {
      peerConnection.current.setRemoteDescription(message.rtcMessage);
    }
    remoteRTCMessage.current = message.rtcMessage;
    otherUserId.current = message.callerId;
    setType('INCOMING_CALL');
  };

  const handleCallAnswered = async (message: any) => {
    if (peerConnection.current && message.rtcMessage) {
      peerConnection.current.setRemoteDescription(message.rtcMessage);
    }
    setType('WEBRTC_ROOM');
  };

  const handleICEcandidate = async (data: any) => {
    if (peerConnection.current) {
      try {
        const candidate = new RTCIceCandidate(data.rtcMessage); // Convert message to RTCIceCandidate
        await peerConnection.current.addIceCandidate(candidate);
      } catch (error) {
        console.error(`Error adding ICE Candidate: ${callerId}`, error);
      }
    } else {
      console.error('Peer connection is not initialized');
    }
  };

  async function processCall() {
    if (peerConnection.current) {
      try {
        peerConnection.current.addLocalStream();
        const offer = await peerConnection.current.createOffer();
        sendCall({
          calleeId: otherUserId.current,
          rtcMessage: offer,
        });
      } catch (error) {
        console.error('Error starting call:', error);
      }
    }
  }

  async function processAccept() {
    if (peerConnection.current) {
      try {
        // peerConnection.current.addLocalStream();
        const sessionDescription = await peerConnection.current?.createAnswer();
        answerCall({
          callerId: otherUserId.current,
          rtcMessage: sessionDescription,
        });
      } catch (error) {
        console.error('Error processAccept call:', error);
      }
    }
  }

  function answerCall(data: any) {
    signalingService.sendMessage('answerCall', data);
  }

  function sendCall(data: any) {
    signalingService.sendMessage('call', data);
  }

  function sendICEcandidate(data: any) {
    signalingService.sendMessage('ICEcandidate', data);
  }

  const joinScreen = () => {
    return (
      <JoinScreen
        callerId={callerId}
        otherUserId={otherUserId.current}
        setType={(text: string) => {
          setType(text);
        }}
        setValue={(text: string) => {
          otherUserId.current = text;
        }}
        onProcessCall={() => processCall()}></JoinScreen>
    );
  };

  const outgoingCallScreen = () => {
    return (
      <OutgoingCallScreen
        otherUserId={otherUserId}
        setType={(text: string) => {
          setType(text);
        }}
      />
    );
  };

  const incomingCallScreen = () => {
    return (
      <IncomingCallScreen
        otherUserId={otherUserId}
        setType={(text: string) => {
          setType(text);
        }}
        onProcessAccept={() => processAccept()}
      />
    );
  };

  const webrtcRoomScreen = () => {
    return (
      <WebrtcRoomScreen
        localStream={localStream}
        remoteStream={remoteStream}
        peerConnection={peerConnection}
        setlocalStream={(stream: any) => setLocalStream(stream)}
        setType={(text: string) => {
          otherUserId.current = text;
        }}
      />
    );
  };

  switch (type) {
    case 'JOIN':
      return joinScreen();
    case 'INCOMING_CALL':
      return incomingCallScreen();
    case 'OUTGOING_CALL':
      return outgoingCallScreen();
    case 'WEBRTC_ROOM':
      return webrtcRoomScreen();
    default:
      return null;
  }
}
