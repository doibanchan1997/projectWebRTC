import express, { Application } from "express";
import { createServer, Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

interface OfferPayload {
  calleeId: string;
  rtcMessage: RTCSessionDescriptionInit;
}

interface OfferPayload {
  target: string;
  sdp: RTCSessionDescriptionInit;
}

interface IceCandidatePayload {
  target: string;
  candidate: RTCIceCandidateInit;
}

class SignalingServer {
  private app: Application;
  private httpServer: HttpServer;
  private io: SocketIOServer;
  private readonly port: number;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, { cors: { origin: "*" } });

    this.configureSocketEvents();
  }

  // Configures socket events for signaling
  private configureSocketEvents(): void {
    this.io.use((socket: Socket, next) => {
      if (socket.handshake.query) {
        let callerId = socket.handshake.query.callerId;
        (socket as any).user = callerId;
        next();
      }
    });

    this.io.on("connection", (socket: Socket) => {
      console.log(`New client connected: ${socket.id}`);
      socket.join((socket as any).user);

      socket.on("call", (data) => {
        let calleeId = data.calleeId;
        let rtcMessage = data.rtcMessage;
        console.log("send new call ", data);
        socket.to(calleeId).emit("newCall", {
          callerId: (socket as any).user,
          rtcMessage: rtcMessage,
        });
      });

      socket.on("answerCall", (data) => {
        let callerId = data.callerId;
        let rtcMessage = data.rtcMessage;

        console.log(`answerCall ${JSON.stringify(data)}`);

        socket.to(callerId).emit("callAnswered", {
          calleeId: (socket as any).user,
          rtcMessage: rtcMessage,
        });
      });

      socket.on("ICEcandidate", (data) => {
        let calleeId = data.calleeId;
        let rtcMessage = data.rtcMessage;
        socket.to(calleeId).emit("ICEcandidate", {
          sender: (socket as any).user,
          rtcMessage: data.rtcMessage,
        });
      });

      // Handle joining a room
      socket.on("join", (roomId: string) =>
        this.handleJoinRoom(socket, roomId)
      );

      // Handle WebRTC offer
      socket.on("offer", (payload: OfferPayload) =>
        this.handleOffer(socket, payload)
      );

      // Handle WebRTC answer
      socket.on("answer", (payload: OfferPayload) =>
        this.handleAnswer(socket, payload)
      );

      // Handle ICE candidates
      socket.on("ice-candidate", (payload: IceCandidatePayload) =>
        this.handleIceCandidate(socket, payload)
      );

      // Handle client disconnect
      socket.on("disconnect", () => this.handleDisconnect(socket));
    });
  }

  // Handle a client joining a room
  private handleJoinRoom(socket: Socket, roomId: string): void {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);
    console.log(`${socket.id} joined room ${roomId}`);
  }

  // Handle WebRTC offer
  private handleOffer(socket: Socket, payload: OfferPayload): void {
    console.log(`Offer from ${socket.id} to ${JSON.stringify(payload)}`);
    this.io
      .to(payload.target)
      .emit("offer", { caller: socket.id, sdp: payload.sdp });
  }

  // Handle WebRTC answer
  private handleAnswer(socket: Socket, payload: OfferPayload): void {
    console.log(`Answer from ${socket.id} to ${payload.target}`);
    this.io
      .to(payload.target)
      .emit("answer", { callee: socket.id, sdp: payload.sdp });
  }

  // Handle ICE candidate
  private handleIceCandidate(
    socket: Socket,
    payload: IceCandidatePayload
  ): void {
    console.log(`ICE candidate from ${socket.id} to ${payload.target}`);
    this.io
      .to(payload.target)
      .emit("ice-candidate", { candidate: payload.candidate });
  }

  // Handle client disconnect
  private handleDisconnect(socket: Socket): void {
    console.log(`Client disconnected: ${socket.id}`);
    socket.broadcast.emit("user-disconnected", socket.id);
  }

  // Start the HTTP and WebSocket servers
  public start(): void {
    this.httpServer.listen(this.port, () => {
      console.log(`Signaling server is running on port ${this.port}`);
    });
  }
}

export default SignalingServer;
