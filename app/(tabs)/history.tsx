import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '../../constants/firebaseConfig';
import { useAppTheme } from '@/hooks/use-app-theme';

type Transaction = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date?: string;
  description?: string;
};

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { resolvedTheme } = useAppTheme();
  const isDark = resolvedTheme === 'dark';
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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

  const filtered = useMemo(
    () => (filter === 'all' ? transactions : transactions.filter((t) => t.type === filter)),
    [filter, transactions]
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 12, backgroundColor: isDark ? '#121212' : '#f5f5f5' },
      ]}>
      <Text style={[styles.heading, { color: isDark ? '#f1f1f1' : '#111' }]}>History</Text>
      <View style={styles.filters}>
        {(['all', 'income', 'expense'] as const).map((value) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.filterBtn,
              { backgroundColor: isDark ? '#202225' : '#fff', borderColor: isDark ? '#3a3f45' : '#ddd' },
              filter === value && styles.filterBtnActive,
            ]}
            onPress={() => setFilter(value)}>
            <Text
              style={[
                styles.filterText,
                { color: isDark ? '#e8e8e8' : '#333' },
                filter === value && styles.filterTextActive,
              ]}>
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyState, { color: isDark ? '#a9a9a9' : '#666' }]}>No transactions yet.</Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.item, { backgroundColor: isDark ? '#202225' : '#fff' }]}>
            <View>
              <Text style={[styles.category, { color: isDark ? '#f1f1f1' : '#111' }]}>{item.category}</Text>
              <Text style={[styles.date, { color: isDark ? '#a9a9a9' : '#666' }]}>
                {item.description || item.date || 'No description'}
              </Text>
            </View>
            <Text style={[styles.amount, { color: item.type === 'income' ? '#4CAF50' : '#f44336' }]}>
              {item.type === 'income' ? '+' : '-'} PHP {item.amount.toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 16 },
  heading: { fontSize: 24, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  filters: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12, gap: 8 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  filterBtnActive: { backgroundColor: '#2196F3', borderColor: '#2196F3' },
  filterText: { color: '#333', fontWeight: '700' },
  filterTextActive: { color: '#fff' },
  listContent: { paddingBottom: 20 },
  emptyState: { textAlign: 'center', color: '#666', marginTop: 24 },
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: { fontSize: 15, fontWeight: '700' },
  date: { color: '#666' },
  amount: { fontSize: 15, fontWeight: '700' },
});
