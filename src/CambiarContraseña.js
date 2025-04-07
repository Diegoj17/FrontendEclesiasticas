import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function CambiarContraseña() {
  const { changePassword } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await changePassword(formData.currentPassword, formData.newPassword);
      navigate('/principal');
    } catch (error) {
      setError(error.message || 'Error al cambiar la contraseña');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Cambiar Contraseña</h2>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Contraseña actual:</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label>Nueva contraseña:</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label>Confirmar nueva contraseña:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Cambiar Contraseña</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '2rem auto',
    padding: '1rem',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  }
};

export default CambiarContraseña;