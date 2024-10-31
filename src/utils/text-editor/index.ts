import { setCursorPosition } from "./set";

import {
  moveRight,
  moveLeft,
  moveUp,
  moveDown,
  moveStart,
  moveEnd,
  movePageUp,
  movePageDown,
} from "./move";

import {
  getXCoord,
  getTargetAndRemainedLength,
  getIndexInTarget,
  getTargetAndIndex,
  getCurElement,
} from "./get";

import {
  selectRight,
  selectLeft,
  selectUp,
  selectDown,
  selectStart,
  selectEnd,
  selectPageUp,
  selectPageDown,
} from "./selection";

import { hasLink, checkValidLink } from "./has";

import { createSpan, createLink } from "./create";

export {
  setCursorPosition,
  moveRight,
  moveLeft,
  moveUp,
  moveDown,
  moveStart,
  moveEnd,
  movePageUp,
  movePageDown,
  getXCoord,
  getTargetAndRemainedLength,
  getIndexInTarget,
  getTargetAndIndex,
  getCurElement,
  selectRight,
  selectLeft,
  selectUp,
  selectDown,
  selectStart,
  selectEnd,
  selectPageUp,
  selectPageDown,
  hasLink,
  checkValidLink,
  createSpan,
  createLink,
};
