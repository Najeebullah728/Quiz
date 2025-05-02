const quizQuestions = [
  {
    id: 1,
    type: "multipleChoice",
    question: "What is the correct way to create a string in Python?",
    options: [
      { id: "A", text: "string = Hello" },
      { id: "B", text: "string = 'Hello'" },
      { id: "C", text: "string = Hello'" },
      { id: "D", text: "string = Hello\"" }
    ],
    correctAnswer: "B"
  },
  {
    id: 2,
    type: "multipleChoice",
    question: "What will print(\"Python\"[3]) output?",
    options: [
      { id: "A", text: "h" },
      { id: "B", text: "t" },
      { id: "C", text: "o" },
      { id: "D", text: "y" }
    ],
    correctAnswer: "A"
  },
  {
    id: 3,
    type: "multipleChoice",
    question: "Which method converts all characters to uppercase?",
    options: [
      { id: "A", text: "upper()" },
      { id: "B", text: "lower()" },
      { id: "C", text: "capitalize()" },
      { id: "D", text: "replace()" }
    ],
    correctAnswer: "A"
  },
  {
    id: 4,
    type: "fillInTheBlank",
    question: "_______ method removes white spaces from both ends of the string.",
    correctAnswer: "strip"
  },
  {
    id: 5,
    type: "fillInTheBlank",
    question: "To find the length of a string, we use _________ function.",
    correctAnswer: "len"
  },
  {
    id: 6,
    type: "coding",
    question: "Write a Python program to join two strings: \"Good\" and \"Night\" with a space in between.",
    correctAnswer: "\"Good\" + \" \" + \"Night\""
  },
  {
    id: 7,
    type: "shortAnswer",
    question: "What will be the output of this code?\n\ntext = \"Python Programming\"\nprint(text[0:6])",
    correctAnswer: "Python"
  }
];

export default quizQuestions;
