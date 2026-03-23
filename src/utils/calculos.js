export const VALOR_NORMAL = 16716;
export const VALOR_PICKLE = 14916;
export const ANTIFRAUDE   = 0.99;

export const TAXAS = {
  1:4.16, 2:5.71, 3:6.46, 4:7.22, 5:7.99, 6:8.76, 7:9.96,
  8:10.75, 9:11.55, 10:12.37, 11:13.18, 12:14.01,
  13:15.05, 14:15.89, 15:16.74, 16:17.59, 17:18.46, 18:19.33,
};

// Abr=0 ... Jan=9
export const MESES = [
  { id:'abr', nome:'Abr', full:'Abril'    },
  { id:'mai', nome:'Mai', full:'Maio'     },
  { id:'jun', nome:'Jun', full:'Junho'    },
  { id:'jul', nome:'Jul', full:'Julho'    },
  { id:'ago', nome:'Ago', full:'Agosto'   },
  { id:'set', nome:'Set', full:'Setembro' },
  { id:'out', nome:'Out', full:'Outubro'  },
  { id:'nov', nome:'Nov', full:'Novembro' },
  { id:'dez', nome:'Dez', full:'Dezembro' },
  { id:'jan', nome:'Jan', full:'Janeiro'  },
];

export const fmt = v =>
  'R$' + v.toLocaleString('pt-BR', { minimumFractionDigits:2, maximumFractionDigits:2 });

export function calcularSimulacao({ baseTotal, discountVal, entrada, selectedMonth, mesesCartao, useCartao }) {
  const TOTAL = Math.max(0, baseTotal - discountVal);
  const entradaVal  = Math.min(entrada, TOTAL);
  const restante    = TOTAL - entradaVal;
  const mesesBoleto = 9 - selectedMonth + 1; // Jan=idx9

  const parcBoleto = entradaVal > 0 ? entradaVal / mesesBoleto : 0;

  let grossCartao = 0, parcCartao = 0;
  if (restante > 0 && useCartao) {
    const taxa  = TAXAS[mesesCartao] / 100;
    grossCartao = (restante / (1 - taxa)) + ANTIFRAUDE;
    parcCartao  = grossCartao / mesesCartao;
  }

  const totalCobrado = entradaVal + grossCartao;
  const acrescimo    = grossCartao > 0 ? grossCartao - restante : 0;

  // Economia vs tudo 18x no cartão
  const t18    = TAXAS[18] / 100;
  const tudo18 = (TOTAL / (1 - t18)) + ANTIFRAUDE;
  const economia = tudo18 - totalCobrado;

  return {
    TOTAL, discountVal, entradaVal, restante,
    mesesBoleto, parcBoleto,
    mesesCartao, parcCartao, grossCartao,
    totalCobrado, acrescimo,
    economia: economia > 0 ? economia : 0,
    taxaCartao: TAXAS[mesesCartao],
    mesInicio: MESES[selectedMonth].nome,
  };
}
