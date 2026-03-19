import React from 'react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.eyebrow}>Pickle English · Ferramenta interna</div>
      <h1 className={styles.title}>
        Calculadora de<br /><span>Pagamento Híbrido</span>
      </h1>
      <p className={styles.sub}>Boleto sem juros + cartão parcelado em janeiro</p>
    </div>
  );
}
