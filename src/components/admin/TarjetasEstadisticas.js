import React from 'react';

export default function StatsCard({ title, value, icon, color }) {
  return (
    <div style={{...styles.card, backgroundColor: color}}>
      <div style={styles.content}>
        <span style={styles.icon}>{icon}</span>
        <div>
          <h3 style={styles.cardTitle}>{title}</h3>
          <p style={styles.cardValue}>{value}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '16px'
  },
  content: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    fontSize: '24px',
    marginRight: '12px'
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0'
  },
  cardValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0
  }
};