import { useAppTheme } from '@/hooks/use-app-theme';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '../../constants/firebaseConfig';

const CATEGORY_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#BA68C8'];

type Transaction = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date?: string;
};

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const chartWidth = Dimensions.get('window').width - 44;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { resolvedTheme } = useAppTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    const transactionsQuery = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(transactionsQuery, (snapshot) => {
      const data = snapshot.docs.map((item) => {
        const docData = item.data() as Omit<Transaction, 'id'>;
        return {
          id: item.id,
          ...docData,
        };
      });
      setTransactions(data);
    });

    return unsubscribe;
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const spendingRate = Math.min((totalExpenses / Math.max(totalIncome, 1)) * 100, 100);

  const expenseByCategory = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'expense')
        .reduce<Record<string, number>>((acc, transaction) => {
          acc[transaction.category] = (acc[transaction.category] ?? 0) + transaction.amount;
          return acc;
        }, {}),
    [transactions]
  );

  const wheelData = useMemo(() => {
    const values = Object.entries(expenseByCategory).map(([category, amount], index) => ({
      name: category,
      amount,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
      legendFontColor: '#444',
      legendFontSize: 12,
    }));

    if (values.length === 0) {
      return [
        {
          name: 'No data',
          amount: 1,
          color: '#D0D0D0',
          legendFontColor: '#666',
          legendFontSize: 12,
        },
      ];
    }

    return values;
  }, [expenseByCategory]);

  const chartConfig = {
    backgroundGradientFrom: isDark ? '#202225' : '#ffffff',
    backgroundGradientTo: isDark ? '#202225' : '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(${isDark ? '230,230,230' : '51,51,51'}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${isDark ? '230,230,230' : '51,51,51'}, ${opacity})`,
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: isDark ? '#3b3f45' : '#ececec',
    },
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 12 }]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.headingRow}>
        <Text style={[styles.heading, { color: isDark ? '#f4f4f4' : '#111' }]}>Budget Buddy</Text>
      </View>
      <View style={[styles.card, styles.incomeCard]}>
        <Text style={styles.label}>Income</Text>
        <Text style={styles.value}>PHP {totalIncome.toLocaleString()}</Text>
      </View>
      <View style={[styles.card, styles.expenseCard]}>
        <Text style={styles.label}>Expenses</Text>
        <Text style={styles.value}>PHP {totalExpenses.toLocaleString()}</Text>
      </View>
      <View style={[styles.card, balance >= 0 ? styles.balanceCard : styles.negativeCard]}>
        <Text style={styles.label}>Balance</Text>
        <Text style={styles.value}>PHP {balance.toLocaleString()}</Text>
      </View>

      <View style={[styles.chartCard, { backgroundColor: isDark ? '#1e2124' : '#fff' }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#f4f4f4' : '#222' }]}>Budget Wheel</Text>
        <Text style={[styles.sectionSubtitle, { color: isDark ? '#aaa' : '#666' }]}>
          {spendingRate.toFixed(0)}% of income used
        </Text>
        <PieChart
          data={wheelData}
          width={chartWidth}
          height={180}
          accessor="amount"
          chartConfig={chartConfig}
          backgroundColor="transparent"
          paddingLeft="14"
          hasLegend
          absolute
          center={[10, 0]}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { paddingHorizontal: 16, paddingBottom: 32, gap: 16 },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 8,
  },
  heading: { fontSize: 28, fontWeight: '700', textAlign: 'center' },
  card: { borderRadius: 14, padding: 18, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  incomeCard: { backgroundColor: '#4CAF50' },
  expenseCard: { backgroundColor: '#f44336' },
  balanceCard: { backgroundColor: '#2196F3' },
  negativeCard: { backgroundColor: '#FF5722' },
  label: { color: '#fff', fontSize: 13, fontWeight: '600', marginBottom: 8, opacity: 0.9 },
  value: { color: '#fff', fontSize: 26, fontWeight: '700', letterSpacing: 0.5 },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
    paddingHorizontal: 0,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
    paddingHorizontal: 0,
    fontWeight: '500',
  },
  lineChart: {
    marginLeft: -8,
    borderRadius: 12,
  },
});
