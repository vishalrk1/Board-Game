import "./App.css";
import Particles from "./components/magicui/particles";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="pt-20">
        <section className="relative flex items-center justify-center p-10 mt-15">
          <h1 className="text-4xl text-white">BOARD GAME</h1>
        </section>
      </main>
      <Particles
        className="absolute inset-0"
        quantity={80}
        ease={80}
        color={"#ffffff"}
        refresh
      />
    </div>
  );
}

export default App;
