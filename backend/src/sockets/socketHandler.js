module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id);

        // Ejemplo: Recibir datos de un sistema externo
        socket.on('external_system_data', (data) => {
            console.log('Datos recibidos del sistema externo:', data);
            
            // Reenviar a todos los clientes conectados (dashboard)
            io.emit('dashboard_update', data);
            io.emit('external_system_data', data); // También emitir con el nombre original
        });

        // Handlers para eventos de usuario específicos
        socket.on('user:login', (data) => {
            console.log('Evento user:login recibido:', data);
            io.emit('user:login', data);
        });

        socket.on('user:state', (data) => {
            console.log('Evento user:state recibido:', data);
            io.emit('user:state', data);
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });
};
