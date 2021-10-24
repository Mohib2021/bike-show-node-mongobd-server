const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = 5000;

// middleWar
app.use(cors());
app.use(express.json());

const uri =
	"mongodb+srv://Mohib:Mohib@cluster0.nr9ns.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const run = async () => {
	try {
		//connecting and configuring database
		await client.connect();
		const database = client.db("foodPanda");
		const productCollection = database.collection("product");

		// showing products by sending
		// GET API
		app.get("/products", async (req, res) => {
			const cursor = productCollection.find({});
			const products = await cursor.toArray();
			res.send(products);
		});

		// POST API
		app.post("/products", async (req, res) => {
			const product = req.body;
			const result = await productCollection.insertOne(product);
			res.json(result);
		});

		// PUT API
		app.put("/products/:id", async (req, res) => {
			const id = req.params.id;
			const filter = { _id: ObjectId(id) };
			const product = req.body;
			const options = { upsert: true };
			const updateDoc = {
				$set: {
					name: product.name,
					price: product.price,
					description: product.description,
				},
			};
			const result = await productCollection.updateOne(
				filter,
				updateDoc,
				options
			);
			res.json(result);
			console.log("hitting the put method");
		});

		// DELETE API
		app.delete("/products/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await productCollection.deleteOne(query);
			console.log("hitting delete api");
			res.json(result);
		});

		// GET API
		app.get("/products/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await productCollection.findOne(query);
			console.log("hitting the get inside update");
			res.send(result);
		});
	} finally {
		// app.close()
	}
};
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("server is working");
});

app.listen(port, () => {
	console.log("server is running on ", port);
});
