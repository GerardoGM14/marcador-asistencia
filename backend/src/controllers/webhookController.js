const receiveData = async (req, res) => {
    try {
        const data = req.body;
        
        console.log('📦 Datos recibidos vía HTTP:', data);

        // Validar que haya datos
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No se enviaron datos en el cuerpo de la solicitud' 
            });
        }

        // 1. Aquí podrías guardar en base de datos si quisieras
        // await db.save(data)...

        // 2. Emitir evento en tiempo real al frontend
        // Usamos req.io que inyectaremos desde el index.js
        if (req.io) {
            req.io.emit('dashboard_update', data);
            console.log('📡 Evento dashboard_update emitido a los clientes');
        }

        res.status(200).json({ 
            success: true, 
            message: 'Datos recibidos y procesados correctamente' 
        });

    } catch (error) {
        console.error('Error en webhook:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
};

module.exports = {
    receiveData
};
