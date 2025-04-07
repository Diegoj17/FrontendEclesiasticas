import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "./logo.png";
import axios from 'axios';
import { FaExclamationCircle } from 'react-icons/fa';

function CrearCuenta() {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex más preciso
    const isValid = emailRegex.test(email);
    setErrors(prev => ({...prev, email: !isValid}));
    return isValid;
  };

  const validatePassword = (pass) => {
    const errors = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      number: /\d/.test(pass),
      specialChar: /[\W_]/.test(pass)
    };
    
    const isValid = Object.values(errors).every(v => v);
    setPasswordErrors(errors);
    setErrors(prev => ({...prev, password: !isValid}));
    
    return isValid;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      setTouched({
        email: true,
        password: true
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://eclesiasticasbackend.onrender.com/api/auth/register",
        {
          email,
          password,
          nombre: name,
          apellido: lastname
        }
      );

      
      
      setShowSuccessModal(true);
    } catch (error) {
      alert("Error: " + (error.response?.data || error.message));
    }
  };

  const handleCancel = () => {
    navigate('/'); // Redirige al inicio de sesión al cancelar
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.logoContainer}>
          <img src={logo || "/placeholder.svg"} alt="Logo" style={styles.logo} />
        </div>
        <div style={styles.card}>
          <h2 style={styles.title}>Crear Cuenta</h2>
          <p style={styles.description}>
            Ingresa los datos para crear la cuenta.
          </p>
          <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.rowContainer}>
            <div style={{...styles.formGroup, flex: 1, marginRight: '15px'}}>
              <label htmlFor="name" style={styles.label}>Nombre</label>
              <input
                type="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={{...styles.formGroup, flex: 1, marginRight: '15px'}}>
              <label htmlFor="email" style={styles.label}>Apellido</label>
              <input
                type="lastname"
                id="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Correo Electrónico</label>
              <div style={styles.inputWrapper}>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touched.email) validateEmail(e.target.value);
                }}
                onBlur={() => {
                  setTouched(prev => ({...prev, email: true}));
                  validateEmail(email);
                }}
                style={{
                  ...styles.input,
                  borderColor: errors.email && touched.email ? '#e74c3c' : '#ddd',
                  paddingRight: '35px'
                }}
                required
              />
              {errors.email && touched.email && (
                <FaExclamationCircle
                  style={styles.errorIcon}
                  color="#e74c3c"
                />
              )}
            </div>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Contraseña</label>
            <div style={styles.inputWrapper}>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              onBlur={() => handleBlur('password')}
              style={{
                ...styles.input,
              borderColor: errors.password && touched.password ? '#e74c3c' : '#ddd',
              paddingRight: '35px'
              }}
              required
            />
            {errors.password && touched.password && (
            <FaExclamationCircle
              style={styles.errorIcon}
              color="#e74c3c"
            />
            )}
      </div>
        <div style={styles.passwordRequirements}>
          <p style={styles.requirementTitle}>La contraseña debe contener:</p>
          <ul style={styles.requirementList}>
            <li style={{color: passwordErrors.length ? '#2ecc71' : '#e74c3c'}}>
              • Mínimo 6 caracteres
            </li>
            <li style={{color: passwordErrors.uppercase ? '#2ecc71' : '#e74c3c'}}>
              • Al menos una mayúscula
            </li>
            <li style={{color: passwordErrors.number ? '#2ecc71' : '#e74c3c'}}>
              • Al menos un número
            </li>
            <li style={{color: passwordErrors.specialChar ? '#2ecc71' : '#e74c3c'}}>
              • Un carácter especial (!@#$%^&*)
            </li>
          </ul>
        </div>
      </div>
            <div style={styles.buttonContainer}>
              <button type="button" style={styles.cancelButton} onClick={handleCancel}>
                Cancelar
              </button>
              <button type="submit" style={styles.submitButton}>
                Crear Cuenta
              </button>
            </div>
            </form>
          </div>
        </div>

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Cuenta Creada Exitosamente</h3>
            <p>Tu cuenta ha sido creada correctamente.</p>
            <button
              style={styles.modalButton}
              onClick={closeModal}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>

  );
}
const styles = {
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#385792',
    padding: '20px',
    boxSizing: 'border-box',
    padding: '20px 0 0 0',
    cursor: 'default',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '400px',
    width: '100%',
    gap: '20px',
  },
  logoContainer: {
    marginBottom: '0.5rem',
    display: 'flex',
    justifyContent: 'center',
  },
  logo: {
    width: '200px',
    height: 'auto',
    objectFit: 'contain',
    transition: 'all 0.3s ease',
  },
  rowContainer: {
    display: 'flex',
    gap: '0rem',
    marginBottom: '0.5rem',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '0',
      marginBottom: '8px'
    }
  },
  card: {
    backgroundColor: 'white',
    padding: '25px 30px',
    borderRadius: '0.7rem',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '0.5rem',
    margin: '0 0 8px 0',
    textAlign: 'center',
  },
  description: {
    fontSize: '1rem',
    margin: '0 0 20px 0',
    textAlign: 'center',

    marginBottom: '1.5rem',
    color: '#000000',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '15px',
  },
  formGroup: {
    marginBottom: '0.5rem',
  },
  label: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    display: 'block',
    textAlign: 'left',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease-in-out'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    marginTop: '1rem',
  },
  cancelButton: {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#FCCE74',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1,
  },
  submitButton: {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#FCCE74',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
  },
  modalButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '15px',
  },
  passwordRequirements: {
    margin: '15px 0',
    padding: '10px',
    marginBottom: '0px',
    backgroundColor: '#FFB1B5',
    borderRadius: '5px',
  },
  requirementTitle: {
    fontSize: '0.9rem',
    color: '#555',
    padding: '0 0 5px 0',
    margin: 0,
    marginBottom: '5px',
  },
  requirementList: {
    listStyleType: 'none',
    paddingLeft: '15px',
    margin: 0,
    fontSize: '0.9rem',
    marginBottom: '5px',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%'
  },
  errorIcon: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.2rem'
  },
  errorText: {
    color: '#e74c3c',
    fontSize: '0.8rem',
    display: 'block'
  },
};

export default CrearCuenta;