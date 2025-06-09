import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaUserEdit, FaTrash, FaUserClock } from 'react-icons/fa';

export default function UserTable({ searchTerm, showPending }) {

  const navigate = useNavigate();
  // Datos de ejemplo (deberían venir de una API)
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan@iglesia.com",
      role: "secretario",
      status: "active",
      registrationDate: "2023-01-15"
    },
    {
      id: 2,
      name: "María García",
      email: "maria@iglesia.com",
      role: "admin",
      status: "active",
      registrationDate: "2023-02-20"
    },
    {
      id: 3,
      name: "Carlos López",
      email: "carlos@iglesia.com",
      role: "usuario",
      status: "pending",
      registrationDate: "2023-05-10"
    },
    {
      id: 4,
      name: "Ana Martínez",
      email: "ana@iglesia.com",
      role: "sacerdote",
      status: "inactive",
      registrationDate: "2023-03-05"
    }
  ]);

  // Función para aprobar usuario
  const approveUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: "active" } : user
    ));
  };

  // Función para rechazar usuario
  const rejectUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  // Función para editar usuario
  const handleEditUser = (user) => {
  navigate('/crearUsuarios', { 
    state: { 
      userToEdit: user,
      isEditing: true 
    } 
  });
};

  // Función para eliminar usuario
  const deleteUser = (userId) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  // Filtrar usuarios según búsqueda y estado
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showPending ? user.status === "pending" : true;
    return matchesSearch && matchesStatus;
  });

  // Estilos para los estados
  const getStatusStyle = (status) => {
    switch(status) {
      case "active":
        return { backgroundColor: "#dcfce7", color: "#166534" };
      case "pending":
        return { backgroundColor: "#fef9c3", color: "#854d0e" };
      case "inactive":
        return { backgroundColor: "#fee2e2", color: "#b91c1c" };
      default:
        return { backgroundColor: "#e5e7eb", color: "#374151" };
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.header}>Nombre</th>
            <th style={styles.header}>Email</th>
            <th style={styles.header}>Rol</th>
            <th style={styles.header}>Estado</th>
            <th style={styles.header}>Registro</th>
            <th style={styles.header}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <tr key={user.id} style={styles.row}>
                <td style={styles.cell}>{user.name}</td>
                <td style={styles.cell}>{user.email}</td>
                <td style={styles.cell}>
                  <span style={{ textTransform: 'capitalize' }}>
                    {user.role}
                  </span>
                </td>
                <td style={styles.cell}>
                  <span style={{
                    ...styles.status,
                    ...getStatusStyle(user.status)
                  }}>
                    {user.status === "active" ? "Activo" : 
                    user.status === "pending" ? "Pendiente" : "Inactivo"}
                  </span>
                </td>
                <td style={styles.cell}>
                  {formatDate(user.registrationDate)}
                </td>
                <td style={styles.cell}>
                  <div style={styles.actions}>
                    {user.status === "pending" && (
                      <>
                        <button 
                          onClick={() => approveUser(user.id)}
                          style={styles.iconButton}
                          title="Aprobar usuario"
                        >
                          <FaCheck color="#16a34a" />
                        </button>
                        <button 
                          onClick={() => rejectUser(user.id)}
                          style={styles.iconButton}
                          title="Rechazar usuario"
                        >
                          <FaTimes color="#ef4444" />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleEditUser(user)}
                      style={styles.iconButton}
                      title="Editar usuario"
                    >
                      <FaUserEdit color="#3b82f6" />
                    </button>
                    <button 
                      onClick={() => deleteUser(user.id)}
                      style={styles.iconButton}
                      title="Eliminar usuario"
                    >
                      <FaTrash color="#dc2626" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={styles.noResults}>
                <div style={styles.noResultsContent}>
                  <FaUserClock size={24} />
                  <p>No se encontraron usuarios</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white'
  },
  header: {
    padding: '12px 16px',
    textAlign: 'left',
    backgroundColor: '#f9fafb',
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px',
    borderBottom: '1px solid #e5e7eb'
  },
  row: {
    borderBottom: '1px solid #e5e7eb',
    ':hover': {
      backgroundColor: '#f9fafb'
    }
  },
  cell: {
    padding: '12px 16px',
    color: '#4b5563',
    fontSize: '14px'
  },
  status: {
    padding: '4px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500',
    display: 'inline-block'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px',
    borderRadius: '4px',
    ':hover': {
      backgroundColor: '#f3f4f6'
    }
  },
  noResults: {
    padding: '40px 16px',
    textAlign: 'center'
  },
  noResultsContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    color: '#6b7280'
  }
};