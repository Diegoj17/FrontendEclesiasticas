import React, { Component, useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from "primereact/column"
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const DataTableExpandle = ({
  registrosFiltrados, 
  filters, 
  onFilter, 
  selectedRow, 
  setSelectedRow,
  expandedRowTemplate,
  tipoSeleccionado
  }) => {
  const [expandedRows, setExpandedRows] = useState({})

  useEffect(() => {
    // Resetear las filas expandidas cuando cambia el tipo de ceremonia
    setExpandedRows({})
  }, [tipoSeleccionado])
  
  const capitalize = s => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';

  const getEventoColor = (ceremonia) => {
    switch(ceremonia) {
      case 'Bautismo': return '#B3E5FC';
      case 'Confirmacion': return '#F6DC43';
      case 'Matrimonio': return '#F2B28C';
      default: return null;
    }
  };

  const onRowClick = (e) => {
    const id = e.data.id;
    const currentlyExpanded = expandedRows[id] === true;
    setExpandedRows(currentlyExpanded ? {} : { [id]: true });
    // también seleccionamos la fila para resaltar
    if (typeof setSelectedRow === "function") {
      setSelectedRow(e.data)
    }
  };


  return (
    <div style={styles.tableContainer}>
      <DataTable
        value={registrosFiltrados}
        dataKey="id"
        header={null}
        showGridlines
        sortMode="multiple"
        scrollable
        scrollHeight="flex"
        responsiveLayout="scroll"
        style={{ flex: 1, minHeight: 0 }}
        filters={filters}
        onFilter={onFilter}
        getEventoColor={getEventoColor}
        //Seleccion de fila
        selectionMode="single"
        selection={selectedRow}
        onSelectionChange={e => setSelectedRow(e.value)}
        onRowClick={onRowClick}
        emptyMessage="No se encontraron actas."
        tableStyle={styles.tabla}
        // Control de expansión personalizado
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={(rowData) => expandedRowTemplate(rowData)}
        // Resalta fila seleccionada
        rowClassName={data => data.id === selectedRow?.id ? 'p-highlight' : ''}
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
          body={(rowData) => capitalize(rowData.primerNombre)}
          sortable
          style={{ width: "20%" }}
        />
        <Column
          field="segundoNombre"
          header="Segundo Nombre"
          headerStyle={styles.columnaTabla}
          bodyStyle={styles.filaTabla}
          body={(rowData) => capitalize(rowData.segundoNombre)}
          sortable
          style={{ width: "20%" }}
        />
        <Column
          field="primerApellido"
          header="Primer Apellido"
          headerStyle={styles.columnaTabla}
          bodyStyle={styles.filaTabla}
          body={(rowData) => capitalize(rowData.primerApellido)}
          sortable
          style={{ width: "20%" }}
        />
        <Column
          field="segundoApellido"
          header="Segundo Apellido"
          headerStyle={styles.columnaTabla}
          bodyStyle={styles.filaTabla}
          body={(rowData) => capitalize(rowData.segundoApellido)}
          sortable
          style={{ width: "20%" }}
        />
        <Column
          field="libro"
          header="Libro"
          headerStyle={styles.columnaTabla}
          bodyStyle={styles.filaTabla}
          sortable
          style={{ width: "7%" }}
        />
        <Column
          field="folio"
          header="Folio"
          headerStyle={styles.columnaTabla}
          bodyStyle={styles.filaTabla}
          sortable
          style={{ width: "7%" }}
        />
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
            <div
              style={{
                backgroundColor: getEventoColor(rowData.ceremonia),
                padding: '4px 8px',
                borderRadius: '4px'
              }}
            >
              {rowData.ceremonia}
            </div>
          )}
          sortable
          style={{ width: "20%" }}
        />
      </DataTable>
    </div>
  )
}

const styles = {
  tableContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    backgroundColor: '#FFFFFF',
    },
    tabla: {
      width: "100%",
      backgroundColor: '#FFFFFF',
      border: '1px solid #000000',
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
      '& .p-highlight': {
      backgroundColor: '#f0f0f0 !important',
      transition: 'background-color 0.2s'
    }
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
      cursor: "pointer",
      
    },
  };
  
  export default DataTableExpandle