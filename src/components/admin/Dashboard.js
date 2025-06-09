import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TarjetasEstadisticas from './TarjetasEstadisticas';
import ActasRecientes from './ActasRecientes';
import UserManagement from './GestionUsuarios';
import HeaderAdmin from '../layout/HeaderAdmin';
import ActaService from '../../services/ActaService';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('');
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo (deberían venir de tu API)
  const [stats, setStats] = useState({
    totalActas: 0,
    bautizos: 0,
    matrimonios: 0,
    confirmaciones: 0,
    defunciones: 0
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Obtener todas las actas
      const allActas = await ActaService.getAllActas();
      
      // Contar por tipo
      const counts = {
        totalActas: allActas.length,
        bautizos: allActas.filter(acta => 
          acta.tipo && acta.tipo.toLowerCase().includes('baut')
        ).length,
        confirmaciones: allActas.filter(acta => 
          acta.tipo && acta.tipo.toLowerCase().includes('confirm')
        ).length,
        matrimonios: allActas.filter(acta => 
          acta.tipo && acta.tipo.toLowerCase().includes('matri')
        ).length,
      };

      setStats(counts);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
  fetchStats();
  
  const interval = setInterval(fetchStats, 300000); // Actualizar cada 5 minutos
  
  return () => clearInterval(interval);
}, []);

  const handleNewActa = () => {
    navigate('/crearActas');
  };

  const handleViewAllRecords = () => {
    navigate('/listaActas');
  };


  return (
    <div style={styles.container}>

      {/* Barra superior */}
      <HeaderAdmin title= "Panel de Administración"/>

    <div style={styles.mainContent}>
      <main style={styles.content}>
      <h1 style={styles.title}>Bienvenido/a, {user.displayName}</h1>
      
      <div style={styles.statsContainer}>
        <TarjetasEstadisticas 
          title="Total de Actas" 
          value={stats.totalActas} 
          icon="📋"
          color="#dbeafe"
        />
        <TarjetasEstadisticas 
          title="Bautizos" 
          value={stats.bautizos} 
          icon="🕊️"
          color="#dcfce7"
        />
        <TarjetasEstadisticas 
          title="Confirmaciones" 
          value={stats.confirmaciones} 
          icon="✝️"
          color="#ede9fe"
        />
        <TarjetasEstadisticas 
          title="Matrimonios" 
          value={stats.matrimonios} 
          icon="💍"
          color="#fce7f3"
        />
        
      </div>

      <div style={styles.gridActas}>
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Últimas Actas Registradas</h2>
        <ActasRecientes />
      </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Gestión de Usuarios</h2>
          <UserManagement />
        </div>
        
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Acciones Rápidas</h2>
          <div style={styles.actions}>
            <button 
              onClick={handleNewActa}
              style={styles.actionButton}
              >
              Registrar Nueva Acta
            </button>

            <button style={{...styles.actionButton, backgroundColor: '#10b981'}}>
              Generar Reporte
            </button>

            <button style={{...styles.actionButton, backgroundColor: '#ef4444'}}>
              Gestionar Sacramentos
            </button>
          </div>
        </div>
      </div>
      </main>
    </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "auto",
    cursor: 'default',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box'
  },
  content: {
    flex: 1,
    overflow: "auto",
    height: "calc(100vh - 70px)",
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    padding: '1rem 1%',
    marginTop: '-0rem',
    color: '#000000'
  },
  statsContainer: {
    display: 'grid',
    padding: '1rem 1%',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '0.5rem',
    marginTop: '-1rem'
    
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: "1px solid #000000",
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '1rem 1.5%',
    marginTop: '-1rem',
    marginBottom: '1rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '0.8rem',
    marginTop: '0rem',
    color: '#000000'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    padding: '1rem 1%',
    marginTop: '-1.5rem',
    marginBottom: '1rem'
  },
  gridActas: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
    padding: '1rem 1%',
    marginBottom: '1rem'
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2rem'
  }
};