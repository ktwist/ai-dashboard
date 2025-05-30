import { create } from "zustand";
import { persist } from "zustand/middleware";

type Report = {
  id: number;
  title: string;
  content: string;
  index: number; // <-- add index property
};

type ReportStore = {
  reports: Report[];
  addReport: (title: string, content: string) => void;
  removeReport: (id: number) => void;
  editReport: (id: number, title: string, content: string) => void;
  setReports: (reports: Report[]) => void;
};

export const useReportStore = create<ReportStore>()(
  persist(
    (set) => ({
      reports: [],
      addReport: (title, content) =>
        set((state) => ({
          reports: [
            ...state.reports,
            {
              id: Date.now(),
              title,
              content,
              index: state.reports.length // set index as the last position
            }
          ]
        })),
      removeReport: (id) =>
        set((state) => ({
          reports: state.reports
            .filter((report) => report.id !== id)
            .map((report, idx) => ({ ...report, index: idx })) // re-index after removal
        })),
      editReport: (id, title, content) =>
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === id ? { ...report, title, content } : report
          )
        })),
      setReports: (reports) =>
        set({
          reports: reports.map((report, idx) => ({
            ...report,
            index: idx // ensure index is updated after drag-and-drop
          }))
        }),
    }),
    {
      name: "report-storage",
    }
  )
);