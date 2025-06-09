import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActaService from '../../services/ActaService';
import { FaSearch, FaFileAlt, FaUser, FaCalendarAlt, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

export default function RecentRecords() {
  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [error, setError] = useState(null);
  const [registros, setRegistros] = useState([]);

  const [actaToDelete, setActaToDelete] = useState(null);

  // Estado para las 3 últimas actas (siempre visible)
  const [recentActas, setRecentActas] = useState([]);
  
  // Estado para los resultados de búsqueda
  const [searchResults, setSearchResults] = useState([]);

  const [showNoResults, setShowNoResults] = useState(false);

  const [advancedSearchParams, setAdvancedSearchParams] = useState({
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: ""
  });

  useEffect(() => {
    const fetchUltimasActas = async () => {
      setIsLoading(true);
      try {
        const actasRecientes = await ActaService.getAllActas();
        const actasOrdenadas = actasRecientes
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .slice(0, 3);
        setRecentActas(actasOrdenadas);
      } catch (error) {
        console.error("Error al obtener las últimas actas:", error);
        setError("No se pudieron cargar las últimas actas.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUltimasActas();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "" && !showAdvancedSearch) {
      setSearchResults([]);
      setShowNoResults(false);
      return;
    }

    setIsLoading(true);
    setShowNoResults(false);
    
    const timeoutId = setTimeout(async () => {
      try {
        let resultados;
        
        if (showAdvancedSearch) {
          // Búsqueda avanzada
          resultados = await ActaService.searchByFullName({
            nombre1: advancedSearchParams.primerNombre,
            nombre2: advancedSearchParams.segundoNombre,
            apellido1: advancedSearchParams.primerApellido,
            apellido2: advancedSearchParams.segundoApellido
          });
        } else {
          // Búsqueda simple
          resultados = await ActaService.searchByName(searchTerm);
        }

        const actasUnicas = [...new Map(resultados.map(item => [item.id, item])).values()];
        const actasFormateadas = actasUnicas.map(acta => ({
          ...acta,
          // Asegurar que los nombres tengan valores por defecto
          primerNombre: acta.primerNombre || '',
          segundoNombre: acta.segundoNombre || '',
          primerApellido: acta.primerApellido || '',
          segundoApellido: acta.segundoApellido || '',
          // Crear un campo nombreCompleto para mostrar
          nombreCompleto: `${acta.primerNombre} ${acta.segundoNombre || ''} ${acta.primerApellido} ${acta.segundoApellido || ''}`
            .replace(/\s+/g, ' ')
            .trim()
        }));

        setSearchResults(actasFormateadas);
        setError(null);
        
        // Mostrar mensaje de no resultados si no hay coincidencias
        if (actasFormateadas.length === 0) {
          setShowNoResults(true);
        }
      } catch (error) {
        console.error("Error al buscar actas:", error);
        setError("Error al buscar actas. Por favor, intente de nuevo.");
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, showAdvancedSearch, advancedSearchParams]);


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const handleViewDetails = (actaId, tipo) => {
  const tipoNormalizado = tipo.toLowerCase();
  navigate(`/vistaActaDetalle/${actaId}?tipo=${tipoNormalizado}`);
};

  
  const handleViewAllRecords = () => {
    navigate('/vistaActasAdmin');
  };

  const handleEditActa = (actaId, tipoCeremonia) => {
    // convertimos el tipo a minúsculas para que coincida con lo que espera CorregirActas
    const tipoNormalizado = tipoCeremonia.toLowerCase(); 
    navigate(`/actas/editar/${actaId}/${tipoNormalizado}`);
  };

  const handleDeleteClick = (actaId) => {
    setActaToDelete(actaId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (actaToDelete !== null) {
      try {
        await ActaService.deleteActa(actaToDelete);
        // Actualizar ambos estados
        setRecentActas(prev => prev.filter(acta => acta.id !== actaToDelete));
        setSearchResults(prev => prev.filter(acta => acta.id !== actaToDelete));
      } catch (error) {
        console.error("Error al eliminar acta:", error);
        setError("No se pudo eliminar la acta. Intente nuevamente.");
      }
    }
    setShowModal(false);
    setActaToDelete(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setActaToDelete(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const actasToShow = searchTerm.trim() !== "" || showAdvancedSearch 
    ? searchResults 
    : recentActas;

  return (
    <div style={styles.container}>
      {/* Barra de búsqueda */}
      <div style={styles.searchContainer}>
        <div style={styles.searchIcon}>
          <FaSearch />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          style={styles.searchInput}
          placeholder="Buscar por nombres o apellidos..."
          autoComplete="off"
        />
      </div>

      {/* Spinner de carga */}
      {isLoading && (
        <div style={styles.loadingContainer}>
          <div className="spinner" style={styles.spinner}></div>
          <p style={styles.loadingText}>Buscando actas...</p>
          <style>{`
            @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
            }`      
          }</style>
        </div>
      )}

      {error && <p style={styles.errorText}>{error}</p>}
      
      {/* Mensaje cuando no se encuentran resultados */}
      {!isLoading && showNoResults && (
        <p style={styles.noResultsText}>
          No se encontraron actas que coincidan con "{searchTerm}"
        </p>
      )}

      <div style={styles.list}>
        {actasToShow.map(acta => (
          <div key={acta.id} style={styles.card}>
            <div style={styles.cardContent}>
              <div>
                <h3 style={styles.cardTitle}>
                  <FaFileAlt style={styles.cardIcon} />
                  {acta.tipo} - N° {acta.id}
                </h3>
                <p style={styles.cardText}>
                  <FaUser style={styles.cardIcon} />
                  {acta.nombre1} {acta.nombre2} {acta.apellido1} {acta.apellido2}
                  {acta.nombre2 ? ` ${acta.nombre2}` : ''}
                </p>
                <p style={styles.cardText}>
                  <FaCalendarAlt style={styles.cardIcon} />
                  {formatDate(acta.fecha)}
                </p>
              </div>
              <div style={styles.cardMeta}>
                <span style={styles.badge}>
                  Libro: {acta.libro} - Folio: {acta.folio} - Acta N°: {acta.id}
                </span>
                <p style={styles.cardTextSmall}>
                  Sacerdote: {acta.idSacerdote || 'No especificado'}
                </p>
                <p style={styles.cardTextSmall}>
                  Doy fe: {acta.doyFeNombre || 'No especificado'}
                </p>
              </div>
            </div>
            <div style={styles.cardActions}>
              <button 
                onClick={() => handleViewDetails(acta.id, acta.tipo)}
                style={styles.cardButton}>
                <FaEye style={styles.icon} /> Ver detalles
              </button>
              <button 
                onClick={() => handleEditActa(acta.id, acta.tipo)}
                style={{...styles.cardButton, color: '#16a34a'}} >
                <FaEdit style={{ marginRight: '5px' }} /> Editar
              </button>
              <button 
                onClick={() => handleDeleteClick(acta.id)}
                style={{...styles.cardButton, color: '#dc2626'}}
              >
                <FaTrash style={{ marginRight: '5px' }} /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleViewAllRecords}
        style={styles.viewAll}>
        Ver todas las actas
      </button>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h2 style={styles.modalTitle}>Confirmar eliminación</h2>
            <p style={styles.modalText}>
              ¿Estás seguro de que deseas eliminar la acta N° {actaToDelete}?
            </p>
            <div style={styles.modalButtons}>
              <button 
                onClick={cancelDelete} 
                style={{ ...styles.modalButton, ...styles.cancelButton }}
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete} 
                style={{ ...styles.modalButton, ...styles.confirmButton }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    padding: '0rem -0%',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: '24px'
  },
  searchIcon: {
    position: 'absolute',
    top: '55%',
    left: '12px',
    transform: 'translateY(-50%)',
    color: '#000000',
  },
  searchInput: {
    width: '100%',
    padding: '8px 12px 8px 40px',
    border: '1px solid #d1d5db',
    borderRadius: '6px'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  card: {
    borderLeft: '4px solid #3b82f6',
    backgroundColor: '#f9fafb',
    padding: '16px',
    borderRadius: '0 8px 8px 0',
    textTransform: "capitalize",
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px'
  },
  cardText: {
    color: '#4b5563',
    display: 'flex',
    alignItems: 'center',
    margin: '4px 0'
  },
  cardIcon: {
    marginRight: '8px',
    color: '#3b82f6'
  },
  icon: {
    marginRight: '5px',
    color: '#3b82f6',
    alignItems: 'center',
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  cardMeta: {
    textAlign: 'right'
  },
  badge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '4px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    display: 'inline-block'
  },
  cardTextSmall: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '8px'
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '12px'
  },
  cardButton: {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    cursor: 'pointer',
    fontSize: '14px'
  },
  viewAll: {
    display: 'block',
    margin: '24px auto 0',
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer'
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modalBox: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    textAlign: 'center'
  },
  modalTitle: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  modalText: {
    fontSize: '16px',
    marginBottom: '24px',
    color: '#000000'
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  modalButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  cancelButton: {
    backgroundColor: '#dc2626',
    color: 'white'
  },
  confirmButton: {
    backgroundColor: '#385792',
    color: 'white'
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
  },
  error: {
    textAlign: 'center',
    padding: '20px',
    color: 'red',
  },
  errorText: {
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#ffebee',
    color: '#b71c1c',
    borderRadius: '4px',
    margin: '10px 0',
  },
  noResultsText: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
    fontStyle: 'italic',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    margin: '20px 0',
  },
  spinner: {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    borderLeftColor: '#09f',
    animation: 'spin 1s linear infinite',
  },
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
  loadingText: {
    marginTop: '10px',
    color: '#555',
    fontSize: '16px',
  },
};