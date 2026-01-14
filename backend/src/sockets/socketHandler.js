module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id);

        // Ejemplo: Recibir datos de un sistema externo
        socket.on('external_system_data', (data) => {
            console.log('Datos recibidos del sistema externo:', data);
            
            // Reenviar a todos los clientes conectados (dashboard)
            io.emit('dashboard_update', data);
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });
};
