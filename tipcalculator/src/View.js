import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

import {
  billInputMessage,
  tipInputMessage,
} from './Update';

const {
  div,
  h1,
  input,
  label,
  pre,
} = hh(h);

function fieldSet(labelText, inputValue, oninput) {
  return div({ className: 'w-40' }, [
    label({ className: 'db fw6 lh-copy f5' }, labelText),
    input({
      className: 'border-box pa2 ba mb2 tr w-100',
      type: 'text',
      value: inputValue,
      oninput,
    }),
  ]);
}

const resultLabel = (text, amount) => {
  return div({ className: 'flex w-100' }, [
    div({ className: 'w-50 pv1 pr2' }, text),
    div({ className: 'w-50 tr pv1 pr2' }, amount),
  ]);
};

function resultSection(tipAmount, totalAmount) {
  return div({ className: 'w-40 b bt mt2 pt2' }, [
    resultLabel('Tip:', tipAmount),
    resultLabel('Total:', totalAmount),
  ]);
}

const round = num => {
  return (
    Math.round(num * Math.pow(10, 2))
  ) * Math.pow(10, -1 * 2);
};

const calcResult = (billAmount, tipPercentage) => {
  const bill = parseFloat(billAmount);
  const tip = bill * parseFloat(tipPercentage) / 100 || 0;
  return {
    tip: `$${round(tip).toFixed(2) || 0}`,
    total: `$${round(bill + tip || 0).toFixed(2)}`,
  };
};

function view(dispatch, model) {
  const { billAmount, tipPercentage } = model;
  const { tip, total } = calcResult(billAmount, tipPercentage);

  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Tip Calculator'),
    fieldSet(
      'Bill Amount',
      billAmount,
      e => dispatch(billInputMessage(e.target.value)),
    ),
    fieldSet(
      'Tip %',
      tipPercentage,
      e => dispatch(tipInputMessage(e.target.value)),
    ),
    resultSection(tip, total),
    // pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;
