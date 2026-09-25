import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import Layout from "../../Components/Layout";
import Label from "../../Components/Label";
import Button from "../../Components/Button";
import { useLoader } from "../../Context/LoaderContext";
import apiService from "../../../apiService";
import { useAuth } from "../../Context/AuthContext";
import { useSearchParams } from "react-router-dom";
import Table from "../../Components/Table";

const FrmInwardDocUpload = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { setLoading } = useLoader();
    const { user } = useAuth();
    const userId = user?.userId;
    const ulbid = user?.ulbId;

    const { invardNo, row } = location.state;


    const [applicantTableHeader, setApplicantTableHeader] = useState([
        "आवक क्र.",
        "आवक दिनांक",
        "विषय",
        "संदर्भ क्र.",
        "पासुन",
        "पत्ता"
    ]);
    const [applicantTableData, setApplicantTableData] = useState([]);

    const [documentTableHeader, setDocumentTableHeader] = useState([
        "Sr. No.",
        "अनुक्रमांक",
        "दिनांक",
        "Document Name",
        "View",
        "Delete"
    ]);
    const [documentTableData, setDocumentTableData] = useState([]);
    const [anukramank, setAnukramank] = useState("");
    const [documentDate, setDocumentDate] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [applicantInwardId, setApplicantInwardId] = useState("")

    const formatDateToDDMMYYYY = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const fetchApplicationDetails = async () => {
        try {
            setLoading(true);
            const payload = {
                ulbid,
                inwardNo: invardNo
            };

            const response = await apiService.post("getInwarDocUploadList", payload);

            if (response.data.success && response.data.data.length > 0) {
                const data = response.data.data[0];

                setApplicantTableData([
                    [
                        data.INWARDNO,
                        formatDateToDDMMYYYY(data.INWDATE),
                        data.SUBJECT,
                        data.REFNO,
                        data.INWARDFROM,
                        data.ADDRESS
                    ]
                ]);
                setApplicantInwardId(data.INWARDID)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }

    };

    const fetchDocuments = async () => {
        try {
            setLoading(true);

            const payload = {
                ulbid,
                inwardNo: invardNo,
            };

            const response = await apiService.post(
                "getExistingDocList",
                payload
            );

            console.log("Documents API Response:", response);

            if (response.data.success) {
                const formattedList = response.data.data.map((item) => ({
                    id: item.SERIALNO,
                    anukramank: item.SERIALNO,
                    date: item.DOCDATE,
                    fileName: item.DOCUMENTNAME,
                    file: null,
                    base64: item.FILE_BASE64,
                    fileSize: item.FILE_SIZE,
                    isExisting: true,
                }));

                setDocumentTableData(formattedList);
            } else {
                setDocumentTableData([]);
            }
        } catch (error) {
            console.error("Error fetching documents:", error);
            setDocumentTableData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => {
                resolve(reader.result);
            };

            reader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const addDocumentToTable = async () => {
        if (!anukramank) {
            alert("अनुक्रमांक आवश्यक आहे.");
            return;
        }

        if (!documentDate) {
            alert("दिनांक आवश्यक आहे.");
            return;
        }

        if (!selectedFile) {
            alert("कृपया दस्तऐवज निवडा.");
            return;
        }

        try {
            setLoading(true);

            // Check duplicate अनुक्रमांक
            const isDuplicate = documentTableData.some(
                (doc) => String(doc.anukramank) === String(anukramank)
            );

            if (isDuplicate) {
                alert("हा अनुक्रमांक आधीच वापरलेला आहे.");
                return;
            }

            // Convert file to Base64
            const base64 = await fileToBase64(selectedFile);

            const newDocument = {
                id: anukramank,
                anukramank: anukramank,
                date: documentDate,
                fileName: selectedFile.name,
                file: selectedFile,
                base64: base64,
                fileSize: selectedFile.size,
                isExisting: false,
            };

            // Add new document while preserving existing documents
            setDocumentTableData((prev) => [
                ...prev,
                newDocument,
            ]);

            // Clear inputs
            setAnukramank("");
            setDocumentDate("");
            setSelectedFile(null);

            // Clear file input
            const fileInput = document.querySelector(
                'input[type="file"]'
            );

            if (fileInput) {
                fileInput.value = "";
            }

            console.log("Document added:", newDocument);

        } catch (error) {
            console.error("File conversion error:", error);
            alert("File process करताना error आला.");
        } finally {
            setLoading(false);
        }
    };

    const documentTableRows = documentTableData.map((doc, index) => [
        index + 1,
        doc.anukramank,
        formatDateToDDMMYYYY(doc.date),
        doc.fileName,

        <button
            type="button"
            className="text-blue-600 underline hover:text-blue-800"
            onClick={() => handleDocumentView(doc)}
        >
            View
        </button>,

        <button
            type="button"
            className="text-red-600 underline hover:text-red-800"
            onClick={() => handleDocumentDelete(doc.id)}
        >
            Delete
        </button>,
    ]);

    const normalizeBase64 = (value) => {
        if (!value) {
            throw new Error("Empty Base64 value");
        }

        let base64 = String(value).trim();

        // -----------------------------------------
        // 1. Standard Data URL
        // data:application/pdf;base64,JVBERi0...
        // -----------------------------------------
        if (base64.startsWith("data:")) {
            const commaIndex = base64.indexOf(",");

            if (commaIndex === -1) {
                throw new Error("Invalid Data URL");
            }

            base64 = base64.substring(commaIndex + 1);
        }

        // -----------------------------------------
        // 2. Your API format
        // dataapplication/pdfbase64JVBERi0...
        // dataimage/pngbase64iVBORw0...
        // -----------------------------------------
        else if (base64.startsWith("data")) {
            const match = base64.match(
                /^data([a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+)base64/
            );

            if (match) {
                base64 = base64.substring(match[0].length);
            }
        }

        // Remove whitespace/newlines
        base64 = base64.replace(/\s/g, "");

        // Remove accidental quotes
        base64 = base64.replace(/^["']|["']$/g, "");

        // Convert Base64URL → Base64
        base64 = base64
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        // Validate characters
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
            console.error(
                "Invalid Base64:",
                base64.substring(0, 100)
            );

            throw new Error("Invalid Base64 characters");
        }

        // Remove existing padding
        base64 = base64.replace(/=+$/, "");

        // Validate length
        const remainder = base64.length % 4;

        if (remainder === 1) {
            throw new Error(
                `Invalid Base64 length: ${base64.length}`
            );
        }

        // Add padding
        if (remainder > 0) {
            base64 += "=".repeat(4 - remainder);
        }

        return base64;
    };

    const handleDocumentView = (doc) => {
        try {
            // -----------------------------------------
            // 1. Newly uploaded File
            // -----------------------------------------
          
            if (doc.file instanceof File) {
                const fileUrl = URL.createObjectURL(doc.file);

                window.open(fileUrl, "_blank");

                setTimeout(() => {
                    URL.revokeObjectURL(fileUrl);
                }, 60000);

                return;
            }

            // -----------------------------------------
            // 2. Existing API document
            // -----------------------------------------
            if (!doc.base64) {
                alert("Document उपलब्ध नाही.");
                return;
            }

            const rawBase64 = String(doc.base64).trim();

            if (!rawBase64) {
                alert("Document data रिकामा आहे.");
                return;
            }

            let mimeType = "application/octet-stream";

            // -----------------------------------------
            // 3. Detect MIME type
            // -----------------------------------------

            if (rawBase64.startsWith("data:")) {
                const mimeMatch = rawBase64.match(
                    /^data:([^;,]+)/
                );

                if (mimeMatch) {
                    mimeType = mimeMatch[1];
                }
            } else if (rawBase64.startsWith("data")) {
                const mimeMatch = rawBase64.match(
                    /^data([a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+)base64/
                );

                if (mimeMatch) {
                    mimeType = mimeMatch[1];
                }
            }


            // -----------------------------------------
            // 4. Normalize Base64
            // -----------------------------------------

            const base64 = normalizeBase64(rawBase64);

            if (!base64) {
                alert("Document Base64 data उपलब्ध नाही.");
                return;
            }

            // -----------------------------------------
            // 5. Validate Base64 length
            // -----------------------------------------

            if (base64.length % 4 !== 0) {
                alert(
                    "Document data incomplete आहे. कृपया पुन्हा try करा."
                );
                return;
            }

            // -----------------------------------------
            // 6. Validate Base64 characters
            // -----------------------------------------

            if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
                alert(
                    "Document Base64 format invalid किंवा incomplete आहे."
                );
                return;
            }

            // -----------------------------------------
            // 7. Decode Base64
            // -----------------------------------------

            let byteCharacters;

            try {
                byteCharacters = atob(base64);
            } catch (error) {
                console.error("Base64 decode error:", error);

                alert(
                    "Document data incomplete किंवा invalid Base64 format मध्ये आहे."
                );

                return;
            }

            // -----------------------------------------
            // 8. Convert to bytes
            // -----------------------------------------

            const byteArray = Uint8Array.from(
                byteCharacters,
                (char) => char.charCodeAt(0)
            );

            // -----------------------------------------
            // 9. Detect file type from signature
            // -----------------------------------------

            if (base64.startsWith("JVBERi0")) {
                mimeType = "application/pdf";
            } else if (base64.startsWith("iVBORw0KGgo")) {
                mimeType = "image/png";
            } else if (base64.startsWith("/9j/")) {
                mimeType = "image/jpeg";
            } else if (base64.startsWith("R0lGOD")) {
                mimeType = "image/gif";
            }

            // -----------------------------------------
            // 10. Validate PDF completeness
            // -----------------------------------------

            if (mimeType === "application/pdf") {
                const pdfText = new TextDecoder("latin1").decode(
                    byteArray
                );

                // PDF must start with %PDF
                if (!pdfText.startsWith("%PDF")) {
                    alert(
                        "PDF document invalid किंवा incomplete आहे."
                    );
                    return;
                }

                // PDF normally ends with %%EOF
                if (!pdfText.includes("%%EOF")) {
                    alert(
                        "PDF document incomplete आहे. कृपया document पुन्हा upload करा."
                    );
                    return;
                }
            }

            console.log("MIME:", mimeType);
            console.log("Base64 length:", base64.length);
            console.log("Decoded bytes:", byteArray.length);

            // -----------------------------------------
            // 11. Create Blob
            // -----------------------------------------

            const blob = new Blob([byteArray], {
                type: mimeType,
            });

            // -----------------------------------------
            // 12. Open document
            // -----------------------------------------

            const fileUrl = URL.createObjectURL(blob);

            window.open(fileUrl, "_blank");

            setTimeout(() => {
                URL.revokeObjectURL(fileUrl);
            }, 60000);

        } catch (error) {
            console.error("Error viewing document:", error);

            alert(
                "Document उघडताना error आला. Document data incomplete किंवा invalid आहे."
            );
        }
    };

    const handleDocumentDelete = (id) => {
        setDocumentTableData((prev) =>
            prev.filter((doc) => doc.id !== id)
        );
    };

    const generateDocStr = (documents) => {
        return documents
            .map((doc) => {
                const date = new Date(doc.date);

                const day = String(date.getDate()).padStart(2, "0");

                const monthNames = [
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];

                const month = monthNames[date.getMonth()];
                const year = date.getFullYear();

                const formattedDate = `${day}-${month}-${year}`;

                return `${doc.anukramank}$${formattedDate}$1$${doc.fileName}`;
            })
            .join("#");
    };

    const handleGenerate = async () => {
        try {
            setLoading(true);

            const docStr = await generateDocStr(documentTableData);

            const appPayload = {
                "in_UserId": userId,
                "in_inwardimgid": "0",
                "in_inwardid": String(applicantInwardId),
                "in_inwardno": invardNo,
                "in_DocStr": docStr, // serialNO$date$1(hardcode value)$file-name#
                "in_orgId": Number(ulbid)
            }

            const docPayload = {
                inwardId: String(applicantInwardId),
                inwardNo: invardNo,

                documents: documentTableData.map((doc) => ({
                    serialNo: String(doc.anukramank),
                    documentName: doc.fileName,
                    fileBytes: doc.base64,
                })),
            };

            const appResponse = await apiService.post("AOIO_INWARD_docUpdt", appPayload);

            if (appResponse.data.success && appResponse.data.errorCode === -100) {
                const docResponse = await apiService.post("updateInwardDocumentBlobs", docPayload);
                const appMessage = appResponse.data.errorMessage;

                if (docResponse.data.success) {
                    alert(appMessage + ". " + docResponse.data.message);
                    setAnukramank("");
                    setApplicantInwardId("");
                    setApplicantTableData([]);
                    setDocumentDate("");
                    setDocumentTableData([]);
                    setSelectedFile(null);
                    navigate("/Inward/FrmInwardDtlsDocument", {
                        replace: true
                    })
                }
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (ulbid && invardNo) {
            fetchApplicationDetails();
            fetchDocuments();
        }
    }, [ulbid, invardNo]);

    return (
        <Layout
            title="आवक दस्तऐवज जोडा"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Invard List"
            }}
        >
            <div className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label text="आवक क्र.: " />
                        <input
                            type="text"
                            placeholder="Enter inward number"
                            className={`form-input-box`}
                            disabled={true}
                            value={invardNo}
                        />
                    </div>
                    <div className="flex">
                        <div className="flex items-end gap-3">
                            <Button
                                type="button"
                                disabled={true}
                            >
                                शोधा
                            </Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    navigate("/Inward/FrmInwardDtlsDocument", {
                                        replace: true
                                    });
                                }}
                            >
                                बदल
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-3 border-t">
                    <Table
                        headers={applicantTableHeader}
                        data={applicantTableData}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    <div>
                        <Label text="अनुक्रमांक: " />
                        <input
                            type="text"
                            // placeholder="Enter "
                            className={`form-input-box`}
                            // disabled={true}
                            value={anukramank}
                            onChange={(e) => setAnukramank(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label text="दिनांक : " />
                        <input
                            type="date"
                            className={`form-input-box`}
                            // {...register("fromDate")}
                            value={documentDate}
                            onChange={(e) => setDocumentDate(e.target.value)}
                        />
                    </div>
                    <div>
                        {/* <Label text="Document Upload : " className="" /> */}
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            // {...register("documentUpload")}
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300
    bg-white text-slate-700 text-sm
    file:mr-4 file:py-1.5 file:px-3 file:rounded-md
    file:border-0 file:bg-slate-100 file:text-slate-700
    file:font-medium file:text-sm
    hover:file:bg-slate-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 md:mt-4"
                        />
                    </div>
                </div>

                <div className="flex justify-center gap-3 mt-3">
                    <Button
                        type="button"
                        onClick={() => {
                            addDocumentToTable();
                        }}
                    >जोडा</Button>
                </div>

                <div className="mt-3">
                    <Table
                        headers={documentTableHeader}
                        data={documentTableRows}
                    />
                </div>

                <div className="mt-3 flex justify-center gap-3">
                    <Button
                        type="button"
                        onClick={() => {
                            handleGenerate();
                        }}
                    >
                        जतन करा
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            navigate("/Inward/FrmInwardDtlsDocument", {
                                replace: true
                            })
                        }}
                    >
                        मागे
                    </Button>
                </div>
            </div>

        </Layout>
    )
}

export default FrmInwardDocUpload;