export const generateKey = (pre = 'react123') => `${pre}_${new Date().getTime()}_${Math.floor(Math.random() * 99999) + 1}`;
