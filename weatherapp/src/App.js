import { diff, patch } from 'virtual-dom';
import createElement from 'virtual-dom/create-element';
import axios from 'axios';

const action = (dispatch, command, model) => {
  if (command === null) return;
  const { request, weatherMessage, weatherErrorMessage } = command;
  const { nextId } = model;
  axios(request)
    .then(res => dispatch(weatherMessage(nextId - 1, res.data)))
    .catch(err => dispatch(weatherErrorMessage(err)));
};

function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    const updates = update(msg, model);
    const isArray = Array.isArray(updates);
    model = isArray ? updates[0] : updates;
    const command = isArray ? updates[1] : null;
    action(dispatch, command, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

export default app;
