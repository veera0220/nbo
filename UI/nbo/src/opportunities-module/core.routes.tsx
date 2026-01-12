import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "../opportunities-module/components/ui/sonner";
import Home  from "../opportunities-module/components/pages/Home";
import { Dashboard } from "../opportunities-module/components/Dashboard";
import { ViewAllNBOs } from "../opportunities-module/components/ViewAllNBOs";
import { CreateNBO } from "../opportunities-module/components/CreateNBO";
import { EditNBO } from "../opportunities-module/components/EditNBO";
import { NBODetail } from "../opportunities-module/components/NBODetail";
import { AppLayout } from "../opportunities-module/components/AppLayout";
import { Archive } from "../opportunities-module/components/Archive";
import { Products } from "../opportunities-module/components/Products";
import { ProductDetails } from "../opportunities-module/components/ProductDetails";
import { CreateProduct } from "../opportunities-module/components/CreateProduct";
import { FormFactorMaster } from "../opportunities-module/components/masters/FormFactorMaster";
import { DataRateMaster } from "../opportunities-module/components/masters/DataRateMaster";
import { StackingMaster } from "../opportunities-module/components/masters/StackingMaster";
import { MasterData } from "../opportunities-module/components/MasterData";
import { ManageOpportunity } from "../opportunities-module/components/ManageOpportunity";
import { SearchOpportunity } from "../opportunities-module/components/SearchOpportunity";
import { DataExports } from "../opportunities-module/components/DataExports";
import { MarketshareGains } from "../opportunities-module/components/MarketshareGains";
import { MarketshareGainDetails } from "../opportunities-module/components/MarketshareGainDetails";
import { DesignWins } from "../opportunities-module/components/DesignWins";
import { DesignWinDetails } from "../opportunities-module/components/DesignWinDetails";
import { ManageArchive } from "../opportunities-module/components/ManageArchive";
import { ArchivedRecordDetails } from "../opportunities-module/components/ArchivedRecordDetails";
import { NBOAnalytics } from "../opportunities-module/components/NBOAnalytics";
import { UATReview } from "../opportunities-module/components/UATReview";
import GeneralInfoView from "../opportunities-module/components/pages/general-info/GeneralInfoView";
import MyProfile from "../opportunities-module/components/pages/user/MyProfile";
import CreateNewUser from "../opportunities-module/components/pages/user/userfrom/CreateNewUser";
import UserManagement from "../opportunities-module/components/pages/user/userList/UserManagementListView";


const CoreRoutes = () => {
  return (
    <>
      {/* Global toaster stays here */}
      <Toaster position="top-right" />

      <Routes>
        {/* <Route path="/" element={<AppLayout />}> */}
        <Route path="/" element={<AppLayout />}>
          {/* <Route index element={<Dashboard />} /> */}
          <Route index element={<Home />} />
          <Route path="nbos" element={<ViewAllNBOs />} />
          <Route path="nbos/new" element={<CreateNBO />} />
          <Route path="nbos/:id" element={<NBODetail />} />
          <Route path="nbos/:id/edit" element={<EditNBO />} />
          <Route path="archive" element={<Archive />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="products/new" element={<CreateProduct />} />
          <Route path="masters/form-factor" element={<FormFactorMaster />} />
          <Route path="masters/data-rate" element={<DataRateMaster />} />
          <Route path="masters/stacking" element={<StackingMaster />} />
          <Route path="master-data" element={<MasterData />} />
          <Route path="opportunities" element={<ManageOpportunity />} />
          <Route path="search" element={<SearchOpportunity />} />
          <Route path="exports" element={<DataExports />} />
          <Route path="marketshare" element={<MarketshareGains />} />
          <Route path="marketshare/:id" element={<MarketshareGainDetails />} />
          <Route path="design-wins" element={<DesignWins />} />
          <Route path="design-wins/:id" element={<DesignWinDetails />} />
          <Route path="manage-archive" element={<ManageArchive />} />
          <Route path="archive/:id" element={<ArchivedRecordDetails />} />
          <Route path="analytics" element={<NBOAnalytics />} />
          <Route path="uat-review" element={<UATReview />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="404" element={<div>404 Not Found</div>} />
          <Route path="general-info" element={<GeneralInfoView />} />
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="user-form" element={<CreateNewUser />} />
          <Route path="user-management" element={<UserManagement />} />

        </Route>
      </Routes>
    </>
  );
};

export default CoreRoutes;
