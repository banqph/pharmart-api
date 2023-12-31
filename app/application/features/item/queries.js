const readItemRepository = require('../../../repositories/itemsrepository/item.read.js');

module.exports = {
    async get(req, res) {
        var items = await readItemRepository.get();

        res.status(200).send(items);
    },
    async getById(req, res) {
        var user = await readItemRepository.getById(req.params.id);

        res.status(200).send(user);
    }
}