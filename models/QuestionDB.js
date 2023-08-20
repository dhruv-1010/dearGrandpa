const mongoose = require('mongoose');
const testcaseSchema = new mongoose.Schema({
    input: {
      type: String,
      required: true
    },
    output: {  
      type: String,
      required: true
    }
  });

const problemSchema = new mongoose.Schema({
  problem_id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  testcases:[testcaseSchema],
  isSolved: {
    type: Boolean,
    default: false
  }
});

const Question = mongoose.model('Question', problemSchema);

module.exports = Question;
