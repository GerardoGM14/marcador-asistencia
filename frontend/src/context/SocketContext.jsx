import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Conectar al backend (ajusta la URL si es necesario)
    const newSocket = io('http://192.168.0.74:3000');
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
