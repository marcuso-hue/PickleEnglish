import React, { useState, useMemo } from 'react';
import s from './Calculator.module.css';
import { VALOR_NORMAL, VALOR_PICKLE, TAXAS, MESES, fmt, calcularSimulacao } from '../utils/calculos';

// ── Sub-components ────────────────────────────────────────────────
function Toggle({ on, onClick, small }) {
  return (
    <div
      className={`${small ? s.smallToggle : s.toggle} ${on ? s.on : ''}`}
      onClick={onClick}
      role="switch" aria-checked={on} tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    />
  );
}

function ResultBlock({ icon, name, detail, parc, parcSub, info, color }) {
  return (
    <div className={s.block}>
      <div className={s.blockHeader}>
        <span className={s.blockIcon}>{icon}</span>
        <span className={s.blockName}>{name}</span>
        {detail && <span className={s.blockDetail}>{detail}</span>}
      </div>
      <div className={s.parc} style={color ? { color } : {}}>
        {parc}<span className={s.parcSub}>{parcSub}</span>
      </div>
      {info && <div className={s.infoRow}>{info}</div>}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────
export default function Calculator() {
  const [isPickle,      setPickle]     = useState(false);
  const [discReais,     setDiscReais]  = useState('');
  const [discPct,       setDiscPct]    = useState('');
  const [entrada,       setEntrada]    = useState('');
  const [selectedMonth, setMonth]      = useState(0);
  const [mesesCartao,   setCartao]     = useState(18);
  const [useCartao,     setUseCartao]  = useState(true);
  const [syncLock,      setSyncLock]   = useState(false);

  const baseTotal   = isPickle ? VALOR_PICKLE : VALOR_NORMAL;
  const discountVal = Math.max(0, parseFloat(discReais) || 0);
  const TOTAL       = Math.max(0, baseTotal - discountVal);
  const entradaNum  = parseFloat(entrada) || 0;
  const entradaErr  = entradaNum > TOTAL;
  const restante    = Math.max(0, TOTAL - Math.min(entradaNum, TOTAL));

  const sim = useMemo(() => calcularSimulacao({
    baseTotal, discountVal,
    entrada: entradaNum,
    selectedMonth, mesesCartao, useCartao,
  }), [baseTotal, discountVal, entradaNum, selectedMonth, mesesCartao, useCartao]);

  function syncFromReais(val) {
    if (syncLock) return;
    setSyncLock(true);
    setDiscReais(val);
    const r = parseFloat(val) || 0;
    setDiscPct(baseTotal > 0 && r > 0 ? (r / baseTotal * 100).toFixed(2) : '');
    setSyncLock(false);
  }

  function syncFromPct(val) {
    if (syncLock) return;
    setSyncLock(true);
    setDiscPct(val);
    const pct = parseFloat(val) || 0;
    setDiscReais(pct > 0 ? (baseTotal * pct / 100).toFixed(2) : '');
    setSyncLock(false);
  }

  function handlePickle() {
    setPickle(p => {
      const newBase = !p ? VALOR_PICKLE : VALOR_NORMAL;
      const pct = parseFloat(discPct) || 0;
      if (pct > 0) setDiscReais((newBase * pct / 100).toFixed(2));
      return !p;
    });
  }

  const mesesBoleto = 9 - selectedMonth + 1;
  const showResult  = entradaNum >= 0 && !entradaErr;

  return (
    <div className={s.page}>
      <div className={s.card}>
        {/* Header */}
        <div className={s.header}>
          <div className={s.eyebrow}>Pickle English · Ferramenta interna</div>
          <h1 className={s.title}>Calculadora de<br /><span>Pagamento Híbrido</span></h1>
          <p className={s.sub}>Boleto sem juros + cartão parcelado</p>
        </div>

        <div className={s.body}>
          {/* Total box */}
          <div className={s.totalBox}>
            <div>
              <div className={s.totalLabel}>Valor do pacote</div>
              <div className={s.totalVal}>{fmt(TOTAL)}</div>
              <div className={s.totalSub}>
                {isPickle ? '🥒 Com desconto Pickle' : 'Valor normal'}
                {discountVal > 0 ? ` · desconto: -${fmt(discountVal)}` : ''}
              </div>
            </div>
            <span style={{ fontSize: 30 }}>✈️</span>
          </div>

          {/* Pickle toggle */}
          <div className={s.pickleRow} onClick={handlePickle}>
            <span style={{ fontSize: 18 }}>🥒</span>
            <div className={s.pickleText}>É aluno Pickle? <span>Desconto de R$1.800</span></div>
            <Toggle on={isPickle} onClick={() => {}} />
          </div>

          {/* Desconto manual */}
          <div className={s.field}>
            <label className={s.label}>Desconto adicional <span className={s.hint}>(opcional)</span></label>
            <div className={s.discRow}>
              <div className={s.discField}>
                <span className={s.discLabel}>Em reais</span>
                <div className={s.inputWrap}>
                  <span className={s.prefix}>R$</span>
                  <input type="number" className={s.input} placeholder="0"
                    value={discReais} onChange={e => syncFromReais(e.target.value)} min={0} step={10}/>
                </div>
              </div>
              <div className={s.discField}>
                <span className={s.discLabel}>Em porcentagem</span>
                <div className={s.inputWrap}>
                  <input type="number" className={`${s.input} ${s.noPrefix} ${s.hasSuffix}`}
                    placeholder="0" value={discPct} onChange={e => syncFromPct(e.target.value)} min={0} max={100} step={0.1}/>
                  <span className={s.suffix}>%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Entrada */}
          <div className={s.field}>
            <label className={s.label}>Valor de entrada <span className={s.hint}>(boleto/PIX · sem juros · pode ser zero)</span></label>
            <div className={s.inputWrap}>
              <span className={s.prefix}>R$</span>
              <input type="number" className={s.input} placeholder="0"
                value={entrada} onChange={e => setEntrada(e.target.value)} min={0} step={100}/>
            </div>
            {entradaErr && <p className={s.errorMsg}>A entrada não pode ser maior que o valor total.</p>}
          </div>

          {/* Meses boleto */}
          {entradaNum > 0 && (
            <div className={s.field}>
              <label className={s.label}>A partir de qual mês paga o boleto?</label>
              <div className={s.monthsGrid}>
                {MESES.map((m, i) => (
                  <button
                    key={m.id}
                    className={`${s.monthBtn} ${i === selectedMonth ? s.selected : ''}`}
                    onClick={() => setMonth(i)}
                  >{m.nome}</button>
                ))}
              </div>
              <p className={s.monthInfo}>
                {MESES[selectedMonth].nome} até Jan/2027 = <strong>{mesesBoleto} parcela{mesesBoleto > 1 ? 's' : ''}</strong> no boleto
              </p>
            </div>
          )}

          {/* Cartão toggle */}
          <div className={s.cardToggleRow}>
            <div>
              <span className={s.cardToggleLabel}>Usar cartão para o restante?</span>
              {' '}<span className={s.cardToggleHint}>
                {restante > 0 ? `(restante: ${fmt(restante)})` : '(entrada cobre o total)'}
              </span>
            </div>
            <Toggle on={useCartao} onClick={() => setUseCartao(u => !u)} small />
          </div>

          {/* Cartão slider */}
          {useCartao && restante > 0 && (
            <div className={s.field}>
              <div className={s.sliderTop}>
                <span className={s.sliderHint}>Parcelas:</span>
                <span className={s.sliderN}>{mesesCartao}x <span className={s.sliderTaxa}>· {TAXAS[mesesCartao].toFixed(2)}%</span></span>
              </div>
              <input type="range" min={1} max={18} value={mesesCartao}
                onChange={e => setCartao(parseInt(e.target.value))}/>
              <div className={s.sliderLabels}><span>1x (à vista)</span><span>18x</span></div>
            </div>
          )}

          <hr className={s.sep} />

          {/* Resultado */}
          {showResult && (
            <div className={s.result}>
              <div className={s.resultTitle}>Simulação de pagamento</div>

              {discountVal > 0 && (
                <ResultBlock
                  icon="🏷️" name="Desconto aplicado"
                  detail={`${(discountVal / baseTotal * 100).toFixed(1)}%`}
                  parc={`-${fmt(discountVal)}`} parcSub=""
                  info={`De ${fmt(baseTotal)} para ${fmt(TOTAL)}`}
                  color="#a8e6cf"
                />
              )}

              {sim.entradaVal > 0 && (
                <ResultBlock
                  icon="📄" name="Entrada / Boleto"
                  detail={`${sim.mesesBoleto}x sem juros`}
                  parc={fmt(sim.parcBoleto)}
                  parcSub={sim.mesesBoleto > 1 ? '/mês' : ' à vista'}
                  info={sim.mesesBoleto > 1
                    ? `${sim.mesInicio} a Jan/2027 · total: ${fmt(sim.entradaVal)} · sem juros`
                    : `Pagamento único · ${fmt(sim.entradaVal)} · sem juros`}
                />
              )}

              {sim.grossCartao > 0 && (
                <ResultBlock
                  icon="💳" name="Cartão de crédito"
                  detail={`${sim.mesesCartao}x · ${sim.taxaCartao.toFixed(2)}%`}
                  parc={fmt(sim.parcCartao)}
                  parcSub={sim.mesesCartao > 1 ? '/mês' : ' à vista'}
                  info={`Restante: ${fmt(sim.restante)} · total: ${fmt(sim.grossCartao)} · acréscimo: +${fmt(sim.acrescimo)}`}
                />
              )}

              <div className={s.totalRes}>
                <div>
                  <div className={s.totalResLabel}>Total cobrado</div>
                  <div className={s.totalResSub}>
                    {sim.acrescimo > 0 ? `Acréscimo: +${fmt(sim.acrescimo)}` : 'Sem acréscimo'}
                  </div>
                </div>
                <div className={s.totalResVal}>{fmt(sim.totalCobrado)}</div>
              </div>

              {sim.economia > 0 && sim.entradaVal > 0 && (
                <p className={s.economy}>
                  💡 Economia de {fmt(sim.economia)} vs parcelar tudo em 18x no cartão
                </p>
              )}
            </div>
          )}

          {!showResult && (
            <p className={s.note}>Preencha os campos acima para simular.</p>
          )}
        </div>
      </div>
    </div>
  );
}
