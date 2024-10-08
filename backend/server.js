import connectDatabase from './config/db.config.js';
import app from './app.js';

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    connectDatabase();
    console.log("Server is Running Port", PORT);
})