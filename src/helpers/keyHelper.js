export const generateKey = (pre = "react123") => {
  return `${ pre }_${ new Date().getTime() }_${ Math.floor(Math.random() * 99999) + 1 }`;
}