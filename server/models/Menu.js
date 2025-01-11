const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    chefId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    items: [{
        id: String,
        name: String,
        description: String,
        courseType: String,
        dietaryInfo: Object,
        ingredients: [String],
        allergens: [String],
        preparationTime: Number
    }],
    pricePerPerson: { type: Number, required: true },
    minimumGuests: { type: Number, default: 2 },
    maximumGuests: { type: Number, default: 10 },
    preparationTime: { type: Number },
    availableDays: [String],
    advanceNotice: { type: Number },
    status: { type: String, default: 'draft' },
    cuisine: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Menu', menuSchema);