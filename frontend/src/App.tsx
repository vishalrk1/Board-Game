import "./App.css";
import Particles from "./components/magicui/particles";

function App() {
  return (
    <>
      <main className="relative min-h-screen">
        <section className="relative flex items-center justify-center p-10">
          <h1 className="text-4xl">BOARD GAME</h1>
        </section>
        <Particles
          className="absolute inset-0"
          quantity={100}
          ease={80}
          color={"#ffffff"}
          refresh
        />
      </main>
    </>
  );
}

export default App;
