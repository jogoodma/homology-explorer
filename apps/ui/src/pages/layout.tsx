import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="grow-0 shrink-0 w-full h-28 bg-indigo-700 justify-items-start flex flex-col justify-center">
        <a href={"/"}>
          <h1 className="text-slate-50 text-5xl pl-8">Homology Explorer</h1>
        </a>
      </header>
      <main className={"grow"}>
        <Outlet />
      </main>
      <footer className="grow-0 shrink-0 my-10 h-14 flex justify-center items-center">
        <p className={"font-bold text-slate-500"}>
          Brought to you by Mark Green and Josh Goodman
        </p>
      </footer>
    </div>
  );
};

export default Layout;
