"use client"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "../components/layout/Header"
import BautismoForm from "../components/forms/BautismoForm"
import ConfirmacionForm from "../components/forms/ConfirmacionForm"
import MatrimonioForm from "../components/forms/MatrimonioForm"
import CommonRegistroSection from "../components/forms/CommonRegistroSection"
import ActaService from "../services/ActaService"

function EditarActa() {
  const { id, tipo } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)

  // Cargar datos del acta
  useEffect(() => {
    const fetchActa = async () => {
      try {
        let data
        switch (tipo.toLowerCase()) {
          case 'bautismo':
            data = await ActaService.getBautizoById(id)
            break
          case 'confirmacion':
            data = await ActaService.getConfirmacionById(id)
            break
          case 'matrimonio':
            data = await ActaService.getMatrimonioById(id)
            break
          default:
            throw new Error('Tipo de acta no válido')
        }
        setFormData(data)
      } catch (error) {
        console.error('Error cargando acta:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchActa()
  }, [id, tipo])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Lógica para guardar los cambios
      await ActaService.updateActa(tipo, id, formData)
      navigate(-1) // Volver atrás después de guardar
    } catch (error) {
      console.error('Error guardando acta:', error)
    }
  }

  return (
    <div>
      <Header title={`Editar Acta de ${tipo}`} />
      
      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Atrás
        </button>

        {!loading && (
          <form onSubmit={handleSubmit}>
            {tipo === 'bautismo' && (
              <BautismoForm 
                formData={formData} 
                handleChange={handleChange} 
                ciudadesColombia={[]} 
              />
            )}
            
            {tipo === 'confirmacion' && (
              <ConfirmacionForm 
                formData={formData} 
                handleChange={handleChange} 
                ciudadesColombia={[]} 
              />
            )}
            
            {tipo === 'matrimonio' && (
              <MatrimonioForm 
                formData={formData} 
                handleChange={handleChange} 
                ciudadesColombia={[]} 
              />
            )}
            
            <CommonRegistroSection 
              formData={formData} 
              handleChange={handleChange} 
            />
            
            <button type="submit" style={styles.saveButton}>
              Guardar Cambios
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '1rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  backButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#385792',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '1rem'
  },
  saveButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem'
  }
}

export default EditarActa