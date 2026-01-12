import UserRoutes from "./user.routes";
import { UserProvider } from "./context/UserProvider";

const UserApp = () => (
  <UserProvider>
    <UserRoutes />
  </UserProvider>
);

export default UserApp;
