import {
  setCursorPosition,
  hasLink,
  getCurElement,
  deleteByBackspace,
  initializeSelection,
} from "./text-editor1/text-editor";

import {
  moveRight,
  moveLeft,
  moveEnd,
  movePageDown,
  movePageUp,
  moveStart,
  movedown,
  moveup,
  moveToDifferentLine,
} from "./text-editor1/move";

import {
  createNewLine,
  createNormalSpan,
  createSelectedSpan,
  createGapSpan,
  createLinkClass,
} from "./text-editor1/create";

import {
  selectToEnd,
  selectToStart,
  selectWithArrowDown,
  selectWithArrowLeft,
  selectWithArrowRight,
  selectWithArrowUp,
  selectWithPgDn,
  selectWithPgUp,
} from "./text-editor1/selection";

import { varifySelected } from "./text-editor1/varify";

import { getFirstSelected, getNextTextNode } from "./text-editor1/get";

export {
  createNewLine,
  createNormalSpan,
  createSelectedSpan,
  createGapSpan,
  createLinkClass,
  moveLeft,
  moveRight,
  moveEnd,
  movePageDown,
  movePageUp,
  moveStart,
  movedown,
  moveup,
  moveToDifferentLine,
  selectToEnd,
  selectToStart,
  selectWithArrowDown,
  selectWithArrowLeft,
  selectWithArrowRight,
  selectWithArrowUp,
  selectWithPgDn,
  selectWithPgUp,
  setCursorPosition,
  hasLink,
  getCurElement,
  deleteByBackspace,
  initializeSelection,
  varifySelected,
  getFirstSelected,
  getNextTextNode,
};
