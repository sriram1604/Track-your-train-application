export default function TrainSearch({ source, setSource, destination, setDestination, searchTrains, stations, darkMode }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <select
        value={source}
        onChange={e => setSource(e.target.value)}
        className={`flex-grow p-3 rounded-md border ${darkMode ? "bg-white text-orange-500 border-orange-500" : "bg-white text-orange-500 border-orange-400"} focus:outline-none focus:ring-2 focus:ring-orange-500`}
      >
        <option value="">Select Source</option>
        {stations.map((station, i) => (
          <option key={i} value={station}>{station}</option>
        ))}
      </select>

      <select
        value={destination}
        onChange={e => setDestination(e.target.value)}
        className={`flex-grow p-3 rounded-md border ${darkMode ? "bg-white text-orange-500 border-orange-500" : "bg-white text-orange-500 border-orange-400"} focus:outline-none focus:ring-2 focus:ring-orange-500`}
      >
        <option value="">Select Destination</option>
        {stations.map((station, i) => (
          <option key={i} value={station}>{station}</option>
        ))}
      </select>

      <button
        onClick={searchTrains}
        className="px-6 py-3 rounded-md bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
        disabled={!source || !destination}
      >
        Search
      </button>
    </div>
  );
}
