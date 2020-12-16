// import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

import {
  inputFirstTemperatureMessage,
  inputSecondTemperatureMessage,
  selectFirstUnitMessage,
  selectSecondUnitMessage,
} from './Update';

const {
  div,
  h1,
  input,
  option,
  pre,
  select,
} = hh(h);
const UNITS = ['Celsius', 'Fahrenheit', 'Kelvin'];

const unitOptions = (selectedUnit) => UNITS.map(unit => option(
  { value: unit, selected: selectedUnit === unit },
  unit,
));

function unitSection(dispatch, unit, temperature, inputMessage, selectMessage) {
  return div({ className: 'w-50 ma1' }, [
    input({
      className: 'db input-reset ba w-100 mv2 pa2',
      type: 'text',
      value: temperature,
      oninput: e => dispatch(inputMessage(e.target.value)),
    }),
    select(
      {
        className: 'db w-100 pa2 ba input-reset br1 bg-white ba b--black',
        onchange: e => dispatch(selectMessage(e.target.value)),
      },
      unitOptions(unit),
    ),
  ]);
}

function view(dispatch, model) {
  const { firstTemperature, firstUnit, secondTemperature, secondUnit } = model;
  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Temperature Unit Converter'),
    div(
      { className: 'flex' },
      [
        unitSection(
          dispatch,
          firstUnit,
          firstTemperature,
          inputFirstTemperatureMessage,
          selectFirstUnitMessage,
        ),
        h1({ className: 'pv2' }, '='),
        unitSection(
          dispatch,
          secondUnit,
          secondTemperature,
          inputSecondTemperatureMessage,
          selectSecondUnitMessage,
        ),
      ],
    ),
    // pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;
