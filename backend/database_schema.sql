/* 
========================================================================
   SCRIPT SQL SERVER (T-SQL)
========================================================================
*/

-- Tabla Maestra de Clientes
CREATE TABLE MCLIENTES (
    iMCliente INT IDENTITY(1,1) PRIMARY KEY,
    tTipoDocumento VARCHAR(20) NOT NULL,
    tNumeroDocumento VARCHAR(20) NOT NULL UNIQUE,
    tRazonSocial VARCHAR(200) NOT NULL,
    tRubro VARCHAR(100),
    tCategoria VARCHAR(50),
    tCanalCaptacion VARCHAR(100),
    tNivelPrioridad VARCHAR(20),
    tDireccionFiscal VARCHAR(255),
    tCiudad VARCHAR(100),
    tContactoNombre VARCHAR(150),
    tContactoCargo VARCHAR(100),
    tContactoTelefono VARCHAR(50),
    tContactoEmail VARCHAR(150)
);

-- Tabla Maestra de Contratos
CREATE TABLE MCONTRATOS (
    iMContrato INT IDENTITY(1,1) PRIMARY KEY,
    iMCliente INT NOT NULL,
    tAgenteVentas VARCHAR(150),
    tTipoServicio VARCHAR(50),
    tNombreProyecto VARCHAR(200),
    tCentroCosto VARCHAR(50),
    tPlanSuscripcion VARCHAR(50),
    tDireccionServicio VARCHAR(255),
    fFechaContrato DATE,
    fFechaCapacitacion DATE,
    fFechaEntrega DATE,
    tTipoMoneda CHAR(1), -- 'S' o 'D'
    iCostoImplementacion DECIMAL(10, 2),
    tModalidadMembresia VARCHAR(50),
    iCostoMembresia DECIMAL(10, 2),
    fInicioMembresia DATE,
    fFinMembresia DATE,
    lAplicaIGV BIT DEFAULT 0,
    tObservaciones NVARCHAR(MAX),
    tURLDocumentacion VARCHAR(500),
    lEstado BIT DEFAULT 1,
    FOREIGN KEY (iMCliente) REFERENCES MCLIENTES(iMCliente)
);
GO

/* 
========================================================================
   SCRIPT MYSQL
========================================================================
*/

-- Tabla Maestra de Clientes
CREATE TABLE MCLIENTES (
    iMCliente INT AUTO_INCREMENT PRIMARY KEY,
    tTipoDocumento VARCHAR(20) NOT NULL,
    tNumeroDocumento VARCHAR(20) NOT NULL UNIQUE,
    tRazonSocial VARCHAR(200) NOT NULL,
    tRubro VARCHAR(100),
    tCategoria VARCHAR(50),
    tCanalCaptacion VARCHAR(100),
    tNivelPrioridad VARCHAR(20),
    tDireccionFiscal VARCHAR(255),
    tCiudad VARCHAR(100),
    tContactoNombre VARCHAR(150),
    tContactoCargo VARCHAR(100),
    tContactoTelefono VARCHAR(50),
    tContactoEmail VARCHAR(150)
);

-- Tabla Maestra de Contratos
CREATE TABLE MCONTRATOS (
    iMContrato INT AUTO_INCREMENT PRIMARY KEY,
    iMCliente INT NOT NULL,
    tAgenteVentas VARCHAR(150),
    tTipoServicio VARCHAR(50),
    tNombreProyecto VARCHAR(200),
    tCentroCosto VARCHAR(50),
    tPlanSuscripcion VARCHAR(50),
    tDireccionServicio VARCHAR(255),
    fFechaContrato DATE,
    fFechaCapacitacion DATE,
    fFechaEntrega DATE,
    tTipoMoneda CHAR(1),
    iCostoImplementacion DECIMAL(10, 2),
    tModalidadMembresia VARCHAR(50),
    iCostoMembresia DECIMAL(10, 2),
    fInicioMembresia DATE,
    fFinMembresia DATE,
    lAplicaIGV BOOLEAN DEFAULT FALSE,
    tObservaciones TEXT,
    tURLDocumentacion VARCHAR(500),
    lEstado BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (iMCliente) REFERENCES MCLIENTES(iMCliente)
);
