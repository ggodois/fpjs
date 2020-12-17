const MSGS = {
  ADD_CARD: 'ADD_CARD',
  EDIT_CARD: 'EDIT_CARD',
  DELETE_CARD: 'DELETE_CARD',
  SHOW_ANSWER: 'SHOW_ANSWER',
  GRADE_ANSWER: 'GRADE_ANSWER',
  QUESTION_INPUT: 'QUESTION_INPUT',
  ANSWER_INPUT: 'ANSWER_INPUT',
  SAVE: 'SAVE',
};
export const RANKS = {
  BAD: 0,
  GOOD: 1,
  GREAT: 2,
};

export const showAnswerMessage = id => ({
  type: MSGS.SHOW_ANSWER,
  id,
});

export const gradeAnswerMessage = (id, rank) => ({
  type: MSGS.GRADE_ANSWER,
  id,
  rank,
});

export const editCardMessage = id => ({
  type: MSGS.EDIT_CARD,
  id,
});

export const deleteCardMessage = id => ({
  type: MSGS.DELETE_CARD,
  id,
});

export const questionInputMessage = (id, question) => ({
  type:MSGS.QUESTION_INPUT,
  id,
  question,
});

export const answerInputMessage = (id, answer) => ({
  type:MSGS.ANSWER_INPUT,
  answer,
  id,
});

export const saveMessage = id => ({
  type: MSGS.SAVE,
  id,
});

export const addCardMessage = { type: MSGS.ADD_CARD };

const updateCards = (newDataCard, cards) => cards.map(card => {
  if (card.id === newDataCard.id) return { ...card, ...newDataCard };
  return card
});

function update(msg, model) {
  const { cards, nextId } = model;
  switch (msg.type) {
    case MSGS.SHOW_ANSWER: {
      const { id } = msg;
      const updatedCards = updateCards({ id, hiddenAnswer: false }, cards);
      return { ...model, cards: updatedCards };
    }
    case MSGS.QUESTION_INPUT: {
      const { id, question } = msg;
      const updatedCards = updateCards({ id, question }, cards);
      return { ...model, cards: updatedCards };
    }
    case MSGS.ANSWER_INPUT: {
      const { id, answer } = msg;
      const updatedCards = updateCards({ id, answer }, cards);
      return { ...model, cards: updatedCards };
    }
    case MSGS.SAVE: {
      const { id } = msg;
      const updatedCards = updateCards({ id, edit: false }, cards);
      return { ...model, cards: updatedCards };
    }
    case MSGS.DELETE_CARD: {
      const { id } = msg;
      const updatedCards = cards.filter(card => card.id !== id);
      return { ...model, cards: updatedCards };
    }
    case MSGS.EDIT_CARD: {
      const { id } = msg;
      const updatedCards = updateCards({ id, edit: true }, cards);
      return { ...model, cards: updatedCards };
    }
    case MSGS.GRADE_ANSWER: {
      const { id, rank } = msg;
      const card = cards.find(e => e.id === id);
      let grade;
      if (rank === RANKS.BAD) grade = 0;
      else if (rank === RANKS.GOOD) grade = card.rank + 1;
      else if (rank === RANKS.GREAT) grade = card.rank + 2;
      const updatedCards = updateCards({ id, hiddenAnswer: true, rank: grade }, cards)
        .sort((a, b) => {
          if (a.rank < b.rank && a.id < b.id) return -1;
          if (a.rank > b.rank && a.id > b.id) return 1;
          return 0;
        });
      return { ...model, cards: updatedCards };
    }
    case MSGS.ADD_CARD: {
      const newCard = {
        id: nextId,
        question: '',
        answer: '',
        rank: 0,
        showAnswer: false,
        edit: true,
      };
      cards.unshift(newCard);
      return { ...model, cards, nextId: nextId + 1 };
    }
    default:
      return model;
  }
}

export default update;
