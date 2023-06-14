export const isValidArray = (array: any[]): boolean => {
  if (array && Array.isArray(array) && array.length > 0) {
    return true;
  } else {
    return false;
  }
};

export const getValuesArrayObj = (array: Array<object>) => {
  const newArray = [];
  for (const obj of array) {
    newArray.push(Object.values(obj));
  }
  return newArray;
};

export function capitalizeString(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
