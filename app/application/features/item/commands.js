const writeItemRepository = require('../../../repositories/itemsrepository/item.write.js');
const UpdateItemRequest = require('../../../entities/request/updateItemRequest.js');
const firebaseService = require('../../../services/firebaseService');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    async create(req, res) {
        if (!req.body) {
            return res.status(400).send();
        }

        const bucket = firebaseService.storage;
        const filename = uuidv4();
        const file = bucket.file(`images/${filename}.jpg`);
        const imageBuffer = req.file.buffer; 

        await file.save(imageBuffer, {
            metadata: {
              contentType: 'image/jpeg', // Adjust the content type as needed
            },
        });

        const [url] = await file.getSignedUrl({ action: 'read', expires: '01-01-2100' });
        const { name, description, price, quantity } = req.body;

        const newItem = {
            name,
            description,
            price: parseFloat(price),
            image: url,
            quantity: parseInt(quantity)
        };

        var result = await writeItemRepository.create(newItem);

        return res.status(200).json(result);
    },
    async update(req, res) {
        if (!req.body) {
            return res.status(400).send();
        }

        const requestItem = new UpdateItemRequest(req);

        var isUpdated = await writeItemRepository.update(requestItem);

        return this.generateResponse(isUpdated, res);
    },
    async delete(req, res) {
        var isDeleted = await writeItemRepository.delete(req.params.id);

        return this.generateResponse(isDeleted, res);
    },
    generateResponse(isSuccess, response) {
        if(isSuccess) {
            return response.status(409).send();
        }

        return response.status(201).send();
    }
}