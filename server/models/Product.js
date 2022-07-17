const mongoose = require('mongoose');

const SkuSchema = new mongoose.Schema(
    {
        itemName: { type: String, required: true },
        price: { type: Number, default: 0 },
        unit: { type: String, default: "Piece(s)" },
        inStock: { type: Number, default: 0 },
        img: { type: String, default: '' },
        discount: { type: Number, default: 0 }
    }
);

const ProductSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        coverImg: { type: String, default: '' },
        category: { type: String, required: true },
        sku: [SkuSchema]

    },
    { timestamps: true }
)

module.exports = mongoose.model("Product", ProductSchema);