"use client"

import { createContext, useContext, useState } from "react"

// Crear el contexto
const ActaContext = createContext()

// Hook personalizado para usar el contexto
export const useActas = () => {
  const context = useContext(ActaContext)
  if (!context) {
    throw new Error("useActas debe ser usado dentro de un ActaProvider")
  }
  return context
}

// Proveedor del contexto
export const ActaProvider = ({ children }) => {
  // Datos de ejemplo para mostrar en la interfaz
  const datosEjemplo = [
    {
      id: 1,
      tipo: "Bautismo",
      libro: "1",
      folio: "2",
      acta: "3",
      fechaCeremonia: {
        dia: "15",
        mes: "06",
        año: "2023",
      },
      oficiante: "Padre Juan Rodríguez",
      doyFe: "María González",
      notaMarginal: "Sin notas adicionales",
      bautismo: {
        primerNombre: "Pedro",
        segundoNombre: "José",
        primerApellido: "Pérez",
        segundoApellido: "Gómez",
        fechaNacimiento: {
          dia: "10",
          mes: "05",
          año: "2023",
        },
        lugarNacimiento: "Bogotá",
        nombrePadre: "Carlos Pérez",
        nombreMadre: "María Gómez",
        abueloPaterno: "José Pérez",
        abuelaPaterna: "Ana Ruiz",
        abueloMaterno: "Pedro Gómez",
        abuelaMaterna: "Luisa Martínez",
        padrino: "Juan Pérez",
        madrina: "Ana Gómez",
      },
      fechaCreacion: new Date().toISOString(),
      confirmado: false,
    },
    {
      id: 2,
      tipo: "Confirmación",
      libro: "2",
      folio: "3",
      acta: "4",
      fechaCeremonia: {
        dia: "20",
        mes: "07",
        año: "2023",
      },
      oficiante: "Monseñor Pedro Gómez",
      doyFe: "Juan Pérez",
      notaMarginal: "Primera comunión realizada el 15/05/2020",
      confirmacion: {
        primerNombre: "Ana",
        segundoNombre: "María",
        primerApellido: "Rodríguez",
        segundoApellido: "López",
        fechaNacimiento: {
          dia: "05",
          mes: "03",
          año: "2010",
        },
        lugarNacimiento: "Medellín",
        nombrePadre: "Roberto Rodríguez",
        nombreMadre: "Carmen López",
        padrino: "Luis Rodríguez",
        madrina: "Patricia López",
        monseñor: "Monseñor Pedro Gómez",
        sacerdote: "Padre Antonio López",
        doyFe: "Juan Pérez",
      },
      fechaCreacion: new Date().toISOString(),
      confirmado: false,
    },
    {
      id: 3,
      tipo: "Matrimonio",
      libro: "3",
      folio: "4",
      acta: "5",
      fechaCeremonia: {
        dia: "10",
        mes: "09",
        año: "2023",
      },
      oficiante: "Padre Miguel Ángel Pérez",
      doyFe: "Ana Rodríguez",
      notaMarginal: "Matrimonio civil previo realizado el 05/09/2023",
      matrimonio: {
        novio: {
          primerNombre: "Carlos",
          segundoNombre: "Alberto",
          primerApellido: "Sánchez",
          segundoApellido: "Martínez",
          fechaNacimiento: {
            dia: "15",
            mes: "04",
            año: "1990",
          },
          lugarNacimiento: "Cali",
          nombrePadre: "Alberto Sánchez",
          nombreMadre: "Laura Martínez",
        },
        novia: {
          primerNombre: "Laura",
          segundoNombre: "Patricia",
          primerApellido: "Gómez",
          segundoApellido: "Hernández",
          fechaNacimiento: {
            dia: "20",
            mes: "06",
            año: "1992",
          },
          lugarNacimiento: "Bogotá",
          nombrePadre: "Ricardo Gómez",
          nombreMadre: "Patricia Hernández",
        },
        testigo1: "Juan Pérez",
        testigo2: "María González",
        testigo3: "Roberto Rodríguez",
        testigo4: "Ana López",
      },
      fechaCreacion: new Date().toISOString(),
      confirmado: false,
    },
  ]

  // Estado para las actas temporales (no guardadas en la base de datos)
  const [actasTemporales, setActasTemporales] = useState(datosEjemplo)

  // Estado para las actas confirmadas (listas para guardar en la base de datos)
  const [actasConfirmadas, setActasConfirmadas] = useState([])

  // Estado para el acta que se está editando actualmente
  const [actaEditando, setActaEditando] = useState(null)

  // Estado para indicar que estamos en modo edición
  const [modoEdicion, setModoEdicion] = useState(false)

  // Función para agregar un acta temporal
  const agregarActaTemporal = (acta) => {
    setActasTemporales((prev) => [...prev, acta])
  }

  // Función para confirmar actas (moverlas de temporales a confirmadas)
  const confirmarActas = (idsActas) => {
    const actasOrdenadas = idsActas
      .map(id => actasTemporales.find(acta => acta.id === id))
      .filter(acta => acta !== undefined);
  
    setActasConfirmadas(prev => [
      ...actasOrdenadas.map(a => ({ 
        ...a, 
        confirmado: true,
        fechaConfirmacion: new Date().toISOString()
      })),
      ...prev
    ]);
  
    setActasTemporales(prev => 
      prev.filter(acta => !idsActas.includes(acta.id))
    );
  };
  
  // Función para eliminar actas temporales
  const eliminarActasTemporales = (idsActas) => {
    setActasTemporales((prev) => prev.filter((acta) => !idsActas.includes(acta.id)))
  }

  // Función para editar un acta temporal
  const editarActaTemporal = (id) => {
    const acta = actasTemporales.find((a) => a.id === id)
    if (acta) {
      // Crear una copia profunda del acta para evitar problemas de referencia
      const actaCopia = JSON.parse(JSON.stringify(acta))
      console.log("Estableciendo acta para editar:", actaCopia)
      setActaEditando(actaCopia)
      setModoEdicion(true) // Activar el modo edición
    } else {
      console.error("No se encontró el acta con ID:", id)
    }
  }

  // Función para actualizar un acta temporal
  const actualizarActaTemporal = (actaActualizada) => {
    setActasTemporales((prev) => prev.map((acta) => (acta.id === actaActualizada.id ? actaActualizada : acta)))
    setActaEditando(null)
    setModoEdicion(false) // Desactivar el modo edición
  }

  // Función para cancelar la edición
  const cancelarEdicion = () => {
    setActaEditando(null)
    setModoEdicion(false)
  }

  // Valores que se proporcionarán a través del contexto
  const value = {
    actasTemporales,
    setActasTemporales,
    actasConfirmadas,
    setActasConfirmadas,
    actaEditando,
    setActaEditando,
    modoEdicion,
    setModoEdicion,
    agregarActaTemporal,
    confirmarActas,
    eliminarActasTemporales,
    editarActaTemporal,
    actualizarActaTemporal,
    cancelarEdicion,
  }

  return <ActaContext.Provider value={value}>{children}</ActaContext.Provider>
}
