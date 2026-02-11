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

        // === NUEVOS EVENTOS PARA MONITOREO DE PANTALLA ===
        
        // 1. Admin solicita iniciar stream a un usuario
        socket.on('monitor:start_stream', (data) => {
            console.log('Admin solicita stream a:', data.userId);
            // Reenviamos la solicitud a todos (el cliente de escritorio del usuario debería escuchar esto)
            io.emit('monitor:start_stream', data);
        });

        // 2. Admin solicita detener stream
        socket.on('monitor:stop_stream', (data) => {
            console.log('Admin detiene stream de:', data.userId);
            io.emit('monitor:stop_stream', data);
        });

        // 2.1 Admin solicita iniciar stream DE FRAMES (Vista General)
        socket.on('monitor:start_stream_frame', (data) => {
            console.log('Admin solicita stream de frames (vista general) a:', data.userId);
            io.emit('monitor:start_stream_frame', data);
        });

        // 3. Cliente envía frame de video -> Reenviar al Admin
        socket.on('monitor:start_frame', (data) => {
            // No logueamos el data completo porque es una imagen base64 gigante
            // console.log('Frame recibido del cliente'); 
            io.emit('monitor:start_frame', data);
        });

        // 4. NUEVO: Cliente envía frame con nombre de evento "monitor:frame"
        socket.on('monitor:frame', (data) => {
             // Reenviar a todos
             io.emit('monitor:frame', data);
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });
};
