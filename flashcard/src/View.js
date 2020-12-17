import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

import {
  addCardMessage,
  answerInputMessage,
  deleteCardMessage,
  editCardMessage,
  gradeAnswerMessage,
  questionInputMessage,
  RANKS,
  saveMessage,
  showAnswerMessage,
} from './Update';

const {
  a, button, div, h1, i, pre, textarea,
} = hh(h);

const addButton = ({
  className, onclick, options,
}) => div([
  button({ className, onclick }, options),
]);

const addFlashCardBtn = (dispatch) => {
  return addButton({
    className: 'pa2 br1 mv2 bg-green bn white',
    onclick: () => dispatch(addCardMessage),
    options: [i({ className: 'fa fa-plus ph1' }), 'Add Flashcard'],
  });
};

const removeIcon = (dispatch, card) => i({
  className: 'absolute top-0 right-0 fa fa-remove fa-fw black-50 pointer',
  onclick: () => dispatch(deleteCardMessage(card.id)),
});

const editQuestion = (dispatch, card) => div({ className: '' }, [
  div({ className: 'b f6 mv1' }, 'Question'),
  textarea({
    className: 'w-100 bg-washed-yellow outline-0 h4',
    value: card.question,
    oninput: e => dispatch(questionInputMessage(card.id, e.target.value)),
  }),
]);

const editAnswer = (dispatch, card) => div({ className: '' }, [
  div({ className: 'b f6 mv1' }, 'Answer'),
  textarea({
    className: 'w-100 bg-washed-yellow outline-0 h4',
    value: card.answer,
    oninput: e => dispatch(answerInputMessage(card.id, e.target.value)),
  }),
]);

const editCard = (dispatch, card) => {
  return div({ className: 'w-third pa2' }, [
    div({ className: 'w-100 pa2 bg-light-yellow shadow-1 mv2 relative' }, [
      editQuestion(dispatch, card),
      editAnswer(dispatch, card),
      addButton({
        className: 'f4 ph3 pv2 br1 bg-gray bn white mv2',
        onclick: () => dispatch(saveMessage(card.id)),
        options: 'Save',
      }),
      removeIcon(dispatch, card),
    ]),
  ]);
};

const viewQuestion = (dispatch, card) => div([
  div({ className: 'b f6 mv1 underline ph1' }, 'Question'),
  div(
    {
      className: 'pointer hover-bg-black-10  bg-animate pv2 ph',
      onclick: () => dispatch(editCardMessage(card.id)),
    },
    card.question,
  ),
]);

const viewAnswer = (dispatch, card) => card.hiddenAnswer
  ? div(a(
    {
      className: 'f6 underline link pointer',
      onclick: () => dispatch(showAnswerMessage(card.id)),
    },
    'Show Answer',
  ))
  : div([
    div({ className: 'b f6 mv1 underline ph1' }, 'Answer'),
    div(
      {
        className: 'pointer hover-bg-black-10 bg-animate pv2 ph1',
        onclick: () => dispatch(editCardMessage(card.id)),
      },
      card.answer,
    ),
  ]);

const viewRankButtons = (dispatch, card) => card.hiddenAnswer
  ? null
  : div({ className: 'absolute bottom-0 left-0 w-100 ph2' }, [
    div({ className: 'mv2 flex justify-between' }, [
      addButton({
        className: 'f4 ph3 pv2 bg-red bn white br1',
        onclick: () => dispatch(gradeAnswerMessage(card.id, RANKS.BAD)),
        options: 'Bad',
      }),
      addButton({
        className: 'f4 ph3 pv2 bg-blue bn white br1',
        onclick: () => dispatch(gradeAnswerMessage(card.id, RANKS.GOOD)),
        options: 'Good',
      }),
      addButton({
        className: 'f4 ph3 pv2 bg-dark-green bn white br1',
        onclick: () => dispatch(gradeAnswerMessage(card.id, RANKS.GREAT)),
        options: 'Great',
      }),
    ]),
  ]);

const viewCard = (dispatch, card) => {
  return div({ className: 'w-third pa2' }, [
    div({ className: 'w-100 pa2 bg-light-yellow shadow-1 mv2 relative pb5' }, [
      viewQuestion(dispatch, card),
      viewAnswer(dispatch, card),
      viewRankButtons(dispatch, card),
      removeIcon(dispatch, card),
    ]),
  ]);
};

const cardsSection = (dispatch, card) => card.edit ? editCard(dispatch, card) : viewCard(dispatch, card);

function view(dispatch, model) {
  const cards = model.cards.map(card => cardsSection(dispatch, card));
  return div({ className: 'mw8 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Flashcard Study'),
    addFlashCardBtn(dispatch),
    div({ className: 'flex flex-wrap nl2 nr2' }, cards),
    pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;
