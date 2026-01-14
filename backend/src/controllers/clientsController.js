const { db, sql } = require('../config/db');

const createClient = async (req, res) => {
    try {
        let {
            // Client fields
            tTipoDocumento, tNumeroDocumento, tRazonSocial, tRubro, tCategoria,
            tCanalCaptacion, tNivelPrioridad, tDireccionFiscal, tCiudad,
            tContactoNombre, tContactoCargo, tContactoTelefono, tContactoEmail,
            // Contract fields
            tAgenteVentas, tTipoServicio, tNombreProyecto, tCentroCosto,
            tPlanSuscripcion, tDireccionServicio, fFechaContrato, fFechaCapacitacion,
            fFechaEntrega, tTipoMoneda, iCostoImplementacion, tModalidadMembresia,
            iCostoMembresia, fInicioMembresia, fFinMembresia, lAplicaIGV,
            tObservaciones, tURLDocumentacion
        } = req.body;

        // Handle file uploads
        if (req.files && req.files.length > 0) {
            const filePaths = req.files.map(file => file.path);
            tURLDocumentacion = filePaths.join(';');
        }

        // Mock Response (DB Disabled)
        const iMCliente = Date.now();
        return res.status(201).json({ 
            message: 'Cliente registrado exitosamente (Mock)', 
            id: iMCliente 
        });

        /*
        const pool = await db.connect();
        let iMCliente = 0;

        if (db.dbType === 'mssql') {
            const transaction = new sql.Transaction(pool);
            await transaction.begin();

            try {
                // Helper para manejar fechas vacías
                const getDate = (val) => (!val || val === '') ? null : val;

                // 1. Insert Client
                const requestCliente = new sql.Request(transaction);
                const resultCliente = await requestCliente
                    .input('tTipoDocumento', sql.VarChar, tTipoDocumento)
                    .input('tNumeroDocumento', sql.VarChar, tNumeroDocumento)
                    .input('tRazonSocial', sql.VarChar, tRazonSocial)
                    .input('tRubro', sql.VarChar, tRubro)
                    .input('tCategoria', sql.VarChar, tCategoria)
                    .input('tCanalCaptacion', sql.VarChar, tCanalCaptacion)
                    .input('tNivelPrioridad', sql.VarChar, tNivelPrioridad)
                    .input('tDireccionFiscal', sql.VarChar, tDireccionFiscal)
                    .input('tCiudad', sql.VarChar, tCiudad)
                    .input('tContactoNombre', sql.VarChar, tContactoNombre)
                    .input('tContactoCargo', sql.VarChar, tContactoCargo)
                    .input('tContactoTelefono', sql.VarChar, tContactoTelefono)
                    .input('tContactoEmail', sql.VarChar, tContactoEmail)
                    .query(`
                        INSERT INTO MCLIENTES (
                            tTipoDocumento, tNumeroDocumento, tRazonSocial, tRubro, tCategoria,
                            tCanalCaptacion, tNivelPrioridad, tDireccionFiscal, tCiudad,
                            tContactoNombre, tContactoCargo, tContactoTelefono, tContactoEmail
                        )
                        OUTPUT INSERTED.iMCliente
                        VALUES (
                            @tTipoDocumento, @tNumeroDocumento, @tRazonSocial, @tRubro, @tCategoria,
                            @tCanalCaptacion, @tNivelPrioridad, @tDireccionFiscal, @tCiudad,
                            @tContactoNombre, @tContactoCargo, @tContactoTelefono, @tContactoEmail
                        )
                    `);
                
                iMCliente = resultCliente.recordset[0].iMCliente;

                // 2. Insert Contract
                const requestContrato = new sql.Request(transaction);
                await requestContrato
                    .input('iMCliente', sql.Int, iMCliente)
                    .input('tAgenteVentas', sql.VarChar, tAgenteVentas)
                    .input('tTipoServicio', sql.VarChar, tTipoServicio)
                    .input('tNombreProyecto', sql.VarChar, tNombreProyecto)
                    .input('tCentroCosto', sql.VarChar, tCentroCosto)
                    .input('tPlanSuscripcion', sql.VarChar, tPlanSuscripcion)
                    .input('tDireccionServicio', sql.VarChar, tDireccionServicio)
                    .input('fFechaContrato', sql.Date, getDate(fFechaContrato))
                    .input('fFechaCapacitacion', sql.Date, getDate(fFechaCapacitacion))
                    .input('fFechaEntrega', sql.Date, getDate(fFechaEntrega))
                    .input('tTipoMoneda', sql.Char, tTipoMoneda)
                    .input('iCostoImplementacion', sql.Decimal(10, 2), iCostoImplementacion)
                    .input('tModalidadMembresia', sql.VarChar, tModalidadMembresia)
                    .input('iCostoMembresia', sql.Decimal(10, 2), iCostoMembresia)
                    .input('fInicioMembresia', sql.Date, getDate(fInicioMembresia))
                    .input('fFinMembresia', sql.Date, getDate(fFinMembresia))
                    .input('lAplicaIGV', sql.Bit, lAplicaIGV ? 1 : 0)
                    .input('tObservaciones', sql.NVarChar, tObservaciones)
                    .input('tURLDocumentacion', sql.VarChar, tURLDocumentacion)
                    .query(`
                        INSERT INTO MCONTRATOS (
                            iMCliente, tAgenteVentas, tTipoServicio, tNombreProyecto, tCentroCosto,
                            tPlanSuscripcion, tDireccionServicio, fFechaContrato, fFechaCapacitacion,
                            fFechaEntrega, tTipoMoneda, iCostoImplementacion, tModalidadMembresia,
                            iCostoMembresia, fInicioMembresia, fFinMembresia, lAplicaIGV,
                            tObservaciones, tURLDocumentacion
                        )
                        VALUES (
                            @iMCliente, @tAgenteVentas, @tTipoServicio, @tNombreProyecto, @tCentroCosto,
                            @tPlanSuscripcion, @tDireccionServicio, @fFechaContrato, @fFechaCapacitacion,
                            @fFechaEntrega, @tTipoMoneda, @iCostoImplementacion, @tModalidadMembresia,
                            @iCostoMembresia, @fInicioMembresia, @fFinMembresia, @lAplicaIGV,
                            @tObservaciones, @tURLDocumentacion
                        )
                    `);

                await transaction.commit();
                console.log('✅ Cliente registrado exitosamente en el sistema. ID:', iMCliente);
            } catch (err) {
                await transaction.rollback();
                throw err;
            }

        } else if (db.dbType === 'mysql') {
            // 1. Insert Client
            const [resultCliente] = await pool.execute(`
                INSERT INTO MCLIENTES (
                    tTipoDocumento, tNumeroDocumento, tRazonSocial, tRubro, tCategoria,
                    tCanalCaptacion, tNivelPrioridad, tDireccionFiscal, tCiudad,
                    tContactoNombre, tContactoCargo, tContactoTelefono, tContactoEmail
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                tTipoDocumento, tNumeroDocumento, tRazonSocial, tRubro, tCategoria,
                tCanalCaptacion, tNivelPrioridad, tDireccionFiscal, tCiudad,
                tContactoNombre, tContactoCargo, tContactoTelefono, tContactoEmail
            ]);

            iMCliente = resultCliente.insertId;

            // 2. Insert Contract
            await pool.execute(`
                INSERT INTO MCONTRATOS (
                    iMCliente, tAgenteVentas, tTipoServicio, tNombreProyecto, tCentroCosto,
                    tPlanSuscripcion, tDireccionServicio, fFechaContrato, fFechaCapacitacion,
                    fFechaEntrega, tTipoMoneda, iCostoImplementacion, tModalidadMembresia,
                    iCostoMembresia, fInicioMembresia, fFinMembresia, lAplicaIGV,
                    tObservaciones, tURLDocumentacion
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                iMCliente, tAgenteVentas, tTipoServicio, tNombreProyecto, tCentroCosto,
                tPlanSuscripcion, tDireccionServicio, fFechaContrato, fFechaCapacitacion,
                fFechaEntrega, tTipoMoneda, iCostoImplementacion, tModalidadMembresia,
                iCostoMembresia, fInicioMembresia, fFinMembresia, lAplicaIGV,
                tObservaciones, tURLDocumentacion
            ]);
        }

        res.status(201).json({ 
            message: 'Cliente registrado exitosamente', 
            id: iMCliente 
        });
        */

    } catch (error) {
        console.error('Error creando cliente:', error);
        
        // Manejo de errores específicos de SQL Server
        if (error.number === 2627 || error.number === 2601) {
            // Violación de restricción única (duplicado)
            if (error.message.includes('dbo.MCLIENTES')) {
                 return res.status(409).json({ message: 'El número de documento ya se encuentra registrado en el sistema.' });
            }
        }

        res.status(500).json({ message: 'Error al registrar cliente', error: error.message });
    }
};

const getClients = async (req, res) => {
    try {
        // Mock Response (DB Disabled)
        const clients = [
            {
                id: 1,
                nro: 1,
                cliente: 'Cliente de Prueba S.A.C.',
                ruc: '20123456789',
                emision: '15/05/2025',
                formula: 'Mensual',
                os: 'Juan Perez',
                proyecto: 'Implementación ERP',
                servicios: 'Consultoría',
                costo: 'S/ 5000.00',
                mensualidad: 'S/ 1200.00',
                prioridad: 'Alta',
                estado: 'Activo'
            }
        ];
        return res.json(clients);

        /*
        const pool = await db.connect();
        let clients = [];

        if (db.dbType === 'mssql') {
            const result = await pool.request().query(`
                SELECT 
                    c.iMCliente as id,
                    c.tNumeroDocumento as ruc,
                    c.tRazonSocial as cliente,
                    c.tNivelPrioridad as prioridad,
                    co.fFechaContrato as emision,
                    co.tModalidadMembresia as formula,
                    co.tAgenteVentas as os,
                    co.tNombreProyecto as proyecto,
                    co.tTipoServicio as servicios,
                    co.iCostoImplementacion as costo,
                    co.iCostoMembresia as mensualidad,
                    CASE WHEN co.lEstado = 1 THEN 'Activo' ELSE 'Inactivo' END as estado
                FROM MCLIENTES c
                LEFT JOIN MCONTRATOS co ON c.iMCliente = co.iMCliente
                ORDER BY c.iMCliente DESC
            `);
            clients = result.recordset;
        } else if (db.dbType === 'mysql') {
             const [rows] = await pool.execute(`
                SELECT 
                    c.iMCliente as id,
                    c.tNumeroDocumento as ruc,
                    c.tRazonSocial as cliente,
                    c.tNivelPrioridad as prioridad,
                    co.fFechaContrato as emision,
                    co.tModalidadMembresia as formula,
                    co.tAgenteVentas as os,
                    co.tNombreProyecto as proyecto,
                    co.tTipoServicio as servicios,
                    co.iCostoImplementacion as costo,
                    co.iCostoMembresia as mensualidad,
                    CASE WHEN co.lEstado = 1 THEN 'Activo' ELSE 'Inactivo' END as estado
                FROM MCLIENTES c
                LEFT JOIN MCONTRATOS co ON c.iMCliente = co.iMCliente
                ORDER BY c.iMCliente DESC
            `);
            clients = rows;
        }

        // Formatear fechas y datos para el frontend
        const formattedClients = clients.map((client, index) => ({
            id: client.id,
            nro: index + 1,
            cliente: client.cliente,
            ruc: client.ruc,
            emision: client.emision ? new Date(client.emision).toLocaleDateString('es-PE') : '-',
            formula: client.formula || '-',
            os: client.os || '-',
            proyecto: client.proyecto || '-',
            servicios: client.servicios || '-',
            costo: client.costo ? `S/ ${client.costo}` : 'S/ 0.00',
            mensualidad: client.mensualidad ? `S/ ${client.mensualidad}` : 'S/ 0.00',
            prioridad: client.prioridad,
            estado: client.estado
        }));

        res.json(formattedClients);
        */
    } catch (error) {
        console.error('Error obteniendo clientes:', error);
        res.status(500).json({ message: 'Error al obtener clientes' });
    }
};

const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        // Mock Response (DB Disabled)
        return res.json({ message: 'Cliente eliminado exitosamente (Mock)' });

        /*
        const pool = await db.connect();

        if (db.dbType === 'mssql') {
            const transaction = new sql.Transaction(pool);
            await transaction.begin();
            try {
                const request = new sql.Request(transaction);
                // Eliminar primero contrato (FK)
                await request.input('id', sql.Int, id).query('DELETE FROM MCONTRATOS WHERE iMCliente = @id');
                // Eliminar cliente
                await request.query('DELETE FROM MCLIENTES WHERE iMCliente = @id');
                await transaction.commit();
            } catch (err) {
                await transaction.rollback();
                throw err;
            }
        } else if (db.dbType === 'mysql') {
            const connection = await pool.getConnection();
            await connection.beginTransaction();
            try {
                await connection.execute('DELETE FROM MCONTRATOS WHERE iMCliente = ?', [id]);
                await connection.execute('DELETE FROM MCLIENTES WHERE iMCliente = ?', [id]);
                await connection.commit();
            } catch (err) {
                await connection.rollback();
                throw err;
            } finally {
                connection.release();
            }
        }

        res.json({ message: 'Cliente eliminado exitosamente' });
        */
    } catch (error) {
        console.error('Error eliminando cliente:', error);
        res.status(500).json({ message: 'Error al eliminar cliente' });
    }
};

module.exports = {
    createClient,
    getClients,
    deleteClient
};
