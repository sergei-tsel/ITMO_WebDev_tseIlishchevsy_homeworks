import { LOCAL_LIST_OF_TODOS, LOCAL_INPUT_TEXT } from '@/consts/local.js';
import Dom from '@/consts/dom.js';
import TodoVO from '@/model/vos/TodoVO.js';
import { disableButtonWhenTextInvalid } from '@/utils/domUtils.js';
import { isStringNotNumberAndNotEmpty } from '@/utils/stringUtils.js';
import { localStorageSaveListOfWithKey } from '@/utils/databaseUtils.js';
import { $, wrapDevOnlyConsoleLog } from '@/utils/generalUtils.js';
import TodoView from '@/view/TodoView.js';
import TodoServerService from '@/services/TodoServerService.js';

let listOfTodos = [];
let selectedTodoVO = null;
let selectedTodoViewItem = null;

const todoServerService = new TodoServerService('http://localhost:3003');

const hasSelectedTodo = () => !!selectedTodoVO;
const findTodoById = (id) => listOfTodos.find((vo) => vo.id === id);
const isTodoTitleUnique = (title) => !listOfTodos.some((todoVO) => todoVO.title === title);

wrapDevOnlyConsoleLog();

todoServerService
  .requestTodos()
  .then((todoList) => {
    console.log('> Initial env:', import.meta.env);
    console.log('> Initial value:', todoList);

    listOfTodos = todoList;
    $(Dom.INPUT_TODO_TITLE).value = localStorage.getItem(LOCAL_INPUT_TEXT);
    render_TodoListInContainer(listOfTodos, $(Dom.LIST_OF_TODOS));
    disableOrEnable_CreateTodoButtonOnTodoInputTitle();
  })
  .catch((error) => {
    $(Dom.APP).innerHTML = `
      <div id="errorOnInit">
        <h1>Problem with server</h1>
        <p style="color:red">${error.toString()}</p>
      </div>`;
  })
  .finally(() => ($(Dom.APP).style.visibility = 'visible'));

$(Dom.BTN_CREATE_TODO).addEventListener('click', onBtnCreateTodoClick);
$(Dom.INPUT_TODO_TITLE).addEventListener('keyup', onInpTodoTitleKeyup);
$(Dom.LIST_OF_TODOS).addEventListener('change', onTodoListChange);
$(Dom.LIST_OF_TODOS).addEventListener('click', onTodoDomItemClicked);

async function onTodoDomItemClicked(event) {
  const domElement = event.target;
  console.log('> onTodoDomItemClicked', domElement);

  if (!TodoView.isDomElementMatch(domElement)) {
    const isDeleteButton = TodoView.isDomElementDeleteButton(domElement);
    console.log('> \t isDeleteButton:', isDeleteButton);
    if (isDeleteButton) {
      const todoId = TodoView.getTodoIdFromDeleteButton(domElement);
      console.log('> \t todoId:', todoId);
      const todoVO = findTodoById(todoId);
      if (todoVO && confirm(`Delete: ${todoVO.title}?`)) {
        console.log('> \t Delete confirmed:', todoVO);
        domElement.disabled = true;
        todoServerService
          .deleteTodo(todoId)
          .then(() => {
            listOfTodos.splice(listOfTodos.indexOf(todoVO), 1);
            render_TodoListInContainer(listOfTodos, $(Dom.LIST_OF_TODOS));
            })
          .catch(() => {});
      }
    }
    return;
  }

  const clickedTodoVO = findTodoById(domElement.id);
  const isCurrentTodoSelected = selectedTodoVO === clickedTodoVO;
  if (hasSelectedTodo()) resetSelectedTodo();
  if (!isCurrentTodoSelected) {
    selectedTodoVO = clickedTodoVO;
    selectedTodoViewItem = domElement;
    $(Dom.BTN_CREATE_TODO).innerText = 'Update';
    $(Dom.INPUT_TODO_TITLE).value = clickedTodoVO.title;
    selectedTodoViewItem.style.backgroundColor = 'lightgray';
    await onInpTodoTitleKeyup();
  }
}

function onTodoListChange(event) {
  console.log('> onTodoListChange -> event:', event);
  const target = event.target;
  const index = target.id;
  if (index && typeof index === 'string') {
    const indexInt = parseInt(index.trim());
    const todoVO = listOfTodos[indexInt];
    console.log('> onTodoListChange -> todoVO:', indexInt, todoVO);
    todoVO.isCompleted = !!target.checked;
    save_ListOfTodo();
  }
}

async function onBtnCreateTodoClick(event) {
  // console.log('> domBtnCreateTodo -> handle(click)', this.attributes);
 await createTodoWhenPossible();
}

async function onInpTodoTitleKeyup(event) {
  console.log('> onInpTodoTitleKeyup:', event instanceof KeyboardEvent);
  if (!event && !(event instanceof KeyboardEvent)) return;
  const allowEnterCodes = ['Enter', 'NumpadEnter'];
  const isKeyEnter = allowEnterCodes.contains(event.code);
  console.log('> \t:', { isKeyEnter });
  if (isKeyEnter) {
    await createTodoWhenPossible().catch(({ isStringValid, isTitleNotUnique }) => {
     if(isStringValid) alert('String valid');
     if(isTitleNotUnique) alert('Title already exists');
    });
    return;
  }

  const inputValue = $(Dom.INPUT_TODO_TITLE).value;
  // console.log('> onInpTodoTitleKeyup:', inputValue);
  if (hasSelectedTodo()) {
    disableOrEnable_CreateTodoButtonOnTodoInputTitle(() => {
      return isStringNotNumberAndNotEmpty(inputValue) && selectedTodoVO.title !== inputValue;
    });
  } else {
    localStorage.setItem(LOCAL_INPUT_TEXT, inputValue);
    disableOrEnable_CreateTodoButtonOnTodoInputTitle(() => {
      return isStringNotNumberAndNotEmpty(inputValue) && isTodoTitleUnique(inputValue);
    });
  }
}

async function createTodoWhenPossible() {
  // console.log('> domBtnCreateTodo -> handle(click)', this.attributes);
  const todoTitle_Value_FromDomInput = $(Dom.INPUT_TODO_TITLE).value;
  // console.log('> domBtnCreateTodo -> todoInputTitleValue:', todoTitleValueFromDomInput);

  const isStringValid = isStringNotNumberAndNotEmpty(todoTitle_Value_FromDomInput);
  const isTitleUnique = isStringValid && isTodoTitleUnique(todoTitle_Value_FromDomInput);

  if (isStringValid && isTitleUnique) {
    const todoVO = create_TodoVOFromTextAndAddToList(todoTitle_Value_FromDomInput, listOfTodos);
    $(Dom.INPUT_TODO_TITLE).disabled = true;
    $(Dom.BTN_CREATE_TODO).disabled = true;
    await todoServerService
        .saveTodo(todoVO)
        .then((data) => {
          console.log('> domBtnCreateTodo -> onBtnCreateTodoClick: saved =', data);
          clear_InputTextAndLocalStorage();
          render_TodoListInContainer(listOfTodos, $(Dom.LIST_OF_TODOS));
          disableOrEnable_CreateTodoButtonOnTodoInputTitle();
        })
        .catch(alert)
        .finally(() => {
          $(Dom.INPUT_TODO_TITLE).disabled = false;
          $(Dom.BTN_CREATE_TODO).disabled = false;
        });
  } else {
    const isStringInvalid = !isStringValid;
    const isTitleNotUnique = !isTitleUnique;
    return Promise.reject({ isStringInvalid, isTitleNotUnique });
  }
}

function render_TodoListInContainer(listOfTodoVO, container) {
  let output = '';
  let todoVO;
  for (let index in listOfTodoVO) {
    todoVO = listOfTodoVO[index];
    output += TodoView.createSimpleViewFromVO(index, todoVO);
  }
  container.innerHTML = output;
}

function resetSelectedTodo() {
  console.log('> resetSelectedTodo -> selectedTodoVO:', selectedTodoVO);
  $(Dom.BTN_CREATE_TODO).innerText = 'Create';
  $(Dom.INPUT_TODO_TITLE).value = localStorage.getItem(LOCAL_INPUT_TEXT);
  selectedTodoViewItem.style.backgroundColor = '';
  selectedTodoVO = null;
  selectedTodoViewItem = null;
  disableOrEnable_CreateTodoButtonOnTodoInputTitle();
}

function create_TodoVOFromTextAndAddToList(input, listOfTodos) {
  console.log('> create_TodoFromTextAndAddToList -> input =', input);
  const newTodoVO = TodoVO.createFromTitle(input);
  listOfTodos.push(newTodoVO );
  return newTodoVO;
}

function clear_InputTextAndLocalStorage() {
  $(Dom.INPUT_TODO_TITLE).value = '';
  localStorage.removeItem(LOCAL_INPUT_TEXT);
}

function disableOrEnable_CreateTodoButtonOnTodoInputTitle(validateInputMethod = isStringNotNumberAndNotEmpty) {
  console.log(
    '> disableOrEnableCreateTodoButtonOnTodoInputTitle -> domInpTodoTitle.value =',
    $(Dom.INPUT_TODO_TITLE).value
  );
  const textToValidate = $(Dom.INPUT_TODO_TITLE).value;
  disableButtonWhenTextInvalid($(Dom.BTN_CREATE_TODO), textToValidate, validateInputMethod);
}

function save_ListOfTodo() {
  localStorageSaveListOfWithKey(LOCAL_LIST_OF_TODOS, listOfTodos);
}