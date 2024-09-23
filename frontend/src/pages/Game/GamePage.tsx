import GameBoard from "@/components/Board/Board";
import { boardData } from "@/lib/Types";

const GamePage = () => {
  return (
    <main className="flex items-center gap-2 p-4">
      <section className="flex flex-col items-center justify-between p-2 bg-gray-800 w-1/4 h-screen rounded-lg">
        <div className="flex items-center gap-3 bg-gray-900 h-max w-full p-2 rounded-lg">
          <div className="p-2 w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center">
            I
          </div>
          <div className="flex flex-col items-start justify-center">
            <h1 className="text-lg font-light">player1@gmail.com</h1>
            <p className="text-sm text-gray-600">Connected</p>
          </div>
        </div>
      </section>
      <section className="flex w-full justify-start items-center flex-1">
        <GameBoard board={boardData} isMyTurn={true} />
      </section>
    </main>
  );
};

export default GamePage;
