const router = require('express').Router();
const marketplaceCtrl = require('../controllers/marketplace.controllers');
const { auth } = require('../middleware/auth');

router.get('/products', auth, marketplaceCtrl.getProduct);
router.post('/keywords', auth, marketplaceCtrl.getKeywords);

module.exports = router;
