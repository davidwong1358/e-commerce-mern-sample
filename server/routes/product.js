const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { returnDocument: 'after' }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = req.body.length;
    for (let i = 0; i < cart; i++) {
      let product = await Product.findOne({ code: req.body[i].code });

      const index = product.sku.findIndex(obj => {
        return obj._id.toString() === req.body[i].sku._id;
      });

      const newStock = req.query.operation === 'add' ?
        product.sku[index].inStock + req.body[index].quantity :
        product.sku[index].inStock - req.body[index].quantity;
    
      const result = await Product.findByIdAndUpdate(
        product._id,
        {
          $set: {
            [`sku.${index}.inStock`]: newStock
          }
        },
        { returnDocument: 'after' }
      )
    }
    res.status(200).json('Update Success');
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
})

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json(`Deleted product ${req.params.id}`);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qTitle = req.query.title;
  const qCategory = req.query.category;
  const qCode = req.query.code;

  try {
    let products;
    if (qTitle) {
      products = await Product.find({ "title": { $regex: qTitle, $options: 'i' } });
    } else if (qCategory) {
      if (qCategory === 'Any') {
        products = await Product.find();
      } else {
        products = await Product.find({ category: qCategory });
      }

    } else if (qCode) {
      products = await Product.find({ "code": { $regex: qCode, $options: 'i' } });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;