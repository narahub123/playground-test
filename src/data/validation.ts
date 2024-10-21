// 이름 1자 ~ 30자 문자 제약 없음
const validName = /^[\s\S]{1,30}$/;

// 성별 m: 남성, f: 여성, b: 양성, n: 중립, a: 무성 h: 숨김
const valideGender = /^[mfbnah]$/;

// 이메일
const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// birth 숫자 8자리
const validBirth = /^[0-9]{8}$/;

// password: 영어 대소문자, 숫자, 특수문자가 적어도 하나 이상 존재 최소 8자 최대 30자
const validPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(){}\[\].,+\-*/=_~|\\?:;"'<>]).{8,30}$/;

// id(handle) : 영어 대소문자로 시작, 숫자, 특수문자 -,_사용 가능 최소 4자 최대 30자
// 멘션의 유효성에도 들어감
const regExp = /^[a-zA-Z][a-zA-Z0-9_]{4,29}$/i;
const validId = regExp;
const validMention =
  /(?<=^|\s|[^a-zA-Z0-9!@#$%&*_])@[a-zA-Z][a-zA-Z0-9_]{0,29}(?=\s|[^a-zA-Z0-9@_]|$)/g; // 이해 필요

// ip : xxx.xxx.xxx.xxx 형식 ipv4인 경우
const validIp =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

// 해시 태그 : 언어 구분 없는 문자, 숫자, _
const validHashtag =
  /(?<=^|\s|[^가-힣ㄱ-ㅎㅏ-ㅣ\p{L}\p{N}!@#$%&*_])#[가-힣ㄱ-ㅎㅏ-ㅣ\p{L}\p{N}_]+(?=\s|[^가-힣ㄱ-ㅎㅏ-ㅣ\p{L}\p{N}_#]|$)/gu;

// url : 가장 복잡한 구조의 url에 대한 정규 표현식 (gpt 이용)
// const validURL =
//   /(?<=^|\s|[^a-zA-Z0-9@.-_])(?:(https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}(?::\d{2,5})?(?:\/[^\s?#]*)?(?:\?[^\s#]*)?(?:#[^\s]*)?(?=\s|[^a-zA-Z0-9@.+-]|$)/g;
const validURL = // 패스워드 도메인 제외
  /(?<=^|\s|[^a-zA-Z0-9@.-_])(?:(https?|ftp):\/\/)?(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}(?::\d{2,5})?(?:\/[^\s?#]*)?(?:\?[^\s#]*)?(?:#[^\s]*)?(?=\s|[^a-zA-Z0-9@.+-]|$)/g;

export {
  validName,
  valideGender,
  validEmail,
  validBirth,
  validPassword,
  validId,
  validMention,
  validIp,
  validHashtag,
  validURL,
};
