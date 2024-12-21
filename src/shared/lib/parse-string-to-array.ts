/**
 * Converts a string-formatted array to a valid array of strings.
 * @param inputString - The string-formatted array to be converted.
 * @returns An array of strings if conversion is successful; otherwise, an empty array.
 */
export default function parseStringToArray(
  inputString: string | undefined
): string[] {
  if (!inputString) {
    // Return an empty array if the input is undefined, null, or an empty string
    return [];
  }

  try {
    // Add double quotes around elements and parse the adjusted string
    return JSON.parse(inputString.replace(/(\w+[-\w]+)/g, '"$1"'));
  } catch (error) {
    console.error("Error parsing string to array:", error);
    return [];
  }
}
