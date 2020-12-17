import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

import {
  addLocationMessage,
  clearErrorMessage,
  deleteLocationMessage,
  locationInputMessage,
} from './Update';

const {
  button, div, form, h1, i, input, label, li, pre, ul,
} = hh(h);

const removeIcon = (dispatch, location) => i({
  className: 'relative top--1 right--1 mt1 mr1 fa fa-remove pointer black-40',
  onclick: () => dispatch(deleteLocationMessage(location.id)),
});

const formView = (dispatch, location) => div(
  { className: '' },
  form({
    className: '',
    onsubmit: e => { 
      e.preventDefault();
      dispatch(addLocationMessage);
    },
  }, [
    label({ className: 'f6 b db mb2' }, 'Location'),
    input({
      className: 'pa2 w-60',
      type: 'text',
      value: location,
      oninput: e => dispatch(locationInputMessage(e.target.value)),
    }),
    button({ className: 'pv2 ph3 br1', type: 'submit' }, 'Add'),
  ]),
);

const itemListComponent = (itemClassName, fielClassName, fieldName, valueName) => div(
  { className: itemClassName },
  [
    div({ className: fielClassName }, fieldName),
    div({}, valueName),
  ],
);

const itemsList = (dispatch, locations) => locations.map(location => li(
  { className: 'pa3 bb b--light-silver flex justify-between relative' }, [
    itemListComponent(
      'w-60 tl', 'f7 b', 'Location', location.name,
    ),
    itemListComponent(
      'w-10 tc', 'f7 b', 'Temp', location.temp,
    ),
    itemListComponent(
      'w-10 tc', 'f7 b', 'Low', location.low,
    ),
    itemListComponent(
      'w-10 tc mr2', 'f7 b', 'High', location.high,
    ),
    removeIcon(dispatch, location),
  ]),
);

const listView = (dispatch, locations) => ul(
  { className: 'list pl0 ml0 ba b--light-silver br' },
  itemsList(dispatch, locations),
);

const error = (dispatch, model) => {
  if (!model.error) return null;
  return div({ className: 'pa2 mv2 bg-red white relative' }, [
    model.error,
    i({
      className:
        'white absolute top-0 right-0 mt1 mr1 fa fa-remove pointer black-40',
      onclick: () => {
        dispatch(clearErrorMessage);
        dispatch(deleteLocationMessage(model.nextId - 1));
      },
    }),
  ]);
};

function view(dispatch, model) {
  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Weather'),
    error(dispatch, model),
    formView(dispatch, model.location),
    listView(dispatch, model.locations),
    pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;
