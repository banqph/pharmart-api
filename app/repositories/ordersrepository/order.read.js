const Order = require('../../models/order.js');

module.exports = {
    async get() {
        return await Order.find();
    },
    async getById(id) {
        return await Item.findById(id);
    }
}