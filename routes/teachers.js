const express = require("express");
const router = express.Router();
const teachersController = require("../controllers/teachersController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       required:
 *         - teacherId
 *         - name
 *         - department
 *         - email
 *       properties:
 *         teacherId:
 *           type: string
 *         name:
 *           type: string
 *         department:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 */

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Retrieve a full list of teacher profiles
 *     responses:
 *       200:
 *         description: Successfully fetched a JSON array containing all teacher documents.
 */
router.get("/", teachersController.getAllTeachers);

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Find a teacher record by their teacherId string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Target teacher profile located.
 *       404:
 *         description: Teacher record not found.
 */
router.get("/:id", teachersController.getTeacherById);

/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Store a brand new teacher record profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       201:
 *         description: Teacher profile stored successfully.
 *       400:
 *         description: Validation failed due to missing required attributes.
 */
router.post("/", teachersController.createTeacher);

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Update details of a teacher by their teacherId string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: Teacher profile modified successfully.
 *       400:
 *         description: Validation failed due to empty payload parameters.
 */
router.put("/:id", teachersController.updateTeacher);

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Permanently delete a teacher file by its teacherId string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher profile completely expunged from database.
 */
router.delete("/:id", teachersController.deleteTeacher);

module.exports = router;
