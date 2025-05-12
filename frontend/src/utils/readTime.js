// Export a function called calculateReadTime that takes content as input.
export function calculateReadTime(content) {
  // Define the average reading speed in words per minute.
  const wordsPerMinute = 200;
  // Calculate the number of words in the content by trimming whitespace and splitting the string into an array of words.
  const wordCount = content.trim().split(/\s+/).length;
  // Calculate the read time in minutes by dividing the word count by the words per minute and rounding up to the nearest whole number.
  return Math.ceil(wordCount / wordsPerMinute);
}
