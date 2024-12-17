export interface SignalMessage {
  type:
    | 'offer'
    | 'answer'
    | 'candidate'
    | 'newCall'
    | 'callAnswered'
    | 'ICEcandidate'
    | 'answerCall'
    | 'call'
    | 'ice-candidate';
  payload: any;
}

import SocketIOClient, {Socket} from 'socket.io-client';

class SignalingService {
  private static instance: SignalingService | null = null;
  private socket: Socket | null = null;

  private constructor(private url: string, private callerId: string) {}

  static getInstance(url: string, callerId: string): SignalingService {
    if (!this.instance) {
      this.instance = new SignalingService(url, callerId);
    }
    return this.instance;
  }

  connect() {
    this.socket = SocketIOClient(this.url, {
      transports: ['websocket'],
      query: {
        callerId: this.callerId,
      },
    });

    this.socket.on('connect', () => {
      console.log(
        `Connected to signaling server as callerId: ${this.callerId}`,
      );
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from signaling server');
    });

    this.socket.on('connect_error', error => {
      console.error('Connection error:', error);
    });
  }

  sendMessage(type: SignalMessage['type'], payload: any) {
    console.log('Sent signaling message:', {type, payload});
    if (this.socket && this.socket.connected) {
      this.socket.emit(type, payload);
      // console.log('Sent signaling message:', {type, payload});
    } else {
      console.error('Socket is not connected. Cannot send message.');
    }
  }

  onMessage(type: SignalMessage['type'], callback: (payload: any) => void) {
    if (this.socket) {
      this.socket.on(type, callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default SignalingService;
