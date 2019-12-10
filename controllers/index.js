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

  updateTodo: (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
      res.status(404).send("The task with the given ID not found");
      return;
    }

    if (!req.body.title || req.body.title < 1) {
      res
        .status(400)
        .send("Title unidentified or minimum of 1 char is required");
      return;
    }

    task.title = req.body.title;
    res.send(task);
  },

  showTodo: async (req, res) => {
    const id = req.params.id;
    var task = await findTask(id, "tasks");
    res.send(task);
  },

  deleteTodo: (req, res) => {
    const _id = req.params.id;
    var task = deleteTask(_id, "tasks");
    res.send("Task deleted");
  },

  showAll: async (req, res) => {
    var task = await findAll("tasks");
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
  const res = await db.collection(collection).deleteOne({ id: parseInt(id) });
  return res;
}
