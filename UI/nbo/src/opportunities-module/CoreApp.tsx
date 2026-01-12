import CoreRoutes from "./core.routes";
import { NBOProvider } from "../opportunities-module/context/NBOContext";

const CoreApp = () => {
  return (
    <NBOProvider>
      <CoreRoutes />
    </NBOProvider>
  );
};

export default CoreApp;
