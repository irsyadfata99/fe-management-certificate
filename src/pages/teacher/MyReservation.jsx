/**
 * PrintCertificatePage v6
 * - window.open() approach: buka tab baru → inject HTML sertifikat → auto print
 * - Font di-fetch sebagai base64 di main window (tidak ada CSP block),
 *   lalu di-embed langsung ke print HTML agar print window tidak perlu
 *   request ke luar (yang diblokir CSP chrome://print/)
 */

import { useState, useRef, useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Printer, CheckCircle2 } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { FormField, FormLabel, FormError } from "@/components/ui/Form";

import {
  useReserveCertificate,
  usePrintCertificate,
} from "@/hooks/certificate/useTeacherCertificates";
import {
  useTeacherBranches,
  useTeacherModules,
} from "@/hooks/teacher/useTeacherProfile";
import { printCertificateSchema } from "@/utils/validation/certificateValidation";

// ---------------------------------------------------------------------------
// Font URLs dari Google Fonts CDN
// ---------------------------------------------------------------------------
const FONT_URLS = {
  playfair:
    "https://fonts.gstatic.com/s/playfairdisplay/v37/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYh0o.woff2",
  montserrat:
    "https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Ew-.woff2",
};

// Cache base64 font agar tidak di-fetch ulang setiap kali print
const fontBase64Cache = {};

/**
 * Fetch font dari URL dan convert ke base64 data URI
 * Dijalankan di main window (tidak ada CSP block)
 */
const fetchFontAsBase64 = async (name, url) => {
  if (fontBase64Cache[name]) return fontBase64Cache[name];

  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = `data:font/woff2;base64,${btoa(binary)}`;
  fontBase64Cache[name] = base64;
  return base64;
};

// ---------------------------------------------------------------------------
// Format tanggal: "7 February, 2026"
// ---------------------------------------------------------------------------
const formatPtcDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d)) return "";
  return d
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(/(\d+) (\w+) (\d+)/, "$1 $2, $3");
};

// ---------------------------------------------------------------------------
// Generate HTML string dengan font base64 ter-embed
// ---------------------------------------------------------------------------
const buildPrintHTML = ({
  studentName,
  moduleName,
  ptcDate,
  divisionName,
  playfairBase64,
  montserratBase64,
}) => {
  const moduleColor = divisionName?.includes("LK")
    ? "magenta"
    : "cornflowerblue";
  const formattedDate = formatPtcDate(ptcDate);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Sertifikat</title>
  <style>
    /* Embed font langsung sebagai base64 — tidak ada external request */
    @font-face {
      font-family: 'Playfair Display';
      font-style: normal;
      font-weight: 400;
      src: url('${playfairBase64}') format('woff2');
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 600;
      src: url('${montserratBase64}') format('woff2');
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    @page {
      size: A4 landscape;
      margin: 0;
    }

    html, body {
      width: 297mm;
      height: 210mm;
      overflow: hidden;
    }

    .certificate {
      width: 297mm;
      height: 210mm;
      position: relative;
      background: #fff;
    }

    .student-name {
      position: absolute;
      top: 98.8mm;
      left: 0;
      right: 0;
      text-align: center;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 34pt;
      font-weight: 400;
      text-transform: uppercase;
      color: #000;
      line-height: 1;
      white-space: nowrap;
      letter-spacing: 0.02em;
    }

    .module-name {
      position: absolute;
      top: 142.20mm;
      left: 0;
      right: 0;
      text-align: center;
      font-family: 'Montserrat', Arial, sans-serif;
      font-size: 28pt;
      font-weight: 600;
      color: ${moduleColor};
      line-height: 1;
      white-space: nowrap;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .ptc-date {
      position: absolute;
      top: 176.50mm;
      left: 76.2mm;
      font-family: 'Montserrat', Arial, sans-serif;
      font-size: 18pt;
      font-weight: 600;
      color: #000;
      line-height: 1;
      white-space: nowrap;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="student-name">${studentName || ""}</div>
    <div class="module-name">${moduleName || ""}</div>
    <div class="ptc-date">${formattedDate}</div>
  </div>
  <script>
    // Font sudah embedded — langsung tunggu render lalu print
    document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.print();
          window.onafterprint = () => window.close();
        });
      });
    });
  ${"</script>"}
</body>
</html>`;
};

// ---------------------------------------------------------------------------
// A4 Certificate Preview (screen only, scaled)
// ---------------------------------------------------------------------------
const CertificatePreview = ({ data }) => {
  const { studentName, moduleName, ptcDate, divisionName } = data;
  const moduleColor = divisionName?.includes("LK")
    ? "magenta"
    : "cornflowerblue";

  return (
    <div
      style={{
        width: "297mm",
        height: "210mm",
        position: "relative",
        boxSizing: "border-box",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "98.8mm",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "34pt",
          fontWeight: 400,
          textTransform: "uppercase",
          color: "#000",
          lineHeight: 1,
          whiteSpace: "nowrap",
          letterSpacing: "0.02em",
        }}
      >
        {studentName || <span style={{ color: "#ccc" }}>NAMA STUDENT</span>}
      </div>

      <div
        style={{
          position: "absolute",
          top: "142.20mm",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "'Montserrat', Arial, sans-serif",
          fontSize: "28pt",
          fontWeight: 600,
          color: moduleName ? moduleColor : "#ccc",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {moduleName || "Nama Module"}
      </div>

      <div
        style={{
          position: "absolute",
          top: "176.50mm",
          left: "76.2mm",
          fontFamily: "'Montserrat', Arial, sans-serif",
          fontSize: "18pt",
          fontWeight: 600,
          color: "#000",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {ptcDate ? (
          formatPtcDate(ptcDate)
        ) : (
          <span style={{ color: "#ccc" }}>Tanggal PTC</span>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function PrintCertificatePage() {
  const previewContainerRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      setPreviewScale(entry.contentRect.width / 1122);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { data: branches = [] } = useTeacherBranches();
  const { data: modules = [] } = useTeacherModules();

  const { mutate: reserve, isPending: isReserving } = useReserveCertificate();
  const { mutate: print } = usePrintCertificate();

  const [reservedCert, setReservedCert] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(printCertificateSchema),
    defaultValues: {
      certificateId: 0,
      studentName: "",
      moduleId: 0,
      ptcDate: "",
    },
  });

  const studentName = useWatch({ control, name: "studentName" });
  const moduleId = useWatch({ control, name: "moduleId" });
  const ptcDate = useWatch({ control, name: "ptcDate" });

  const selectedModule = modules.find((m) => m.id === Number(moduleId));

  const previewData = {
    studentName,
    moduleName: selectedModule?.name || "",
    divisionName:
      selectedModule?.division?.name || selectedModule?.division_name || "",
    ptcDate,
  };

  const handleReserve = () => {
    if (!selectedBranchId) return;
    reserve(
      { branchId: Number(selectedBranchId) },
      {
        onSuccess: (data) => {
          setReservedCert(data.certificate);
          setValue("certificateId", data.certificate.id);
        },
      },
    );
  };

  const handlePrintClick = () => {
    handleSubmit(
      async (values) => {
        setIsPrinting(true);
        try {
          // Fetch font di main window (bebas CSP), lalu embed ke print HTML
          const [playfairBase64, montserratBase64] = await Promise.all([
            fetchFontAsBase64("playfair", FONT_URLS.playfair),
            fetchFontAsBase64("montserrat", FONT_URLS.montserrat),
          ]);

          const printWindow = window.open("", "_blank");
          if (!printWindow) {
            console.warn("window.open blocked by browser");
            return;
          }

          printWindow.document.write(
            buildPrintHTML({
              ...previewData,
              playfairBase64,
              montserratBase64,
            }),
          );
          printWindow.document.close();

          print({ ...values, certificateId: reservedCert?.id });
        } catch (err) {
          console.error("Failed to load fonts:", err);
          // Fallback: buka print window tanpa font embed
          const printWindow = window.open("", "_blank");
          if (printWindow) {
            printWindow.document.write(
              buildPrintHTML({
                ...previewData,
                playfairBase64: "",
                montserratBase64: "",
              }),
            );
            printWindow.document.close();
            print({ ...values, certificateId: reservedCert?.id });
          }
        } finally {
          setIsPrinting(false);
        }
      },
      (validationErrors) => {
        console.log("Validation failed:", validationErrors);
      },
    )();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          Print Certificate
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Isi semua data di bawah, lalu cetak sertifikat.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
        {/* ── LEFT: Form Card ── */}
        <Card className="lg:sticky lg:top-6">
          <div className="p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-5">
              Data Sertifikat
            </p>

            <div className="flex flex-col gap-4">
              <FormField>
                <FormLabel required>Cabang</FormLabel>
                <Select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  disabled={!!reservedCert}
                  placeholder="Pilih cabang"
                  fullWidth
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </Select>
                {!reservedCert ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={handleReserve}
                    loading={isReserving}
                    disabled={!selectedBranchId || isReserving}
                    type="button"
                  >
                    Reserve Sertifikat
                  </Button>
                ) : (
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md px-3 py-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{reservedCert.certificate_number}</span>
                  </div>
                )}
              </FormField>

              <FormField>
                <FormLabel required>Nama Student</FormLabel>
                <Input
                  {...register("studentName")}
                  placeholder="Nama lengkap"
                  error={!!errors.studentName}
                  disabled={!reservedCert}
                  fullWidth
                />
                <FormError>{errors.studentName?.message}</FormError>
              </FormField>

              <FormField>
                <FormLabel required>Nama Module</FormLabel>
                <Controller
                  name="moduleId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="Pilih module"
                      error={!!errors.moduleId}
                      disabled={!reservedCert}
                      fullWidth
                    >
                      {modules.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </Select>
                  )}
                />
                <FormError>{errors.moduleId?.message}</FormError>
              </FormField>

              <FormField>
                <FormLabel required>Tanggal PTC</FormLabel>
                <Input
                  type="date"
                  {...register("ptcDate")}
                  error={!!errors.ptcDate}
                  disabled={!reservedCert}
                  fullWidth
                />
                <FormError>{errors.ptcDate?.message}</FormError>
              </FormField>
            </div>
          </div>

          <div className="px-6 pb-6">
            <Button
              variant="primary"
              leftIcon={<Printer className="w-4 h-4" />}
              onClick={handlePrintClick}
              disabled={!reservedCert || isPrinting}
              loading={isPrinting}
              className="w-full"
              type="button"
            >
              {isPrinting ? "Memuat font..." : "Print Preview"}
            </Button>
          </div>
        </Card>

        {/* ── RIGHT: A4 Preview ── */}
        <Card padding={false} className="overflow-hidden">
          <div
            ref={previewContainerRef}
            className="relative w-full bg-neutral-100 dark:bg-neutral-900/60"
            style={{ aspectRatio: "297 / 210" }}
          >
            <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Preview A4
              </p>
              {reservedCert && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                  {reservedCert.certificate_number}
                </span>
              )}
            </div>

            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "1122px",
                transformOrigin: "top left",
                transform: `scale(${previewScale})`,
              }}
            >
              <CertificatePreview data={previewData} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
