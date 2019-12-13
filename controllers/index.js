module.exports = {
  addTodo: (req, res) => {
    let body = req.body;
    if (!req.body.title || req.body.title < 1) {
      res
        .status(400)
        .send("Title unidentified or minimum of 1 char is required");
      return;
    }
    const task = {
      ...body
    };
    if (body.title && body.label && body.status) {
      insertTask("tasks", task);
    }
    res.send(task);
  },

  addSubTodo: async (req, res) => {
    const p_id = req.params.parent_id;
    console.log("req", req.params);
    let body = req.body;
    if (!req.body.title || req.body.title < 1) {
      res
        .status(400)
        .send("Title unidentified or minimum of 1 char is required");
      return;
    }
    const subtask = {
      ...body,
      id: p_id
    };
    insertSubtask("tasks", subtask);
    res.send(subtask);
  },

  updateTodo: async (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    var task = await updateTask(id, title, "tasks");
    res.send(task);
  },

  showTodo: async (req, res) => {
    const id = req.params.id;
    var task = await findTask(id, "tasks");
    res.send(task);
  },

  deleteTodo: (req, res) => {
    console.info(req, res);
    const id = req.params.id;
    console.log(id);
    var task = deleteTask(id, "tasks");
    res.send("Task deleted");
  },

  showAll: async (req, res) => {
    var task = await findAll("tasks");
    res.send(task);
  },

  searchTodo: async (req, res) => {
    var body = { ...body };
    var title = body.title;
    console.log(title);
    var task = searchTask(title, "tasks");
    res.send(task);
  }
};

async function insertTask(collection, task) {
  var mongoUtil = require("./mongoDB");
  var db = await mongoUtil.connectDB();
  const res = await db.collection(collection).insertOne(task);
  return res;
}

async function insertSubtask(collection, subtask) {
  var mongoUtil = require("./mongoDB");
  var db = await mongoUtil.connectDB();
  var ObjectId = require("mongodb").ObjectId;
  var o_id = new ObjectId(subtask.id);
  console.log(o_id);
  const res = await db
    .collection(collection)
    .update({ _id: o_id }, { $push: { subtasks: subtask } });
  return res;
}
async function findTask(id, collection) {
  var mongoUtil = require("./mongoDB");
  var db = await mongoUtil.connectDB();
  var ObjectId = require("mongodb").ObjectId;
  var o_id = new ObjectId(id);
  const res = await db.collection(collection).findOne({ _id: o_id });
  return res;
}

async function findAll(collection) {
  var mongoUtil = require("./mongoDB");
  var db = await mongoUtil.connectDB();
  const res = await db
    .collection(collection)
    .find({})
    .toArray();
  console.log("inner function", res);
  return res;
}

async function deleteTask(id, collection) {
  var mongoUtil = require("./mongoDB");
  var db = await mongoUtil.connectDB();
  var ObjectId = require("mongodb").ObjectId;
  var o_id = new ObjectId(id);
  const res = await db.collection(collection).findOneAndDelete({ _id: o_id });
  return res;
}

async function updateTask(id, title, collection) {
  var mongoUtil = require("./mongoDB");
  var db = await mongoUtil.connectDB();
  var ObjectId = require("mongodb").ObjectId;
  var o_id = new ObjectId(id);
  var title = title;
  const res = await db
    .collection(collection)
    .findOneAndUpdate({ _id: o_id }, { $set: { title: title } });
  return res;
}

async function searchTask(title, collection) {
  var mongoUtil = require("./mongoDB");
  var db = await mongoUtil.connectDB();
  console.log(title);
  const res = await db
    .collection(collection)
    .find({ title: title }, function(err, data) {
      if (err) console.error(err);
      // console.log("hyhjghgj", data);
    });
  return res;
}
