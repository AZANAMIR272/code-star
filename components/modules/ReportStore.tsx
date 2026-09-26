"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clearStoredReport, readReport, writeReport, type StoredReport } from "@/lib/report-store";

interface ReportContextValue {
  report: StoredReport | null;
  loaded: boolean;
  saveReport: (next: StoredReport) => void;
  patchReport: (patch: Partial<StoredReport>) => void;
  clearReport: () => void;
}

const ReportContext = createContext<ReportContextValue | null>(null);

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const [report, setReport] = useState<StoredReport | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setReport(readReport());
    setLoaded(true);
  }, []);

  const saveReport = useCallback((next: StoredReport) => {
    setReport(next);
    writeReport(next);
  }, []);

  const patchReport = useCallback((patch: Partial<StoredReport>) => {
    setReport((prev) => {
      const next: StoredReport = {
        repo: "",
        ...(prev ?? {}),
        ...patch,
        savedAt: new Date().toISOString(),
      };
      writeReport(next);
      return next;
    });
  }, []);

  const clearReport = useCallback(() => {
    setReport(null);
    clearStoredReport();
  }, []);

  const value = useMemo(
    () => ({ report, loaded, saveReport, patchReport, clearReport }),
    [report, loaded, saveReport, patchReport, clearReport]
  );

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
}

export function useReportStore(): ReportContextValue {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error("useReportStore must be used inside <ReportProvider>");
  return ctx;
}
