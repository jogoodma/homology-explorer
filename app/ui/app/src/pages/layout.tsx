import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full h-28 bg-indigo-700 justify-items-start flex flex-col justify-center">
        <a href={"/"}>
          <h1 className="text-slate-50 text-5xl pl-8">Homology Explorer</h1>
        </a>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="h-14 flex items-center justify-center">
        <p>Brought to you by Mark Green and Josh Goodman</p>
      </footer>
    </div>
  );
};

export default Layout;
