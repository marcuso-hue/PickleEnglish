import React from 'react';
import styles from './EntradaInput.module.css';

export default function EntradaInput({ value, onChange, hasError }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        Valor de entrada <span className={styles.hint}>(boleto/PIX · sem juros)</span>
      </label>
      <div className={styles.wrap}>
        <span className={styles.prefix}>R$</span>
        <input
          type="number"
          className={`${styles.input} ${hasError ? styles.error : ''}`}
          placeholder="0"
          min={0}
          step={100}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      {hasError && (
        <p className={styles.errorMsg}>A entrada não pode ser maior que o valor total.</p>
      )}
    </div>
  );
}
