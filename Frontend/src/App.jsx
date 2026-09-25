import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./HOC/Login/Login";
import ProtectedRoute from "./HOC/ProtectedRoute.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import FrmSenderList from "./Pages/Master/SenderMaster/FrmSenderList.jsx";
import FrmSenderMaster from "./Pages/Master/SenderMaster/FrmSenderMaster.jsx";
import FrmSenderSubtypeList from "./Pages/Master/SenderSubType/FrmSenderSubtypeList.jsx";
import FrmSenderSubtypeMaster from "./Pages/Master/SenderSubType/FrmSenderSubtypeMaster.jsx";
import FrmReceiverCtgryList from "./Pages/Master/ReceiverCategory/FrmReceiverCtgryList.jsx";
import ReceiverCtgryMaster from "./Pages/Master/ReceiverCategory/ReceiverCtgryMaster.jsx";
import FrmPurposeMaster from "./Pages/Master/PurposeMaster/FrmPurposeMaster.jsx";
import FrmPurposeMasterList from "./Pages/Master/PurposeMaster/FrmPurposeMasterList.jsx";
import FrmDocTypeList from "./Pages/Master/DocumentType/FrmDocTypeList.jsx";
import FrmDocTypeMaster from "./Pages/Master/DocumentType/FrmDocTypeMaster.jsx";
import FrmInwardModeList from "./Pages/Master/InwardMode/FrmInwardModeList.jsx";
import FrmInwardModeMaster from "./Pages/Master/InwardMode/FrmInwardModeMaster.jsx";
import FrmOutWardModeList from "./Pages/Master/OutwardMode/FrmOutWardModeList.jsx";
import FrmOutWardModeMaster from "./Pages/Master/OutwardMode/FrmOutWardModeMaster.jsx";
import FrmReceiverSubCatList from "./Pages/Master/ReceiverSubCategory/FrmReceiverSubCatList.jsx";
import FrmReceiverSubCatMaster from "./Pages/Master/ReceiverSubCategory/FrmReceiverSubCatMaster.jsx";
import FrmDocumentSubTypeList from "./Pages/Master/DocumentSubType/FrmDocumentSubTypeList.jsx";
import FrmDocumentSubTypeMaster from "./Pages/Master/DocumentSubType/FrmDocumentSubTypeMaster.jsx";
import FrmSenderSubTypeConfig from "./Pages/Configuration/FrmSenderSubTypeConfig.jsx";
import FrmSenderTypeConfig from "./Pages/Configuration/FrmSenderTypeConfig.jsx";
import FrmOutWardUserConfig from "./Pages/Configuration/FrmOutWardUserConfig.jsx";
import FrmOutward from "./Pages/Outward/FrmOutward.jsx";
import FrmInvardMst from "./Pages/Inward/FrmInvardMst.jsx";
import FrmInvardDtlsClose from "./Pages/Inward/FrmInvardDtlsClose.jsx";
import FrmInwardClose from "./Pages/Inward/FrmInwardClose.jsx";
import FrmInwardRegister from "./Pages/Inward/FrmInwardRegister.jsx";
import FrmInwardRegisterDet from "./Pages/Inward/FrmInwardRegisterDet.jsx";
import FrmInvardDtlsDocument from "./Pages/Inward/FrmInwardDtlsDocument.jsx";
import FrmInwardDocUpload from "./Pages/Inward/FrmInwardDocUpload.jsx";
import FrmInvardDtlsCommunication from "./Pages/Inward/FrmInvardDtlsCommunication.jsx";
import FrmInwardRegRpt from "./Pages/Reports/FrmInwardRegRpt.jsx";

function App() {
  const hostname = window.location.hostname;
  const module = hostname.split(".")[0];
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  {/* Dashboard */}
                  <Route path="/dashboard" element={<Dashboard />} />

                  {/* Master routes */}
                  <Route path="/Masters/FrmSenderList" element={<FrmSenderList />} />
                  <Route path="/Masters/FrmSenderMaster" element={<FrmSenderMaster />} />
                  <Route path="/Masters/FrmSenderSubtypeList" element={<FrmSenderSubtypeList />} />
                  <Route path="/Masters/FrmSenderSubtypeMaster" element={<FrmSenderSubtypeMaster />} />
                  <Route path="/Masters/FrmReceiverCtgryList" element={<FrmReceiverCtgryList />} />
                  <Route path="/Masters/ReceiverCtgryMaster" element={<ReceiverCtgryMaster />} />
                  <Route path="/Masters/FrmPurposeMaster" element={<FrmPurposeMaster />} />
                  <Route path="/Masters/FrmPurposeMasterList" element={<FrmPurposeMasterList />} />
                  <Route path="/Masters/FrmDocTypeList" element={<FrmDocTypeList />} />
                  <Route path="/Masters/FrmDocTypeMaster" element={<FrmDocTypeMaster />} />
                  <Route path="/Masters/FrmInwardModeList" element={<FrmInwardModeList />} />
                  <Route path="/Masters/FrmInwardModeMaster" element={<FrmInwardModeMaster />} />
                  <Route path="/Masters/FrmOutWardModeList" element={<FrmOutWardModeList />} />
                  <Route path="/Masters/FrmOutWardModeMaster" element={<FrmOutWardModeMaster />} />
                  <Route path="/Masters/FrmReceiverSubCatList" element={<FrmReceiverSubCatList />} />
                  <Route path="/Masters/FrmReceiverSubCatMaster" element={<FrmReceiverSubCatMaster />} />
                  <Route path="/Masters/FrmDocumentSubTypeList" element={<FrmDocumentSubTypeList />} />
                  <Route path="/Masters/FrmDocumentSubTypeMaster" element={<FrmDocumentSubTypeMaster />} />

                  {/* Configuration routes */}
                  <Route path="/Masters/FrmSenderSubTypeConfig" element={<FrmSenderSubTypeConfig />} />
                  <Route path="/Masters/FrmSenderTypeConfig" element={<FrmSenderTypeConfig />} />
                  <Route path="/Masters/FrmOutWardUserConfig" element={<FrmOutWardUserConfig />} />

                  {/* Inward */}
                  <Route path="/Inward/FrmInwardMst" element={<FrmInvardMst />} />
                  <Route path="/Inward/FrmInwardDtlsClose" element={<FrmInvardDtlsClose />} />
                  <Route path="/Inward/FrmInwardDtlsDocument" element={<FrmInvardDtlsDocument />} />
                  <Route path="/Inward/FrmInwardDtlsCommunication" element={<FrmInvardDtlsCommunication />} />
                  <Route path="/Inward/FrmInwardClose" element={<FrmInwardClose />} />
                  <Route path="/Inward/FrmInwardRegister" element={<FrmInwardRegister />} />
                  <Route path="/Inward/FrmInwardRegisterDet" element={<FrmInwardRegisterDet />} />
                  <Route path="/Inward/FrmInwardDocUpload" element={<FrmInwardDocUpload />} />

                  {/* Outward */}
                  <Route path="/Outward/FrmOutward" element={<FrmOutward />} />

                  {/* Reports */}
                  <Route path="/Reports/FrmInwardRegRpt" element={<FrmInwardRegRpt />} />


                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
