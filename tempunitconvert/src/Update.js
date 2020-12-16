import * as R from 'ramda';

const MSGS = {
  INPUT_FIRST_TEMPERATURE: 'INPUT_FIRST_TEMPERATURE',
  SELECT_FIRST_UNIT: 'SELECT_FIRST_UNIT',
  INPUT_SECOND_TEMPERATURE: 'INPUT_SECOND_TEMPERATURE',
  SELECT_SECOND_UNIT: 'SELECT_SECOND_UNIT',
};

export function inputFirstTemperatureMessage(firstTemperature) {
  return {
    type: MSGS.INPUT_FIRST_TEMPERATURE,
    firstTemperature,
  }
}

export function selectFirstUnitMessage(firstUnit) {
  return {
    type: MSGS.SELECT_FIRST_UNIT,
    firstUnit,
  }
}

export function inputSecondTemperatureMessage(secondTemperature) {
  return {
    type: MSGS.INPUT_SECOND_TEMPERATURE,
    secondTemperature,
  }
}

export function selectSecondUnitMessage(secondUnit) {
  return {
    type: MSGS.SELECT_SECOND_UNIT,
    secondUnit,
  }
}

const cToF = cTemp => 9 / 5 * cTemp + 32;
const cToK = cTemp => cTemp + 273.15;
const fToC = fTemp => 5 / 9 * (fTemp - 32);
const fToK = fTemp => cToK(fToC(fTemp));
const kToC = kTemp => kTemp - 273.15;
const kToF = kTemp => cToF(kToC(kTemp));
const defaultFn = temp => temp;

const UNITS = {
  Celsius: {
    Celsius: defaultFn,
    Fahrenheit: cToF,
    Kelvin: cToK,
  },
  Fahrenheit: {
    Celsius: fToC,
    Fahrenheit: defaultFn,
    Kelvin: fToK,
  },
  Kelvin: {
    Celsius: kToC,
    Fahrenheit: kToF,
    Kelvin: defaultFn,
  },
};

const convertion = (fromUnit, toUnit, temp) => {
  const convertionFn = UNITS[fromUnit][toUnit];
  return convertionFn(temp);
};

const convertTemperature = (model) => {
  const {
    originFirst, firstTemperature, firstUnit, secondTemperature, secondUnit,
  } = model;

  const [fromUnit, fromTemp, toUnit] = originFirst
    ? [firstUnit, firstTemperature, secondUnit]
    : [secondUnit, secondTemperature, firstUnit];

  const convertedTemp = convertion(fromUnit, toUnit, fromTemp);
  const roundedTemp = Math.round(convertedTemp * 10) / 10;

  return originFirst
    ? { ...model, secondTemperature: roundedTemp }
    : { ...model, firstTemperature: roundedTemp };
};

const parseTemperature = R.pipe(parseInt, R.defaultTo(0));

function update (msg, model) {
  switch (msg.type) {
    case MSGS.INPUT_FIRST_TEMPERATURE: {
      if (msg.firstTemperature === '') {
        return {
          ...model, originFirst: true, firstTemperature: '', secondTemperature: '',
        };
      }
      const firstTemperature = parseTemperature(msg.firstTemperature);
      return convertTemperature({ ...model, firstTemperature, originFirst: true });
    }
    case MSGS.SELECT_FIRST_UNIT: {
      const { firstUnit } = msg;
      return convertTemperature({ ...model, firstUnit });
    }
    case MSGS.INPUT_SECOND_TEMPERATURE: {
      if (msg.secondTemperature === '') {
        return {
          ...model, originFirst: false, firstTemperature: '', secondTemperature: '',
        };
      }
      const secondTemperature = parseTemperature(msg.secondTemperature);
      return convertTemperature({ ...model, secondTemperature, originFirst: false });
    }
    case MSGS.SELECT_SECOND_UNIT: {
      const { secondUnit } = msg;
      return convertTemperature({ ...model, secondUnit });
    }
    default: return model;
  }
}

export default update;
