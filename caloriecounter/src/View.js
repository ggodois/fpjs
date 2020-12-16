import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import * as R from 'ramda';
import {
  caloriesInputMessage,
  deleteMealMessage,
  editMealMessage,
  mealInputMessage,
  saveMealMessage,
  showFormMessage,
} from './Update';

const {
  button,
  div,
  form,
  h1,
  i,
  input,
  label,
  pre,
  table,
  tbody,
  td,
  th,
  thead,
  tr,
} = hh(h);

function fieldSet(labelText, inputValue, oninput) {
  return div([
    label({ className: 'db mb1' }, labelText),
    input({
      className: 'pa2 input-reset ba w-100 mb2',
      type: 'text',
      value: inputValue,
      oninput,
    }),
  ]);
}

function buttonSet(dispatch) {
  return div([
    button(
      {
        className: 'f3 pv2 ph3 bg-blue white bn mr2 dim',
        type: 'submit',
      },
      'Save',
    ),
    button(
      {
        className: 'f3 pv2 ph3 bn bg-light-gray dim',
        type: 'button',
        onclick: () => dispatch(showFormMessage(false)),
      },
      'Cancel',
    ),
  ]);
}

function formView(dispatch, model) {
  const { calories, description, showForm } = model;
  if (showForm) {
    return form(
      {
        className: 'w-100 mv2',
        onsubmit: e => { 
          e.preventDefault();
          dispatch(saveMealMessage);
        },
      },
      [
        fieldSet(
          'Meal',
          description,
          e => dispatch(mealInputMessage(e.target.value)),
        ),
        fieldSet(
          'Calories',
          calories || '',
          e => dispatch(caloriesInputMessage(e.target.value)),
        ),
        buttonSet(dispatch),
      ],
    );
  }
  return button(
    {
      className: 'f3 pv2 ph3 bg-blue white bn',
      onclick: () => dispatch(showFormMessage(true)),
    },
    'Add Meal',
  );
}

function cell(tag, className, value) { 
  return tag({className}, value);
}

const tableHeader = thead([
  tr([
    cell(th, 'pa2 tl', 'Meal'),
    cell(th, 'pa2 tr', 'Calories'),
    cell(th, '', ''),
  ]),
]);

function mealRow(dispatch, className, meal) {
  return tr({ className }, [
    cell(td, 'pa2', meal.description),
    cell(td, 'pa2 tr', meal.calories),
    cell(td, 'pa2 tr', [
      i({
        className: 'ph1 fa fa-trash-o pointer',
        onclick: () => dispatch(deleteMealMessage(meal.id)),
      }),
      i({
        className: 'ph1 fa fa-pencil-square-o pointer',
        onclick: () => dispatch(editMealMessage(meal.id)),
      })
    ]),
  ]);
}

function totalRow(meals) {
  const calories = meals.map(meal => meal.calories);
  const caloriesSum = calories.reduce((acc, value) => acc + value, 0);
  return tr({ className: 'bt b' }, [
    cell(td, 'pa2 tr', 'Total:'),
    cell(td, 'pa2 tr', caloriesSum),
    cell(td, '', ''),
  ])
}

function mealsBody(dispatch, className, meals) {
  const rows = R.map(R.partial(mealRow, [dispatch, 'stripe-dark']), meals);
  return tbody({ className }, [...rows, totalRow(meals)]);
}

function tableView(dispatch, meals) {
  if (meals.length === 0) {
    return div({ className: 'mv2 i black-50' }, 'No meals to display...');
  }
  return table({ className: 'mv2 w-100 collapse' }, [
    tableHeader,
    mealsBody(dispatch, '', meals)
  ]);
}

function view(dispatch, model) {
  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Calorie Counter'),
    formView(dispatch, model),
    tableView(dispatch, model.meals),
    // pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;
