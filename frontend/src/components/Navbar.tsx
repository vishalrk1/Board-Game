const Navbar = () => {
  return (
    <nav className="fixed flex justify-center items-center mx-auto top-0 left-0 right-0 bg-transparent text-white p-2 shadow-md z-50">
      <div className="container w-10/12 p-2 flex justify-between gap-4 items-center bg-[#0a0c0c] drop-shadow-md rounded-full">
        <div className="flex items-center justify-start gap-1">
          <h1 className="text-xl font-bold mx-3 rounded-full ">
            Conquest Enemy
          </h1>
          <p className="p-2 px-4 hover:bg-[#1b1e20] cursor-pointer rounded-full">
            Characters
          </p>
          <p className="p-2 px-4 hover:bg-[#1b1e20] cursor-pointer rounded-full">
            Resources
          </p>
          <p className="p-2 px-4 hover:bg-[#1b1e20] cursor-pointer rounded-full">
            About Us
          </p>
        </div>
        <div>
          <h1>Other Icons</h1>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
