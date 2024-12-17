import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStream,
  mediaDevices,
} from 'react-native-webrtc';

class PeerConnectionService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;

  constructor(
    private iceServers: RTCIceServer[] = [
      {urls: 'stun:stun.l.google.com:19302'},
    ],
  ) {
    this.peerConnection = new RTCPeerConnection({iceServers: this.iceServers});
  }

  /** Initialize the local media stream */
  async initLocalStream(): Promise<MediaStream> {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      this.localStream = stream;
      return stream;
    } catch (error) {
      console.error('Error accessing local media:', error);
      throw error;
    }
  }

  /** Add the local stream to the peer connection */
  addLocalStream(): void {
    if (this.localStream && this.peerConnection) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });
    }
  }

  /** Create an offer */
  async createOffer(): Promise<RTCSessionDescription> {
    if (!this.peerConnection)
      throw new Error('PeerConnection is not initialized');
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  /** Set remote description */
  async setRemoteDescription(
    description: RTCSessionDescription,
  ): Promise<void> {
    if (!this.peerConnection)
      throw new Error('PeerConnection is not initialized');
    const remoteDesc = new RTCSessionDescription(description);
    await this.peerConnection.setRemoteDescription(remoteDesc);
  }

  /** Create an answer */
  async createAnswer(): Promise<RTCSessionDescription> {
    if (!this.peerConnection)
      throw new Error('PeerConnection is not initialized');
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    return answer;
  }

  /** Add ICE candidate */
  async addIceCandidate(candidate: RTCIceCandidate): Promise<void> {
    if (!this.peerConnection)
      throw new Error('PeerConnection is not initialized');
    await this.peerConnection.addIceCandidate(candidate);
  }

  /** Listen for remote stream */
  onRemoteStream(callback: (stream: MediaStream | null) => void): void {
    if (this.peerConnection) {
      (this.peerConnection as any).ontrack = (event: any) => {
        if (event.streams && event.streams[0]) {
          this.remoteStream = event.streams[0];
          callback(this.remoteStream);
        }
      };
    }
  }

  /** Handle ICE candidates */
  onIceCandidate(callback: (candidate: RTCIceCandidate) => void): void {
    if (this.peerConnection) {
      (this.peerConnection as any).onicecandidate = (event: any) => {
        if (event.candidate) {
          callback(event.candidate);
        }
      };
    }
  }

  /** Close the connection and cleanup */
  close(): void {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    this.remoteStream = null;
  }
}

export default PeerConnectionService;
