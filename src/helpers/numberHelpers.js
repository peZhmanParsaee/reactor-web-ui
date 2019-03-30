export const separateDigits = ({ number, showCurrency = false }) => {
  let formattedNumber = new Intl.NumberFormat().format(number);
  if (showCurrency) {
    formattedNumber += " تومان";
  }
  return formattedNumber;
};