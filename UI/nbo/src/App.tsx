import { BrowserRouter } from "react-router-dom";
import CoreApp from "./opportunities-module/CoreApp";
import UserApp from "./user-module/UserApp";

const App = () => {
  return (
    <BrowserRouter>
      <CoreApp />
      <UserApp />
    </BrowserRouter>
  );
};

export default App;
