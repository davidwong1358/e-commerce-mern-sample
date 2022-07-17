const Order = require("../models/Order");

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

const sortType = (sort) => {
    switch(sort){
        case 'asc-time': return {"createdAt": 1};
        case 'desc-time': return {"createdAt": -1};
        case 'asc-price': return {"total": 1};
        case 'desc-price': return {"total": -1};
        default: return {};
    }
}

router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/find/:orderId', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.findById(req.params.orderId);
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/user/:id", verifyTokenAndAuthorization, async (req, res) => {
    let sort = sortType(req.query.sort);
    try {
        const orders = await Order.find({
            "userInfo._id": req.params.id,
            "createdAt": {
                $gte: new Date(`${req.query.startDate}T00:00:00`),
                $lte: new Date(`${req.query.endDate}T23:59:59`)
            },
            status: req.query.status !== 'Any' ? req.query.status : { $regex: '', $options: 'i' }
        }).sort(sort);
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    let sort = sortType(req.query.sort);
    try {
        const orders = await Order.find({
            "userInfo.username": { $regex: req.query.user, $options: 'i' },
            "createdAt": {
                $gte: new Date(`${req.query.startDate}T00:00:00`),
                $lte: new Date(`${req.query.endDate}T23:59:59`)
            },
            status: req.query.status !== 'Any' ? req.query.status : { $regex: '', $options: 'i' }
        }).sort(sort);
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { returnDocument: 'after' }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;