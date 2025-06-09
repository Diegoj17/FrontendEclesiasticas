import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TablaUsuarios from './TablaUsuarios';
import { FaPlus, FaSearch } from 'react-icons/fa';

export default function UserManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showPending, setShowPending] = useState(true);

  // Función para añadir nuevo usuario
  const handleAddUser = () => {
    navigate('/crearUsuarios', { state: { isEditing: false } });
  };

  return (
    <div style={styles.container}>
        
        <div style={styles.searchContainer}>
          <div style={styles.searchIcon}>
            <FaSearch />
          </div>
          <input
            type="text"
            placeholder="Buscar usuarios..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div style={styles.filter}>
            <label style={styles.filterLabel}>Mostrar pendientes:</label>
            <input
              type="checkbox"
              checked={showPending}
              onChange={() => setShowPending(!showPending)}
              style={styles.checkbox}
            />
          </div>
        </div>

      
      <TablaUsuarios searchTerm={searchTerm} showPending={showPending} />
      
      <button 
        onClick={handleAddUser}
        style={styles.addButton}
      >
        <FaPlus style={styles.plusIcon} />
        <span>Añadir Nuevo Usuario</span>
      </button>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '0.5rem 0%',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    alignItems: 'center',
    marginBottom: '0.5rem',
    gap: '1rem',
  },
  searchIcon: {
    position: 'absolute',
    top: '45%',
    left: '12px',
    transform: 'translateY(-50%)',
    color: '#000000',
  },
  searchInput: {
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    padding: '0.5rem 0.5rem 0.5rem 2.5rem',
    flex: '1',
    maxWidth: '400px',
    marginBottom: '0.5rem',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    ':focus': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    }

  },
  filter: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  filterLabel: {
    fontSize: '14px',
    color: '#4b5563'
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: '#3b82f6',
    cursor: 'pointer'
  },
  addButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '10px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '24px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#2563eb'
    }
  },
  plusIcon: {
    fontSize: '14px'
  }
};