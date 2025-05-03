import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from "primereact/column"
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Tag } from 'primereact/tag';

const CustomDataTable = ({ 
  registrosFiltrados, 
  filters, 
  onFilter,  
  selectedRow, 
  onSelectionChange,
  expandedRowTemplate
}) => {
  
  const getEventoColor = (ceremonia) => {
    switch(ceremonia) {
      case 'Bautismo': return '#B3E5FC';
      case 'Confirmacion': return '#F6DC43';
      case 'Matrimonio': return '#F2B28C';
      default: return null;
    }
  }
  

  return (
    <div className="card" style={styles.tableContainer}>
      <div className="card" style={{ flex: 1, minHeight: 0 }}>
        <DataTable
          value={registrosFiltrados}
          showGridlines
          sortMode="multiple"
          scrollable
          scrollHeight="flex"
          style={{ flex: 1, minHeight: 0 }}
          filters={filters}
          onFilter={onFilter}
          getEventoColor={getEventoColor}
          emptyMessage="No se encontraron actas."
          tableStyle={styles.tabla}
        >
          <Column 
            field="id"
            header="ID" 
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla}
            sortable 
            style={{ width: "5%" }} 
            />
          <Column 
            field="primerNombre" 
            header="Primer Nombre"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla} 
            sortable 
            style={{ width: "20%" }} />
          <Column
            field="segundoNombre" 
            header="Segundo Nombre"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla} 
            sortable 
            style={{ width: "20%" }} />
          <Column 
            field="primerApellido" 
            header="Primer Apellido" 
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla}
            sortable 
            style={{ width: "20%" }} />
          <Column 
            field="segundoApellido" 
            header="Segundo Apellido"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla} 
            sortable 
            style={{ width: "20%" }} />
          <Column 
            field="libro" 
            header="Libro"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla} 
            sortable 
            style={{ width: "7%" }} />
          <Column
            field="folio" 
            header="Folio"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla} 
            sortable 
            style={{ width: "7%" }} />
          <Column 
            field="acta" 
            header="Acta"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla} 
            sortable 
            style={{ width: "7%" }} 
            />
          <Column
            field="ceremonia"
            header="Ceremonia"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla}
            body={(rowData) => (
              <div style={{
                backgroundColor: getEventoColor(rowData.ceremonia),
                padding: '4px 8px',
                borderRadius: '4px'
              }}>
                {rowData.ceremonia}
              </div>
            )}
            sortable
            style={{ width: "20%" }}
          />
          <Column 
            field="fechaCeremonia" 
            header="Fecha Ceremonia"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla} 
            sortable 
            style={{ width: "20%" }} 
            />
          <Column
            field="monseñor"
            header="Monseñor"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla}
            sortable
            style={{ width: "20%" }}
            />
          <Column
            field="sacerdote"
            header="Sacerdote"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla}
            sortable
            style={{ width: "20%" }}
            />
          <Column
            field="fechaNacimiento"
            header="Fecha Nacimiento"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla}
            sortable
            style={{ width: "20%" }}
            />
          <Column
            field="lugarNacimiento"
            header="Lugar Nacimiento"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla}
            sortable
            style={{ width: "20%" }}
            />
          <Column
            field="padre"
            header="Padre"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla}
            sortable
            style={{ width: "20%" }}
            />
          <Column
            field="madre"
            header="Madre"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla}
            sortable
            style={{ width: "20%" }}
            />
          <Column
            field="abueloPaterno"
            header="Abuelo Paterno"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla}
            sortable
            style={{ width: "20%" }}
            />
          <Column
            field="abuelaPaterna"
            header="Abuela Paterna"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla}
            sortable
            style={{ width: "20%" }}
            />
          <Column
            field="abueloMaterno"
            header="Abuelo Materno"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla}
            sortable
            style={{ width: "20%" }}
            />
          <Column
            field="abuelaMaterna"
            header="Abuela Materna"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla}
            sortable
            style={{ width: "20%" }}
            />
          <Column
            field="padrino"
            header="Padrino"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla}
            sortable
            style={{ width: "20%" }}
            />
          <Column
            field="madrina"
            header="Madrina"
            headerStyle={styles.columnaTabla}
            bodyStyle={styles.filaTabla}
            sortable
            style={{ width: "20%" }}
            />
        </DataTable>
      </div>
      </div>
    );
  }


const styles = {
  tableContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
  },
  tabla: {
    width: "100%",
    backgroundColor: '#FCCE74',
    border: '1px solid #000000',
    fontWeight: '600',
    fontSize: '1rem',
    marginBottom: "0.5rem",
    color: 'black',
    overflow: "auto",
    overflowX: "auto",
    overflowY: "auto",
    textAlign: 'center',
    padding: '0.5rem 1.5rem',
    minWidth: "50px",
    whiteSpace: "nowrap",
    cursor: "default",
    borderRadius: "0.5rem",
  },
  columnaTabla: {
    backgroundColor: '#FCCE74',
    border: '1px solid #000000',
    fontWeight: '600',
    fontSize: '1rem',
    color: 'black',
    textAlign: 'center',
    padding: '0.5rem 1rem',
    minWidth: "50px",
    whiteSpace: "nowrap",
    cursor: "pointer",
  },
  filaTabla: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #000000',
    fontWeight: '600',
    fontSize: '0.9rem',
    color: 'black',
    textAlign: 'center',
    padding: '0.5rem 1rem',
    minWidth: "50px",
    whiteSpace: "nowrap",
    cursor: "default",
    
  },
};

export default CustomDataTable