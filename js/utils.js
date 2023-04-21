export const toMinAndSec = S => {
  S = Math.floor(S);
  const M = Math.floor(S / 60);
  return `${(M + "").padStart(2, "0")}:${(S - 60 * M + "").padStart(2, "0")}`;
};

export const shuffle = array => array.sort(() => 0.5 - Math.random());



// ------------------------------------
// const formatTime = time => (time < 10 ? `0${time}` : time); //pad or some----------------------

// export const toMinAndSec = duration => {
//   const minutes = formatTime(Math.floor(duration / 60));
//   const seconds = formatTime(Math.floor(duration - 60 * minutes));

//   return `${minutes}:${seconds}`;
// };

// export const shuffle = array => array.sort(() => 0.5 - Math.random()); //? * !-
// ===========================
// 'abc'.padStart(10);         // "       abc"
// 'abc'.padStart(10, "foo");  // "foofoofabc"
// 'abc'.padStart(6,"123465"); // "123abc"
// 'abc'.padStart(8, "0");     // "00000abc"
// 'abc'.padStart(1);          // "abc"
