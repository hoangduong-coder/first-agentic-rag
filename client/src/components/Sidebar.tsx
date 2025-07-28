import viteLogo from "/vite.svg";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </div>
      <div className="sidebar-bottom">Welcome back, user!</div>
    </div>
  );
};

export default Sidebar;
