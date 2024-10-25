import {
  setCursorPosition,
  hasLink,
  getCurElement,
  deleteByBackspace,
  initializeSelection,
} from "./text-editor/text-editor";

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
} from "./text-editor/move";

import {
  createNewLine,
  createNormalSpan,
  createSelectedSpan,
  createGapSpan,
  createLinkClass,
} from "./text-editor/create";

import {
  selectToEnd,
  selectToStart,
  selectWithArrowDown,
  selectWithArrowLeft,
  selectWithArrowRight,
  selectWithArrowUp,
  selectWithPgDn,
  selectWithPgUp,
} from "./text-editor/selection";

import { varifySelected } from "./text-editor/varify";

import { getFirstSelected, getNextTextNode } from "./text-editor/get";

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
