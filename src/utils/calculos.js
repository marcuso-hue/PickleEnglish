export const VALOR_NORMAL = 16716;
export const VALOR_PICKLE = 14916;
export const ANTIFRAUDE   = 0.99;

export const TAXAS = {
  1: 4.16,  2: 5.71,  3: 6.46,  4: 7.22,  5: 7.99,
  6: 8.76,  7: 9.96,  8: 10.75, 9: 11.55, 10: 12.37,
  11: 13.18, 12: 14.01, 13: 15.05, 14: 15.89, 15: 16.74,
  16: 17.59, 17: 18.46, 18: 19.33,
};

export const MESES = [
  { id: 'mar', nome: 'Mar', full: 'Março'     },
  { id: 'abr', nome: 'Abr', full: 'Abril'     },
  { id: 'mai', nome: 'Mai', full: 'Maio'      },
  { id: 'jun', nome: 'Jun', full: 'Junho'     },
  { id: 'jul', nome: 'Jul', full: 'Julho'     },
  { id: 'ago', nome: 'Ago', full: 'Agosto'    },
  { id: 'set', nome: 'Set', full: 'Setembro'  },
  { id: 'out', nome: 'Out', full: 'Outubro'   },
  { id: 'nov', nome: 'Nov', full: 'Novembro'  },
  { id: 'dez', nome: 'Dez', full: 'Dezembro'  },
];

// Current index (Mar=0, Abr=1, ..., Dez=9)
export function getCurrentMonthIdx() {
  const m = new Date().getMonth(); // 0=jan
  return Math.max(0, Math.min(m - 2, 9));
}

export function fmt(v) {
  return 'R$' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function calcularSimulacao({ isPickle, entrada, selectedMonth, mesesCartao }) {
  const TOTAL = isPickle ? VALOR_PICKLE : VALOR_NORMAL;
  if (!entrada || entrada <= 0) return null;

  const entradaVal  = Math.min(entrada, TOTAL);
  const mesesBoleto = 9 - selectedMonth + 1; // Mar→Dez
  const restante    = TOTAL - entradaVal;

  const parcBoleto = entradaVal / mesesBoleto;

  let grossCartao = 0, parcCartao = 0;
  if (restante > 0) {
    const taxa  = TAXAS[mesesCartao] / 100;
    grossCartao = (restante / (1 - taxa)) + ANTIFRAUDE;
    parcCartao  = grossCartao / mesesCartao;
  }

  const totalGeral = entradaVal + grossCartao;
  const acrescimo  = totalGeral - TOTAL;

  // Economia vs tudo em 18x
  const t18       = TAXAS[18] / 100;
  const tudo18    = (TOTAL / (1 - t18)) + ANTIFRAUDE;
  const economia  = tudo18 - totalGeral;

  return {
    TOTAL, entradaVal, restante,
    mesesBoleto, parcBoleto,
    mesesCartao, parcCartao, grossCartao,
    totalGeral, acrescimo,
    economia: economia > 0 ? economia : 0,
    taxaCartao: TAXAS[mesesCartao],
    mesInicio: MESES[selectedMonth].nome,
  };
}
