import { useEffect, useRef } from 'react';
import { WebSocketSubject } from 'rxjs/webSocket';

export const useWebSocket = () => {
  const socketRef = useRef<WebSocketSubject<any>>();

  useEffect(() => {
    // Replace 'ws://localhost:8080/ws' with your backend WebSocket URL
    const socket = new WebSocketSubject('ws://localhost:8080/ws');
    socketRef.current = socket;
    return () => {
      socket.complete();
    };
  }, []);

  return (data: any) => {
    // Send data to the backend through the WebSocket connection
    socketRef.current?.next(data);
  };
};
