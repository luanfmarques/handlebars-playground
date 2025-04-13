import { HandlebarsSmartPlayground } from "./components/HandlebarsSmartPlayground";

function App() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Handlebars Smart Playground
        </h1>
        <HandlebarsSmartPlayground />
      </div>
    </main>
  );
}

export default App;
