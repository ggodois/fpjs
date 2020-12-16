export const MSGS = {
  BILL_INPUT: 'BILL_INPUT',
  TIP_INPUT: 'TIP_INPUT',
};

export function billInputMessage(billAmount) {
  return {
    type: MSGS.BILL_INPUT,
    billAmount,
  }
}

export function tipInputMessage(tipPercentage) {
  return {
    type: MSGS.TIP_INPUT,
    tipPercentage,
  }
}

function update (msg, model) {
  switch (msg.type) {
    case MSGS.BILL_INPUT: {
      const { billAmount } = msg;
      return { ...model, billAmount };
    }
    case MSGS.TIP_INPUT: {
      const { tipPercentage } = msg;
      return { ...model, tipPercentage };
    }
    default:
      return model;
  }
}

export default update;
