/**
 * Remove all characters and empty spaces of a phone number
 * @function formatNumberForBE
 * @param {phoneNumber}  - the phone number the user entered
 */
export function formatNumberForBE(phoneNumber) {
  if (!phoneNumber) return '';
  const removeEmptySpacesPhoneNumber = phoneNumber
    .toString()
    .replace(/\s+/g, '');
  const removeSpecialCharactersNumber = removeEmptySpacesPhoneNumber.replace(
    /[^a-zA-Z0-9 ]/g,
    '',
  );
  return removeSpecialCharactersNumber;
}
