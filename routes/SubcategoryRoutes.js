const SubcategoryRouter = require("express").Router()
const { verifyAdmin } = require("../middlewares/authentication")
const { subcategoryUploader } = require("../middlewares/fileUploader")
const { createRecord,getRecord,getSingleRecord, updateRecord,deleteRecord } = require("../controllers/SubcategoryController")


SubcategoryRouter.post("",verifyAdmin, subcategoryUploader.single("pic"), createRecord)
SubcategoryRouter.get("", getRecord)
SubcategoryRouter.get("/:_id", getSingleRecord)
SubcategoryRouter.put("/:_id",verifyAdmin, subcategoryUploader.single("pic"), updateRecord)
SubcategoryRouter.delete("/:_id",verifyAdmin, deleteRecord)

module.exports = SubcategoryRouter