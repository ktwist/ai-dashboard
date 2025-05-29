import { create } from "zustand";

type Report = {
    id: number;
    title: string;
    content: string;
};

type ReportStore = {
  reports: Report[];
  addReport: (title: string, content: string) => void;
  removeReport: (id: number) => void;
  editReport: (id: number, title: string, content: string) => void; // Add this
};

export const useReportStore = create<ReportStore>((set) => ({
  reports: [],
  addReport: (title, content) =>
    set((state) => ({
      reports: [
        ...state.reports,
        { id: Date.now(), title, content }
      ]
    })),
  removeReport: (id) =>
    set((state) => ({
      reports: state.reports.filter((report) => report.id !== id)
    })),
  editReport: (id, title, content) =>
    set((state) => ({
      reports: state.reports.map((report) =>
        report.id === id ? { ...report, title, content } : report
      )
    }))
}));