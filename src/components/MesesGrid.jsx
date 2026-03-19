import React from 'react';
import styles from './MesesGrid.module.css';
import { MESES } from '../utils/calculos';

export default function MesesGrid({ currentIdx, selectedMonth, onSelect }) {
  const parcsBoleto = 9 - selectedMonth + 1;

  return (
    <div className={styles.field}>
      <label className={styles.label}>A partir de qual mês começa a pagar o boleto?</label>
      <div className={styles.grid}>
        {MESES.map((m, i) => {
          const past     = i < currentIdx;
          const selected = i === selectedMonth;
          return (
            <button
              key={m.id}
              className={[
                styles.btn,
                past     ? styles.disabled  : '',
                selected ? styles.selected  : '',
              ].join(' ')}
              onClick={() => !past && onSelect(i)}
              disabled={past}
            >
              {m.nome}
            </button>
          );
        })}
      </div>
      <p className={styles.info}>
        {MESES[selectedMonth].nome} até Dez/2026 ={' '}
        <strong>{parcsBoleto} parcela{parcsBoleto > 1 ? 's' : ''}</strong> no boleto
      </p>
    </div>
  );
}
