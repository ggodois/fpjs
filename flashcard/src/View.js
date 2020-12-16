import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

const {
  button, div, h1, i, pre, textarea,
} = hh(h);

const addButton = (className, type, options) => div([
  button({ className, type }, options),
]);

const addFlashCardBtn = () => {
  return addButton(
    'pa2 br1 mv2 bg-green bn white',
    'submit',
    [i({ className: 'fa fa-plus ph1' }), 'Add Flashcard'],
  );
};

const cardSection = (
  titleClassName, title, bodyTag, bodyClassName, body,
) => div([
  div({ className: titleClassName }, title),
  bodyTag({ className: bodyClassName }, body),
]);

const selectedCard = ({ question, answer }) => {
  return div({ className: 'w-third pa2' }, [
    div({ className: 'w-100 pa2 bg-light-yellow shadow-1 mv2 relative pb5' }, [
      cardSection(
        'b f6 mv1 underline', 'Question', div, 'pointer', question,
      ),
      cardSection(
        'b f6 mv1 underline', 'Answer', div, 'pointer', answer,
      ),
      div({ className: 'absolute bottom-0 left-0 w-100 ph2' }, [
        div({ className: 'mv2 flex justify-between' }, [
          addButton('f4 ph3 pv2 bg-red bn white br1', 'submit', 'Bad'),
          addButton('f4 ph3 pv2 bg-blue bn white br1', 'submit', 'Good'),
          addButton('f4 ph3 pv2 bg-dark-green bn white br1', 'submit', 'Great'),
        ]),
      ]),
      i({ className: 'absolute top-0 right-0 fa fa-remove fa-fw black-50 pointer' }),
    ]),
  ]);
};

const editCard = () => {
  return div({ className: 'w-third pa2' }, [
    div({ className: 'w-100 pa2 bg-light-yellow shadow-1 mv2 relative' }, [
      cardSection(
        'b f6 mv1', 'Question', textarea, 'w-100 bg-washed-yellow outline-0', null,
      ),
      cardSection(
        'b f6 mv1', 'Answer', textarea, 'w-100 bg-washed-yellow outline-0', null,
      ),
      addButton('f4 ph3 pv2 br1 bg-gray bn white mv2', 'submit', 'Save'),
      i({ className: 'absolute top-0 right-0 fa fa-remove fa-fw black-50 pointer' }),
    ]),
  ]);
};

const card = ({ question, answer }) => {
  return div({ className: 'w-third pa2' }, [
    div({ className: 'w-100 pa2 bg-light-yellow shadow-1 mv2 relative pb5' }, [
      cardSection(
        'b f6 mv1 underline', 'Question', div, 'pointer', question,
      ),
      cardSection(
        'f6 mv1 underline', 'Show Answer', div, 'pointer', null,
      ),
      i({ className: 'absolute top-0 right-0 fa fa-remove fa-fw black-50 pointer' }),
    ]),
  ]);
};

const cardsSection = (dispatch, model) => {
  return div({ className: 'flex flex-wrap nl2 nr2' }, [
    // model.cards.map(item => card(item)),
    selectedCard(model.cards[0]),
    editCard(),
    card(model.cards[0]),
    card(model.cards[0]),
  ]);
};

function view(dispatch, model) {
  return div({ className: 'mw8 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Flashcard Study'),
    addFlashCardBtn(),
    cardsSection(dispatch, model),
    pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;
