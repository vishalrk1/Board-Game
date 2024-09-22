import GameBoard from "@/components/Board/Board";
import { boardData } from "@/lib/Types";

const GamePage = () => {
  return (
    <main className="py-10">
      <section className="px-12">
        <GameBoard board={boardData} isMyTurn={true} />
      </section>
    </main>
  );
};

export default GamePage;
