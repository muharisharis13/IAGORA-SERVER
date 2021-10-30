const mongoose = require('mongoose');
const Schema = mongoose.Schema;


exports.ObjectId  = Schema.Types.ObjectId

exports.ObjectId1 = (props) =>mongoose.Types.ObjectId(props)

