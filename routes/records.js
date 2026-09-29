const express = require("express");
const router = express.Router();
const recordsController = require("../controllers/recordsController");

// CRUD Endpoints
/**
 * @swagger
 * components:
 *   schemas:
 *     Record:
 *       type: object
 *       required:
 *         - studentId
 *         - name
 *         - course
 *       properties:
 *         studentId:
 *           type: string
 *           description: The unique identity profile string code of the student.
 *         name:
 *           type: string
 *           description: Full legal name registration string.
 *         course:
 *           type: string
 *           description: Main academic course assignment value.
 *         grado:
 *           type: string
 *         seccion:
 *           type: string
 *         year:
 *           type: integer
 *         grades:
 *           type: object
 *           properties:
 *             parcial1:
 *               type: integer
 *             parcial2:
 *               type: integer
 *             parcial3:
 *               type: integer
 *             parcial4:
 *               type: integer
 */
/**
 * @swagger
 * /records:
 *   get:
 *     summary: Retrieve a full list of student records
 *     responses:
 *       200:
 *         description: Successfully fetched a JSON array containing all matching student documents.
 */
router.get("/", recordsController.getAllRecords);

/**
 * @swagger
 * /records/{id}:
 *   get:
 *     summary: Find a student record by their unique studentId string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The target studentId property string.
 *     responses:
 *       200:
 *         description: Target student object matching criteria located.
 *       404:
 *         description: No student matching that parameter found.
 */
router.get("/:id", recordsController.getRecordById);

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Create and store a brand new student record profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Record'
 *     responses:
 *       201:
 *         description: Academic record profile stored successfully.
 */
router.post("/", recordsController.createRecord);

/**
 * @swagger
 * /records/{id}:
 *   put:
 *     summary: Update grades or details of a student using their studentId string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Target profile code string to modify.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Record'
 *     responses:
 *       200:
 *         description: Target academic profile data modified successfully.
 */
router.put("/:id", recordsController.updateRecord);

/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     summary: Permanently delete an academic file by its studentId string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Target profile code string to erase.
 *     responses:
 *       200:
 *         description: Targeted student record completely expunged from collection.
 */
router.delete("/:id", recordsController.deleteRecord);

module.exports = router;
