const Restaurant = require('../models/restaurantsModel');
const Trip = require('../models/tripModel');


const addRestaurant = async (req, res) => {
  try {
    const { name, address, cuisine, price } = req.body;
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const restaurant = await Restaurant.create({
      tripId,
      name,
      location: {
        address: address?.trim() || '',
      },
      cuisine,
      priceRange: price || '$$',
      visited: false,
    });

    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Add restaurant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getRestaurants = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const restaurants = await Restaurant.find({ tripId }).sort('name');
    res.json(restaurants);
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const trip = await Trip.findById(restaurant.tripId);
    if (!trip || trip.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const fields = ['name', 'cuisine', 'price', 'address'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'address') {
          restaurant.location.address = req.body.address;
        } else if (field === 'price') {
          restaurant.priceRange = req.body.price;
        } else {
          restaurant[field] = req.body[field];
        }
      }
    });

    const updated = await restaurant.save();
    res.json(updated);
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const trip = await Trip.findById(restaurant.tripId);
    if (!trip || trip.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await restaurant.deleteOne();
    res.json({ message: 'Restaurant removed' });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const toggleVisitStatus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const trip = await Trip.findById(restaurant.tripId);
    if (!trip || trip.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    restaurant.visited = !restaurant.visited;
    const updated = await restaurant.save();

    res.json(updated);
  } catch (error) {
    console.error('Toggle visit status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addRestaurant,
  getRestaurants,
  updateRestaurant,
  deleteRestaurant,
  toggleVisitStatus
};
