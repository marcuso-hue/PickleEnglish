import React, { useState, useMemo } from 'react';
import styles from './Calculator.module.css';
import Header     from './Header';
import TotalBox   from './TotalBox';
import PickleToggle from './PickleToggle';
import EntradaInput from './EntradaInput';
import MesesGrid  from './MesesGrid';
import CartaoSlider from './CartaoSlider';
import Resultado  from './Resultado';
import { calcularSimulacao, getCurrentMonthIdx } from '../utils/calculos';

export default function Calculator() {
  const currentIdx = useMemo(() => getCurrentMonthIdx(), []);

  const [isPickle,     setPickle]     = useState(false);
  const [entrada,      setEntrada]    = useState('');
  const [selectedMonth, setMonth]    = useState(currentIdx);
  const [mesesCartao,  setCartao]     = useState(18);

  const sim = useMemo(() => calcularSimulacao({
    isPickle,
    entrada: parseFloat(entrada) || 0,
    selectedMonth,
    mesesCartao,
  }), [isPickle, entrada, selectedMonth, mesesCartao]);

  const entradaNum  = parseFloat(entrada) || 0;
  const TOTAL       = isPickle ? 14916 : 16716;
  const entradaErr  = entradaNum > TOTAL;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Header />
        <div className={styles.body}>
          <TotalBox isPickle={isPickle} />
          <PickleToggle isPickle={isPickle} onToggle={() => setPickle(p => !p)} />

          <EntradaInput
            value={entrada}
            onChange={setEntrada}
            hasError={entradaErr}
          />

          <MesesGrid
            currentIdx={currentIdx}
            selectedMonth={selectedMonth}
            onSelect={setMonth}
          />

          <CartaoSlider
            value={mesesCartao}
            onChange={setCartao}
          />

          <div className={styles.sep} />

          {sim && !entradaErr
            ? <Resultado sim={sim} />
            : <p className={styles.note}>
                {entradaErr
                  ? '⚠️ A entrada não pode ser maior que o valor total.'
                  : 'Preencha a entrada e escolha o mês para simular.'}
              </p>
          }
        </div>
      </div>
    </div>
  );
}
