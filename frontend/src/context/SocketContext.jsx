import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Detectar la URL del backend dinámicamente basándose en la ubicación actual
    const socketUrl = `${window.location.protocol}//${window.location.hostname}:3000`;
    console.log('Intentando conectar Socket.io a:', socketUrl);

    const newSocket = io(socketUrl);
    setSocket(newSocket);

    // Listeners globales para depuración
    newSocket.on('connect', () => {
      console.log('Socket conectado:', newSocket.id);
    });

    newSocket.on('user:login', (data) => {
      console.log('GLOBAL EVENT - user:login received:', data);
    });

    newSocket.on('user:state', (data) => {
      console.log('GLOBAL EVENT - user:state received:', data);
    });

    newSocket.on('external_system_data', (data) => {
      console.log('GLOBAL EVENT - external_system_data received:', data);
    });

    // Cleanup al desmontar
    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
