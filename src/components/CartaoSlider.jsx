import React from 'react';
import styles from './CartaoSlider.module.css';
import { TAXAS } from '../utils/calculos';

export default function CartaoSlider({ value, onChange }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>Restante no cartão — quantas parcelas?</label>
      <div className={styles.top}>
        <span className={styles.hint}>Parcelas:</span>
        <span className={styles.val}>{value}x <span className={styles.taxa}>· taxa {TAXAS[value].toFixed(2)}%</span></span>
      </div>
      <input
        type="range"
        className={styles.slider}
        min={1} max={18}
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
      />
      <div className={styles.labels}>
        <span>1x (à vista)</span><span>18x</span>
      </div>
    </div>
  );
}
