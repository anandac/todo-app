const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");

const controller = require("../controllers/index");

router.post("/api/tasks/create", controller.addTodo);
router.post("/api/sub_tasks/create/:parent_id", controller.addSubTodo);
router.put("/api/tasks/update/:id", controller.updateTodo);
router.get("/api/tasks/show/:id", controller.showTodo);
router.get("/api/tasks/show", controller.showAll);
router.delete("/api/tasks/delete/:id", controller.deleteTodo);
router.get("/api/tasks/search", controller.searchTodo);
router.post("/api/tasks/search", controller.searchTodo);

module.exports = router;
