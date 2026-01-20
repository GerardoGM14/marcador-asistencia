import { workersData } from './workersData';

// Helper to determine group based on role (puesto)
const getGrupoByPuesto = (puesto) => {
  const p = puesto.toUpperCase();
  
  if (p.includes('DESARROLLADOR') || p.includes('PROGRAMADOR') || p.includes('TESTER') || p.includes('SOPORTE') || p.includes('ANALISTA')) {
    return 'TECNOLOGÍA';
  }
  if (p.includes('JEFE') || p.includes('GERENTE') || p.includes('ADMINISTRATIVO') || p.includes('SECRETARIA') || p.includes('RECEPCIONISTA') || p.includes('CONTADOR') || p.includes('AUXILIAR') || p.includes('LEGAL') || p.includes('RRHH')) {
    return 'ADMINISTRACIÓN';
  }
  if (p.includes('VENTAS') || p.includes('MARKETING') || p.includes('VENDEDORA') || p.includes('CAJERA') || p.includes('IMPULSADORA') || p.includes('CALL CENTER') || p.includes('ATENCIÓN') || p.includes('COMERCIAL')) {
    return 'COMERCIAL';
  }
  if (p.includes('SEGURIDAD') || p.includes('LIMPIEZA') || p.includes('ALMACENERO') || p.includes('CHOFER') || p.includes('MANTENIMIENTO') || p.includes('OPERARIO') || p.includes('ELECTRICISTA') || p.includes('GASFITERO') || p.includes('JARDINERO') || p.includes('COCINERA') || p.includes('MOZO') || p.includes('REPONEDOR')) {
    return 'OPERACIONES';
  }
  if (p.includes('ENFERMERA') || p.includes('NUTRICIONISTA') || p.includes('PREVENCIONISTA')) {
    return 'SALUD';
  }
  if (p.includes('ARQUITECTO') || p.includes('INGENIERA') || p.includes('MAESTRO') || p.includes('DISEÑADORA') || p.includes('TRADUCTOR')) {
    return 'PROFESIONALES';
  }
  
  return 'GENERAL';
};

// Helper to generate dummy email
const generateEmail = (nombres) => {
  const parts = nombres.split(',');
  if (parts.length < 2) return 'usuario@empresa.com';
  
  const apellidos = parts[0].trim().split(' ');
  const nombre = parts[1].trim().split(' ')[0];
  
  const apellidoPrincipal = apellidos[0].toLowerCase();
  const nombrePrincipal = nombre.toLowerCase();
  
  return `${nombrePrincipal}.${apellidoPrincipal}@empresa.com`;
};

// Helper to generate random recent date
const generateLastActivity = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 1000));
  return date.toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// Helper to determine role based on puesto (simplification for demo)
const getRolByPuesto = (puesto) => {
  const p = puesto.toUpperCase();
  
  if (p.includes('GERENTE') || p.includes('JEFE') || p.includes('DIRECTOR') || p.includes('ADMINISTRADOR')) {
    return 'ADMIN';
  }
  if (p.includes('SUPERVISOR') || p.includes('COORDINADOR') || p.includes('ENCARGADO') || p.includes('LIDER')) {
    return 'SUPERVISOR';
  }
  return 'MIEMBRO';
};

export const usersData = workersData.map(worker => ({
  id: worker.id,
  nombres: worker.nombres,
  email: generateEmail(worker.nombres),
  grupo: getGrupoByPuesto(worker.puesto),
  rol: getRolByPuesto(worker.puesto),
  ultimaActividad: generateLastActivity(),
  estado: worker.estado === 'BAJA' ? 'INACTIVO' : worker.estado
}));
