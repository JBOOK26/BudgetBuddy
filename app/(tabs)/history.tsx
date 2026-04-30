import { useAppTheme } from '@/hooks/use-app-theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '../../constants/firebaseConfig';
import { useAuth } from '@/contexts/AuthContext';

type Transaction = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date?: string;
  description?: string;
};

const DELETE_BTN_WIDTH = 44;
const DELETE_SLOT_OUTER = DELETE_BTN_WIDTH + 10;

function HistoryRow({
  item,
  isDark,
  revealed,
  onToggleReveal,
  onRequestDelete,
}: {
  item: Transaction;
  isDark: boolean;
  revealed: boolean;
  onToggleReveal: () => void;
  onRequestDelete: () => void;
}) {
  const slotWidth = useSharedValue(revealed ? DELETE_SLOT_OUTER : 0);

  useEffect(() => {
    slotWidth.value = withTiming(revealed ? DELETE_SLOT_OUTER : 0, { duration: 260 });
  }, [revealed]);

  const deleteSlotStyle = useAnimatedStyle(() => ({
    width: slotWidth.value,
    opacity: slotWidth.value > 0 ? slotWidth.value / DELETE_SLOT_OUTER : 0,
  }));

  const description = item.description || item.date || 'No description';

  return (
    <View style={styles.rowWrapper}>
      <Pressable
        style={[styles.item, { backgroundColor: isDark ? '#202225' : '#fff' }]}
        onPress={onToggleReveal}
        accessibilityRole="button"
        accessibilityLabel={`${item.category}, ${description}. Tap to ${revealed ? 'hide' : 'show'} delete`}>
        <View style={styles.itemMain}>
          <Text style={[styles.category, { color: isDark ? '#f1f1f1' : '#111' }]}>{item.category}</Text>
          <Text style={[styles.date, { color: isDark ? '#a9a9a9' : '#666' }]} numberOfLines={2}>
            {description}
          </Text>
        </View>
        <Text style={[styles.amount, { color: item.type === 'income' ? '#4CAF50' : '#f44336' }]}>
          {item.type === 'income' ? '+' : '-'} PHP {item.amount.toLocaleString()}
        </Text>
      </Pressable>
      <Animated.View style={[styles.deleteSlotOuter, deleteSlotStyle]} pointerEvents="box-none">
        <View style={styles.deleteSlotInner}>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={onRequestDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete this transaction">
            <MaterialIcons name="delete-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { resolvedTheme } = useAppTheme();
  const { user } = useAuth();
  const isDark = resolvedTheme === 'dark';
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deleteRevealedId, setDeleteRevealedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
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
  }, [user?.uid]);

  const filtered = useMemo(
    () => (filter === 'all' ? transactions : transactions.filter((t) => t.type === filter)),
    [filter, transactions]
  );

  const confirmDelete = (id: string) => {
    Alert.alert('Delete transaction', 'Remove this entry from your history? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel', onPress: () => setDeleteRevealedId(null) },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'transactions', id));
            setDeleteRevealedId(null);
          } catch {
            Alert.alert('Could not delete', 'Check your connection and Firestore rules, then try again.');
          }
        },
      },
    ]);
  };

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
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => setDeleteRevealedId(null)}
        ListEmptyComponent={
          <Text style={[styles.emptyState, { color: isDark ? '#a9a9a9' : '#666' }]}>No transactions yet.</Text>
        }
        renderItem={({ item }) => (
          <HistoryRow
            item={item}
            isDark={isDark}
            revealed={deleteRevealedId === item.id}
            onToggleReveal={() => setDeleteRevealedId((prev) => (prev === item.id ? null : item.id))}
            onRequestDelete={() => confirmDelete(item.id)}
          />
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
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 10,
  },
  item: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  itemMain: { flex: 1, minWidth: 0 },
  deleteSlotOuter: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  deleteSlotInner: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  deleteBtn: {
    width: DELETE_BTN_WIDTH,
    height: DELETE_BTN_WIDTH,
    borderRadius: 12,
    backgroundColor: '#f44336',
    alignItems: 'center',
    justifyContent: 'center',
  },
  category: { fontSize: 15, fontWeight: '700' },
  date: { color: '#666', marginTop: 2 },
  amount: { fontSize: 15, fontWeight: '700', flexShrink: 0 },
});
