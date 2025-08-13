import express from 'express';
import database from './db/database.js';
import dotenv from "dotenv";
import Train from './model/trains.js';
import cors from 'cors';
import path from 'path';



const app = express();


app.use(express.json());

app.use(cors());
dotenv.config();
database();

const __dirname = path.resolve();


app.get("/search", async (req, res) => {
  try {
    const { source, destination } = req.query;
    if (!source || !destination) {
      return res.status(400).json({ message: "Please provide source and destination" });
    }

    const cleanSource = source.trim().toLowerCase();
    const cleanDestination = destination.trim().toLowerCase();

    
    const trains = await Train.find({
      $and: [
        { "stops.station": { $regex: new RegExp(`^${cleanSource}$`, "i") } },
        { "stops.station": { $regex: new RegExp(`^${cleanDestination}$`, "i") } }
      ]
    }).lean();

    let directRoutes = [];
    let connections = [];

    
    for (let train of trains) {
      const stops = train.stops;
      const sourceIdx = stops.findIndex(s => s.station.trim().toLowerCase() === cleanSource);
      const destIdx = stops.findIndex(s => s.station.trim().toLowerCase() === cleanDestination);

      if (sourceIdx !== -1 && destIdx !== -1 && sourceIdx < destIdx) {
        const startStop = stops[sourceIdx];
        const endStop = stops[destIdx];
        const distance = endStop.distance - startStop.distance;
        const price = distance * 1.25; // example price calculation

        directRoutes.push({
          train: train.name,
          trainno : train.train_no,
          starting: startStop.departure,
          reaching: endStop.departure,
          distance: `${distance} Kms`,
          price: `Rs ${price.toFixed(2)}`
        });
      }
    }

    // If no direct routes, find connections with one junction
    if (directRoutes.length === 0) {
      const allTrains = await Train.find().lean();

      for (let train1 of allTrains) {
        for (let train2 of allTrains) {
          if (train1._id.toString() === train2._id.toString()) continue;

          for (let stop1 of train1.stops) {
            if (stop1.station.trim().toLowerCase() === cleanSource) {
              for (let junction of train1.stops) {
                const junctionIndex1 = train1.stops.indexOf(junction);
                const junctionIndex2 = train2.stops.findIndex(
                  s => s.station.trim().toLowerCase() === junction.station.trim().toLowerCase()
                );
                const destIndex = train2.stops.findIndex(
                  s => s.station.trim().toLowerCase() === cleanDestination
                );

                if (
                  junctionIndex1 > train1.stops.indexOf(stop1) &&
                  junctionIndex2 !== -1 &&
                  destIndex > junctionIndex2
                ) {
                  const start1 = stop1;
                  const end1 = junction;
                  const start2 = train2.stops[junctionIndex2];
                  const end2 = train2.stops[destIndex];

                  const dist1 = end1.distance - start1.distance;
                  const dist2 = end2.distance - start2.distance;

                  connections.push({
                    transferStation: junction.station,
                    firstLeg: {
                      train: train1.name,
                      trainno : train1.train_no,
                      starting: start1.departure,
                      reaching: end1.departure,
                      distance: `${dist1} Kms`,
                      price: `Rs ${(dist1 * 1.25).toFixed(2)}`
                    },
                    secondLeg: {
                      train: train2.name,
                      trainno : train2.train_no,
                      starting: start2.departure,
                      reaching: end2.departure,
                      distance: `${dist2} Kms`,
                      price: `Rs ${(dist2 * 1.25).toFixed(2)}`
                    }
                  });
                }
              }
            }
          }
        }
      }
    }

    if (directRoutes.length > 0) {
      return res.json({ type: "direct", routes: directRoutes });
    } else if (connections.length > 0) {
      return res.json({ type: "connection", routes: connections });
    } else {
      return res.json({ message: "No trains available for selected route" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/stations", async (req, res) => {
  try {
    const trains = await Train.find().lean();
    const stations = new Set();
    trains.forEach(train => {
      train.stops.forEach(stop => {
        stations.add(stop.station.trim());
      });
    });

    res.json([...stations].sort());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));
  app.get("/*splat", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}


app.listen(5000,()=>{
    console.log("Port running");
    
})