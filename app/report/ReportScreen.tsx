import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { getReportData } from '../services/reportService';

const ReportsScreen = () => {
  const route = useRoute();
  const { reportId } = route.params as { reportId: string };
  const [report, setReport] = useState<ProductionReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const reportData = getReportData(reportId);
        setReport(reportData);
      } catch (error) {
        console.error("Failed to load report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reportId]);

  const handleDownload = () => {
    // In real app: generatePDF(report);
    alert(`Downloading report: ${report?.farmerName} - ${report?.place}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={themeColors.accent} />
        <Text style={styles.loadingText}>Generating Report...</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Report not found</Text>
      </View>
    );
  }

  // Production summary data split into columns
  const leftColumnData = [
    { label: 'Total mortality %', value: report.totalMortalityPercent },
    { label: 'Chicks Housed (Nos)', value: report.chicksHoused },
    { label: 'Mortality (Nos)', value: report.mortalityNos },
    { label: 'Bird Lifted (Nos)', value: report.birdLifted },
    { label: 'Shortage (Nos)', value: report.shortage },
    { label: 'Bird weight (kg)', value: report.birdWeight },
  ];

  const rightColumnData = [
    { label: 'FCR %', value: report.fcrPercent },
    { label: 'Lifting %', value: report.liftingPercent },
    { label: 'Avg. Wt.', value: report.avgWeight },
    { label: 'Mean Age', value: report.meanAge || '-' },
    { label: 'Farmer Profit KG', value: report.farmerProfitKG || '-' },
    { label: 'MSP KG', value: report.mspKG || '-' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {report.farmerName} - {report.place}
      </Text>
      
      <ScrollView style={styles.contentContainer}>
        {/* Farmer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Farmer Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Farmer Name:</Text>
            <Text style={styles.detailValue}>{report.farmerName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Place:</Text>
            <Text style={styles.detailValue}>{report.place}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Hatch Date:</Text>
            <Text style={styles.detailValue}>{report.hatchDate}</Text>
          </View>
        </View>

        {/* Production Summary - Fixed layout */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Production Summary</Text>
          
          <View style={styles.summaryContainer}>
            {/* Left Column */}
            <View style={styles.summaryColumn}>
              {leftColumnData.map((item, index) => (
                <View key={index} style={styles.summaryRow}>
                  <Text 
                    style={styles.summaryLabel}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.label}
                  </Text>
                  <Text style={styles.summaryValue}>{item.value}</Text>
                </View>
              ))}
            </View>
            
            {/* Right Column */}
            <View style={styles.summaryColumn}>
              {rightColumnData.map((item, index) => (
                <View key={index} style={styles.summaryRow}>
                  <Text 
                    style={styles.summaryLabel}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.label}
                  </Text>
                  <Text style={styles.summaryValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.lotGrade}>
            <Text style={styles.lotGradeLabel}>Lot grade:</Text>
            <Text style={styles.lotGradeValue}>{report.lotGrade}</Text>
          </View>
        </View>

        {/* Production Cost Details */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Production Cost Details</Text>
          
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Particular</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Quantity</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Rate</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Amount</Text>
          </View>
          
          {/* Table Rows */}
          {report.productionCostDetails.map((row: { item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; quantity: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; rate: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; amount: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
            <View 
              key={index} 
              style={[
                styles.tableRow,
                index === report.productionCostDetails.length - 1 && styles.totalRow
              ]}
            >
              <Text style={[styles.tableCell, { flex: 2, fontWeight: index === report.productionCostDetails.length - 1 ? 'bold' : 'normal' }]}>
                {row.item}
              </Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{row.quantity}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{row.rate}</Text>
              <Text style={[styles.tableCell, { flex: 1.5, fontWeight: index === report.productionCostDetails.length - 1 ? 'bold' : 'normal' }]}>
                {row.amount}
              </Text>
            </View>
          ))}
          
          {/* Cost Calculations */}
          <View style={styles.costDetail}>
            <Text style={styles.costLabel}>Production Cost /-kg:</Text>
            <Text style={styles.costValue}>{report.productionCostPerKg}</Text>
          </View>
          <View style={styles.costDetail}>
            <Text style={styles.costLabel}>Basic:</Text>
            <Text style={styles.costValue}>{report.basic}</Text>
          </View>
          <View style={styles.costDetail}>
            <Text style={styles.costLabel}>Performance:</Text>
            <Text style={styles.costValue}>{report.performance}</Text>
          </View>
          <View style={styles.costDetail}>
            <Text style={styles.costLabel}>bal:</Text>
            <Text style={styles.costValue}>{report.bal}</Text>
          </View>
          <View style={styles.costDetail}>
            <Text style={styles.costLabel}>Shorting bird kg:</Text>
            <Text style={styles.costValue}>{report.shortingBirdKg}</Text>
          </View>
          <View style={styles.costDetail}>
            <Text style={styles.costLabel}>Extra mortality:</Text>
            <Text style={styles.costValue}>{report.extraMortality}</Text>
          </View>
          <View style={styles.costDetail}>
            <Text style={styles.costLabel}>MINIMUM GROWING CHARGE ABOVE 90 TO 95:</Text>
            <Text style={styles.costValue}>{report.minimumGrowingCharge}</Text>
          </View>
          <View style={[styles.costDetail, styles.finalAmount]}>
            <Text style={styles.finalLabel}>FINAL AMT.:</Text>
            <Text style={styles.finalValue}>{report.finalAmount}</Text>
          </View>
        </View>
        
        {/* Download Button */}
        <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
          <MaterialIcons name="file-download" size={24} color="white" />
          <Text style={styles.downloadButtonText}>Download Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Theme colors
const themeColors = {
  bg: '#f8f9fa',
  white: '#ffffff',
  text: '#2c3e50',
  accent: '#3498db',
  inputBg: '#f1f2f6',
  success: '#28a745',
  info: '#17a2b8',
  warning: '#ffc107',
  cardBg: '#ffffff',
};

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.bg,
    padding: isSmallScreen ? 10 : 20,
  },
  header: {
    fontSize: isSmallScreen ? 22 : 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: isSmallScreen ? 10 : 15,
    color: themeColors.text,
  },
  contentContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: themeColors.cardBg,
    borderRadius: 20,
    padding: isSmallScreen ? 15 : 20,
    marginBottom: isSmallScreen ? 15 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionHeader: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: 'bold',
    marginBottom: isSmallScreen ? 12 : 15,
    color: themeColors.text,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: themeColors.inputBg,
    paddingBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: isSmallScreen ? 8 : 10,
  },
  detailLabel: {
    flex: 1,
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
    color: themeColors.text,
  },
  detailValue: {
    flex: 2,
    fontSize: isSmallScreen ? 14 : 16,
    color: themeColors.text,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  summaryColumn: {
    width: '48%', // Prevents overlapping
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: isSmallScreen ? 6 : 8,
  },
  summaryLabel: {
    flex: 1, // Takes available space
    fontSize: isSmallScreen ? 13 : 15,
    color: themeColors.text,
    marginRight: 5,
  },
  summaryValue: {
    minWidth: '30%', // Ensures values align
    fontSize: isSmallScreen ? 13 : 15,
    color: themeColors.text,
    fontWeight: '500',
    textAlign: 'right',
  },
  lotGrade: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: themeColors.inputBg,
  },
  lotGradeLabel: {
    fontSize: isSmallScreen ? 15 : 17,
    fontWeight: 'bold',
    color: themeColors.text,
    marginRight: 10,
  },
  lotGradeValue: {
    fontSize: isSmallScreen ? 15 : 17,
    fontWeight: 'bold',
    color: themeColors.success,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: themeColors.accent + '20',
    padding: isSmallScreen ? 8 : 10,
    borderRadius: 8,
    marginBottom: isSmallScreen ? 8 : 10,
  },
  tableHeaderText: {
    fontSize: isSmallScreen ? 13 : 15,
    fontWeight: 'bold',
    color: themeColors.text,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: isSmallScreen ? 8 : 10,
    borderBottomWidth: 1,
    borderBottomColor: themeColors.inputBg,
  },
  tableCell: {
    fontSize: isSmallScreen ? 13 : 15,
    color: themeColors.text,
    textAlign: 'center',
  },
  totalRow: {
    backgroundColor: themeColors.success + '15',
    fontWeight: 'bold',
    borderRadius: 8,
    marginTop: 5,
  },
  costDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: isSmallScreen ? 8 : 10,
    paddingVertical: isSmallScreen ? 4 : 6,
  },
  costLabel: {
    fontSize: isSmallScreen ? 14 : 16,
    color: themeColors.text,
    fontWeight: '500',
    flex: 2,
  },
  costValue: {
    fontSize: isSmallScreen ? 14 : 16,
    color: themeColors.text,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  finalAmount: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: themeColors.text,
  },
  finalLabel: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    color: themeColors.text,
  },
  finalValue: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    color: themeColors.success,
  },
  downloadButton: {
    backgroundColor: themeColors.accent,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: isSmallScreen ? 12 : 15,
    borderRadius: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  downloadButtonText: {
    color: themeColors.white,
    fontWeight: 'bold',
    fontSize: isSmallScreen ? 16 : 18,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeColors.bg,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: themeColors.text,
  },
  errorText: {
    fontSize: 20,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default ReportsScreen;

export interface ProductionCostDetail {
  item: string;
  quantity: string | number;
  rate: string | number;
  amount: string | number;
}

export interface ProductionReport {
  farmerName: string;
  place: string;
  hatchDate: string;
  totalMortalityPercent: number;
  chicksHoused: number;
  mortalityNos: number;
  birdLifted: number;
  shortage: number;
  birdWeight: number;
  fcrPercent: number;
  liftingPercent: number;
  avgWeight: number;
  meanAge?: number;
  farmerProfitKG?: number;
  mspKG?: number;
  lotGrade: string;
  productionCostDetails: ProductionCostDetail[];
  productionCostPerKg: number;
  basic: number;
  performance: string;
  bal: number;
  shortingBirdKg: string;
  extraMortality: string;
  minimumGrowingCharge: string;
  finalAmount: number;
}