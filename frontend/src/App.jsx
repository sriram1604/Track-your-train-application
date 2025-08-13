import { useEffect, useState } from "react";
import TrainSearch from "./components/TrainSearch.jsx";
import Intro from "./components/Intro.jsx";
import { apiurl } from "./utils/url.jsx";

export default function App() {
  const [stations, setStations] = useState([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [results, setResults] = useState([]); // array of routes
  const [routeType, setRouteType] = useState(null); // "direct" or "connection"
  const [darkMode, setDarkMode] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  // This function is passed to the Intro component and is called
  // when the animation finishes.
  const handleIntroFinish = () => {
    setShowIntro(false);
  };

  useEffect(() => {
    fetch(`${apiurl}/stations`)
      .then(res => res.json())
      .then(data => {
        const sortedStations = data.sort((a, b) => a.localeCompare(b));
        setStations(sortedStations);
      })
      .catch(console.error);
  }, []);

  const searchTrains = () => {
    fetch(`${apiurl}/search?source=${source}&destination=${destination}`)
      .then(res => res.json())
      .then(data => {
        setRouteType(data.type);
        setResults(data.routes || []);
      })
      .catch(() => {
        setRouteType(null);
        setResults([]);
      });
  };

  const formatTime = (time) => {
    return time; // optionally format
  };

  const cardBg = darkMode ? "bg-gray-900" : "bg-white";
  const cardText = darkMode ? "text-white" : "text-gray-900";
  const borderColor = darkMode ? "border-orange-500" : "border-orange-400";
  const accentColor = "text-orange-500";
  

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

          body {
            font-family: 'Inter', sans-serif;
            overflow: hidden; /* Prevent scrolling during the intro */
          }

          /* Define the main animation sequence using keyframes */
          @keyframes introAnimation {
            0% {
              background-color: #f97316; /* Initial orange background */
              color: #ffffff;           /* Initial white text */
              transform: translateY(0);
            }
            15% {
              background-color: #f97316;
              color: #ffffff;
            }
            20% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(0);
              background-color: #f97316;
              color: #ffffff;
            }
            60% {
              background-color: #ffffff; /* Transition to white background */
              color: #f97316;           /* Transition to orange text */
            }
            /* The animation will hold at this state for an extra second */
            87% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-100vh); /* Slide the whole intro up */
            }
          }

          /* Apply the animation to the intro container */
          .intro-container {
            /* The duration is now 7.5s to match the timeout in Intro.jsx */
            animation: introAnimation 7.5s ease-in-out forwards;
          }

          /* Keyframes for the train icon's animation */
          @keyframes trainFadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          .train-icon-animated {
            animation: trainFadeIn 0.5s ease-in-out forwards;
            animation-delay: 0.5s;
          }

          /* Keyframes for each letter's animation */
          @keyframes letterFadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .letter {
            animation: letterFadeIn 0.3s ease-out forwards;
            /* Animation delay is calculated in the Intro.jsx component */
          }
        `}
      </style>

      
      {showIntro ? (
        <Intro onFinish={handleIntroFinish} />
      ) : (
        <div className={`min-h-screen ${darkMode ? "bg-black" : "bg-white"} transition-colors duration-300`}>
          <div className="max-w-4xl mx-auto p-6">
            
            <header className="flex justify-between items-center mb-6">
              <h1 className={`text-3xl font-bold ${darkMode ? "text-orange-400" : "text-orange-600"}`}>
                Track Your Train
              </h1>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 rounded-md border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition"
                aria-label="Toggle dark/light mode"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </header>

            {/* Search */}
            <TrainSearch
              source={source}
              setSource={setSource}
              destination={destination}
              setDestination={setDestination}
              searchTrains={searchTrains}
              stations={stations}
              darkMode={darkMode}
            />

            {/* Results */}
            <div className="mt-8">
              {results.length === 0 ? (
                <p className={`text-center text-orange-500 text-lg`}>
                  No trains found
                </p>
              ) : (
                <div className="space-y-6">
                  {routeType === "direct" && results.map((route, i) => (
                    <div
                      key={i}
                      className={`${cardBg} ${cardText} border ${borderColor} rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow`}
                    >
                      <h3 className={`text-2xl font-semibold mb-3 ${accentColor}`}>
                        {route.trainno} - {route.train}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
                        <div>
                          <p><span className="font-semibold">Start:</span> {formatTime(route.starting)}</p>
                          <p><span className="font-semibold">Reach:</span> {formatTime(route.reaching)}</p>
                        </div>
                        <div>
                          <p><span className="font-semibold">Distance:</span> {route.distance} km</p>
                          <p><span className="font-semibold">Price:</span> ₹{route.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {routeType === "connection" && (
                    <h3 className={`text-2xl font-semibold mb-5 ${accentColor} text-center`}>
                      Sorry you dont have direct trains from {source} to {destination}
                    </h3>
                  )}

                  {routeType === "connection" && results.map((route, i) => (
                    <div
                      key={i}
                      className={`${cardBg} ${cardText} border ${borderColor} rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow`}
                    >
                      <section className="mb-6">
                        <h4 className="text-xl font-semibold mb-2 ">
                          <span className="text-orange-500">Ticket-Price</span> : Rs {
                            (parseFloat(route.firstLeg.price.replace("Rs ", "")) +
                            parseFloat(route.secondLeg.price.replace("Rs ", ""))).toFixed(2)
                          }
                        </h4>
                        <h4 className="text-xl font-semibold mb-2 border-b border-orange-400 pb-1">
                          You should reach {route.transferStation}
                        </h4>
                        <p className="mb-1">
                          <span className="font-semibold">Train:</span> {route.firstLeg.trainno} - {route.firstLeg.train}
                        </p>
                        <p className="mb-1"><span className="font-semibold">Start:</span> {formatTime(route.firstLeg.starting)}</p>
                        <p className="mb-1"><span className="font-semibold">Reach:</span> {formatTime(route.firstLeg.reaching)}</p>
                        <p className="mb-1"><span className="font-semibold">Distance:</span> {route.firstLeg.distance}</p>
                        <p><span className="font-semibold">Price:</span> ₹{route.firstLeg.price}</p>
                      </section>

                      <hr className="border-orange-400 mb-6" />

                      <section>
                        <h4 className="text-xl font-semibold mb-2 border-b border-orange-400 pb-1">
                          from {route.transferStation} to reach {destination}
                        </h4>
                        <p className="mb-1">
                          <span className="font-semibold">Train:</span> {route.secondLeg.trainno} - {route.secondLeg.train}
                        </p>
                        <p className="mb-1"><span className="font-semibold">Start:</span> {formatTime(route.secondLeg.starting)}</p>
                        <p className="mb-1"><span className="font-semibold">Reach:</span> {formatTime(route.secondLeg.reaching)}</p>
                        <p className="mb-1"><span className="font-semibold">Distance:</span> {route.secondLeg.distance}</p>
                        <p><span className="font-semibold">Price:</span> ₹{route.secondLeg.price}</p>
                      </section>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
