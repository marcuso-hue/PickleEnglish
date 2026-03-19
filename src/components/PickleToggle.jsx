import React from 'react';
import styles from './PickleToggle.module.css';

export default function PickleToggle({ isPickle, onToggle }) {
  return (
    <div className={styles.row} onClick={onToggle} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onToggle()}>
      <span style={{ fontSize: 20 }}>🥒</span>
      <div className={styles.text}>
        É aluno Pickle? <span>Desconto de R$1.800</span>
      </div>
      <div className={`${styles.toggle} ${isPickle ? styles.on : ''}`} />
    </div>
  );
}
