const Cart = require("../models/Cart")

async function createRecord(req, res) {
    try {
        let data = new Cart(req.body)
        await data.save()

        let finalData = await Cart.findOne({ _id: data._id })
            .populate("user", ["name", "username", "email"])
            .populate({
                path: "product",
                select: "name brand color size finalPrice stockQuantity stock pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
        res.send({ result: "Done", data: finalData })
    } catch (error) {
        // console.log(error)
        let errorMessage = {}
        error.errors?.user ? errorMessage['user'] = error.errors?.user?.message : null
        error.errors?.product ? errorMessage['product'] = error.errors?.product?.message : null
        error.errors?.qty ? errorMessage['qty'] = error.errors?.qty?.message : null
        error.errors?.total ? errorMessage['total'] = error.errors?.total?.message : null

        Object.values(errorMessage).length == 0 ?
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
            res.send({ result: "Fail", reason: errorMessage })
    }
}

async function getRecord(req, res) {
    try {
        let data = await Cart.find({user:req.params.userid}).sort({ _id: -1 })
            .populate("user", ["name", "username", "email"])
            .populate({
                path: "product",
                select: "name brand color size finalPrice stockQuantity stock pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function getSingleRecord(req, res) {
    try {
        let data = await Cart.findOne({ _id: req.params._id })
            .populate("user", ["name", "username", "email"])
            .populate({
                path: "product",
                select: "name brand color size finalPrice stockQuantity stock pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", reason: "Record Not Found" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function updateRecord(req, res) {
    try {
        let data = await Cart.findOne({ _id: req.params._id })
        if (data) {
            data.qty = req.body.qty ?? data.qty
            data.total = req.body.total ?? data.total
            await data.save()

            let finalData = await Cart.findOne({ _id: data._id })
                .populate("user", ["name", "username", "email"])
                .populate({
                    path: "product",
                    select: "name brand color size finalPrice stockQuantity stock pic",
                    populate: {
                        path: "brand",
                        select: "-_id name"
                    },
                    options: {
                        slice: {
                            pic: 1
                        }
                    }
                })
            res.send({ result: "Done", data: finalData })
        }
        else
            res.status(404).send({ result: "Fail", reason: "Record Not Found" })
    } catch (error) {
        // console.log(error)
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }

        error.keyValue ?
            res.send({ result: "Fail", reason: "Cart Name is Already Exist" }) :
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Cart.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
            res.send({ result: "Done", message: "Record Has Been Deleted" })
        }
        else
            res.status(404).send({ result: "Fail", reason: "Record Not Found" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}
module.exports = {
    createRecord: createRecord,
    getRecord: getRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord
}