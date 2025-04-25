const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');

const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  uploadDocument,
} = require('../controllers/tripController');

router.route('/').get(auth, getTrips).post(auth, createTrip);

router
  .route('/:id')
  .get(auth, getTripById)
  .put(auth, updateTrip)
  .delete(auth, deleteTrip);

router.use('/:tripId/packing', auth, require('./packingRoute'));
router.use('/:tripId/budget', auth, require('./budgetRoute'));
router.use('/:tripId/restaurants', auth, require('./restaurantsRoute'));
router.use('/:tripId/monuments', auth, require('./monumentsRoute'));

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/documents/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Route to handle document upload
router.post('/:id/upload', auth, upload.single('document'), uploadDocument);

module.exports = router;
