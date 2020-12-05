const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const valuesSchema = new Schema ({
    assignee: [String],
    category: [String],
    status: [String],
    priority: [String]
});

const Value = mongoose.model('values', valuesSchema);
module.exports = Value;