import React from 'react';
import styles from './Resultado.module.css';
import { fmt } from '../utils/calculos';

export default function Resultado({ sim }) {
  const {
    entradaVal, mesesBoleto, parcBoleto,
    restante, mesesCartao, parcCartao, grossCartao,
    totalGeral, acrescimo, economia,
    taxaCartao, mesInicio,
  } = sim;

  return (
    <div className={styles.result}>
      <div className={styles.title}>Simulação de pagamento</div>

      {/* Boleto */}
      <div className={styles.block}>
        <div className={styles.blockHeader}>
          <span className={styles.icon}>📄</span>
          <span className={styles.blockName}>Boleto / PIX</span>
          <span className={styles.blockDetail}>{mesesBoleto}x sem juros</span>
        </div>
        <div className={styles.parc}>{fmt(parcBoleto)}<span>/mês</span></div>
        <div className={styles.info}>
          {mesInicio} a Dez/2026 · total: {fmt(entradaVal)} · sem juros
        </div>
      </div>

      {/* Cartão */}
      <div className={styles.block}>
        <div className={styles.blockHeader}>
          <span className={styles.icon}>💳</span>
          <span className={styles.blockName}>Cartão de crédito</span>
          <span className={styles.blockDetail}>{mesesCartao}x · {taxaCartao.toFixed(2)}%</span>
        </div>
        {restante > 0 ? (
          <>
            <div className={styles.parc}>{fmt(parcCartao)}<span>/mês</span></div>
            <div className={styles.info}>
              Restante: {fmt(restante)} · total: {fmt(grossCartao)} · acréscimo: +{fmt(grossCartao - restante)}
            </div>
          </>
        ) : (
          <div className={styles.parc}><span>Entrada cobre o valor total</span></div>
        )}
      </div>

      {/* Total */}
      <div className={styles.totalBox}>
        <div>
          <div className={styles.totalLabel}>Total geral</div>
          <div className={styles.totalSub}>
            {acrescimo > 0 ? `Acréscimo: +${fmt(acrescimo)}` : 'Sem acréscimo'}
          </div>
        </div>
        <div className={styles.totalVal}>{fmt(totalGeral)}</div>
      </div>

      {economia > 0 && (
        <p className={styles.economy}>
          💡 Economia de {fmt(economia)} vs parcelar tudo em 18x no cartão
        </p>
      )}
    </div>
  );
}
