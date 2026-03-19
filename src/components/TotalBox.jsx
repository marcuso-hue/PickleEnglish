import React from 'react';
import styles from './TotalBox.module.css';
import { fmt, VALOR_NORMAL, VALOR_PICKLE } from '../utils/calculos';

export default function TotalBox({ isPickle }) {
  const val = isPickle ? VALOR_PICKLE : VALOR_NORMAL;
  return (
    <div className={styles.box}>
      <div>
        <div className={styles.label}>Valor do pacote</div>
        <div className={styles.value}>{fmt(val)}</div>
        <div className={styles.sub}>
          {isPickle ? '🥒 Valor com desconto Pickle' : 'Valor normal'}
        </div>
      </div>
      <span style={{ fontSize: 32 }}>✈️</span>
    </div>
  );
}
