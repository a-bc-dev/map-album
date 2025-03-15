# MapAlbum API

MapAlbum is a RESTful API built with **Node.js**, **Express**, and **MySQL** to manage maps, markers, and multimedia content.

---

## 🚀 Installation & Setup

### **1️⃣ Clone this repository**

```sh
git clone https://github.com/Adalab/modulo-4-evaluacion-final-bpw-biancadragan.git
cd modulo-4-evaluacion-final-bpw-biancadragan
```

### **2️⃣ Install dependencies**

```sh
npm install
```

### **3️⃣ Create a **``** file** with your database credentials:

```sh
MYSQL_HOST=your_host
MYSQL_PORT=3306
MYSQL_USER=your_user
MYSQL_PASS=your_password
MYSQL_SCHEMA=mapalbum
PORT=3000
NODE_ENV=development
```

### **4️⃣ Start the database (MySQL)**

Make sure you have MySQL running and the required database/tables created.

### **5️⃣ Run the API**

```sh
npm start
```

Your server should now be running at [**http://localhost:3000**](http://localhost:3000) 🎉

---

## 📌 API Endpoints

### **Maps** `/maps`

| Method     | Endpoint                | Description            |
| ---------- | ----------------------- | ---------------------- |
| **GET**    | `/maps?page=1&limit=10` | Get paginated maps     |
| **GET**    | `/maps/:idMap`          | Get a single map by ID |
| **POST**   | `/maps`                 | Create a new map       |
| **PUT**    | `/maps/:idMap`          | Update a map           |
| **DELETE** | `/maps/:idMap`          | Delete a map           |

### **Markers** `/markers`

| Method     | Endpoint                   | Description           |
| ---------- | -------------------------- | --------------------- |
| **GET**    | `/markers?page=1&limit=10` | Get paginated markers |
| **GET**    | `/markers/:idMarker`       | Get a single marker   |
| **POST**   | `/markers`                 | Create a new marker   |
| **PUT**    | `/markers/:idMarker`       | Update a marker       |
| **DELETE** | `/markers/:idMarker`       | Delete a marker       |

### **Multimedia** `/multimedia`

| Method     | Endpoint                      | Description                   |
| ---------- | ----------------------------- | ----------------------------- |
| **GET**    | `/multimedia?page=1&limit=10` | Get paginated multimedia      |
| **GET**    | `/multimedia/:idMultimedia`   | Get a single multimedia entry |
| **POST**   | `/multimedia`                 | Create a new multimedia entry |
| **PUT**    | `/multimedia/:idMultimedia`   | Update a multimedia entry     |
| **DELETE** | `/multimedia/:idMultimedia`   | Delete a multimedia entry     |

---

## 🔍 Running Tests

To run the test suite, make sure your database is set up, then:

```sh
npm test
```

If you encounter a **port conflict** (`EADDRINUSE` error), stop any existing processes on port 3000:

```sh
lsof -i :3000
kill -9 $(lsof -t -i:3000)
```

Then, retry `npm test`.

---

## 🛠 Built With

- **Node.js** + **Express** for the backend
- **MySQL** for database storage
- **Jest + Supertest** for testing

---

## 📜 License

This project is licensed under the MIT License.

---

## 💡 Author

**Bianca Dragan**

> If you find this useful, give it a ⭐️ on GitHub! 😊

