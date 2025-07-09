import { ProductionReport } from "../report/ReportScreen";


const mockReports: Record<string, ProductionReport> = {
  "1": {
    farmerName: "DEEPAK",
    place: "SANJARWAS FLOCK 1",
    hatchDate: "30.01.2024",
    totalMortalityPercent: 10.5520396,
    chicksHoused: 15959,
    mortalityNos: 1684,
    birdLifted: 14275,
    shortage: 0,
    birdWeight: 25570.2,
    fcrPercent: 1.726619268,
    liftingPercent: 89.4479604,
    avgWeight: 1.791257443,
    lotGrade: "A",
    productionCostDetails: [
      { item: "Chicks", quantity: 15959, rate: 27, amount: 430893 },
      { item: "Feed", quantity: 44150, rate: 41.5, amount: 1832225 },
      { item: "Medicine", quantity: "ACTUAL", rate: "", amount: 54580 },
      { item: "Admin", quantity: 15959, rate: 2.2, amount: 35109.8 },
      { item: "TOTAL", quantity: "", rate: "", amount: 2352807.8 },
    ],
    productionCostPerKg: 92.01366434,
    basic: 8,
    performance: "82-10.01366434-5.006832172",
    bal: -2.993167828,
    shortingBirdKg: "0 82 0",
    extraMortality: "797.95 886.05 23923.35",
    minimumGrowingCharge: "3*25570.2 76710.6",
    finalAmount: 76710.6,
  },
};

export const getReportData = (reportId: string): ProductionReport => {
  return mockReports[reportId] || mockReports["1"];
};