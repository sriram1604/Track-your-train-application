# 🚆 Train Search Web Application  

A web-based platform to search trains between two stations, view train details, and sort by price.  
The application also supports connecting trains for multi-leg journeys and calculates ticket prices based on distance.  

---

## 📌 Features  

- **Source & Destination Selection** – Choose stations from dropdown menus.  
- **Train Listings** – Display train name, departure & arrival times, distance, and price.  
- **Sorting** – Sort trains based on price (ascending/descending).  
- **Dynamic Price Calculation** – Price = ₹ 1.25 × distance (in km).  
- **Multi-leg Routes** – Suggests connecting trains if a direct train is unavailable.  
- **Scalability** – Handles 1000+ trains and multiple routes.  
- **Test Data Generator** – Script to populate database with 1000 random trains for testing.  

---

## 🛠 Tech Stack  

### **Frontend**
- React.js  
- Tailwind CSS (for UI styling)  

### **Backend**
- Node.js  
- Express.js  

### **Database**
- MongoDB  

---

## 📂 Folder Structure  

```
train-search-app/
│── backend/
│   ├── index.js            # Express server entry
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── controllers/        # Request handlers
│   ├── utils/               # Helper functions
│   ├── seed.js              # Test data generation script
│
│── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # App pages
│   │   ├── App.jsx         # Main app file
│   │   ├── index.js        # Entry point
│
│── README.md
│── package.json
```

---

## ⚙️ Installation & Setup  

### **1️⃣ Clone the repository**  
```bash
git clone https://github.com/your-username/train-search-app.git
cd train-search-app
```

### **2️⃣ Backend Setup**  
```bash

npm install
```

Create `.env` file in **parent** folder:  
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/trainsearch
```

Start backend server:  
```bash
npm start
```

---

### **3️⃣ Frontend Setup**  
```bash
cd frontend
npm install
npm run dev
```



## 📡 API Endpoints  

| Method | Endpoint            | Description |
|--------|--------------------|-------------|
| GET    | `/api/stations`    | Get list of stations |
| POST   | `/api/search`      | Search trains for a route |

---

## 📊 Price Calculation Formula  

```
Price = Distance (km) × ₹ 1.25
```

Example:  
```
Distance: 420 km → Price = 420 × 1.25 = ₹ 525
```

---

## 📷 Example UI  

**Search Page**  
- Dropdown for source & destination  
- Search button  

**Results Page**  
- List of trains with:
  - Train Name  
  - Departure Time  
  - Arrival Time  
  - Distance  
  - Price (₹)  
- Sort by Price button  

---

## 🚀 Future Enhancements  
- Sort by **Departure Time**.  
- Add **seat availability** & booking system.  
- Integration with **real-time train API**.  

---

## 📝 Demo
[DEMO-TrackYourTrain](https://track-your-train.onrender.com)
