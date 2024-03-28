// Import necessary packages and modules
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

// Define interfaces for Grocery Item and Order
interface GroceryItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  userId: string;
  items: GroceryItem[];
}

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/grocery_booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// Create schemas for Grocery Item and Order
const groceryItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema({
  userId: String,
  items: [groceryItemSchema],
});

const GroceryItemModel = mongoose.model('GroceryItem', groceryItemSchema);
const OrderModel = mongoose.model('Order', orderSchema);

// Initialize Express app
const app = express();
app.use(express.json());

// Admin Endpoints
app.post('/admin/items', async (req: Request, res: Response) => {
  try {
    const { name, price, quantity } = req.body;
    const newItem = await GroceryItemModel.create({ name, price, quantity });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Could not add item' });
  }
});

app.get('/admin/items', async (_req: Request, res: Response) => {
  try {
    const items = await GroceryItemModel.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch items' });
  }
});

app.put('/admin/items/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, quantity } = req.body;
    await GroceryItemModel.findByIdAndUpdate(id, { name, price, quantity });
    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not update item' });
  }
});

app.delete('/admin/items/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await GroceryItemModel.findByIdAndDelete(id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete item' });
  }
});

// User Endpoints
app.get('/user/items', async (_req: Request, res: Response) => {
  try {
    const items = await GroceryItemModel.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch items' });
  }
});

app.post('/user/orders', async (req: Request, res: Response) => {
  try {
    const { userId, items } = req.body;
    const newOrder = await OrderModel.create({ userId, items });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Could not create order' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
