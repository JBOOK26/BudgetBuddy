import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '../../constants/firebaseConfig';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/contexts/AuthContext';

const categories = ['Food', 'Transport', 'Bills', 'Salary', 'Freelance', 'Shopping', 'Health', 'Other'];

export default function AddScreen() {
  const insets = useSafeAreaInsets();
  const { resolvedTheme } = useAppTheme();
  const { user } = useAuth();
  const isDark = resolvedTheme === 'dark';
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!amount || Number.isNaN(Number(amount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      setSaving(true);
      await addDoc(collection(db, 'transactions'), {
        type,
        amount: Number(amount),
        category,
        description: description.trim(),
        date: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
        userId: user?.uid,
      });

      Alert.alert('Saved', `${type} - PHP ${amount} - ${category}`);
      setAmount('');
      setDescription('');
    } catch {
      Alert.alert('Error', 'Could not save transaction. Check Firestore rules and connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}
      contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + 12 }]}
      showsVerticalScrollIndicator={false}>
      <Text style={[styles.heading, { color: isDark ? '#f1f1f1' : '#111' }]}>Add Transaction</Text>

      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[styles.typeBtn, type === 'expense' && styles.typeBtnExpense]}
          onPress={() => setType('expense')}>
          <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeBtn, type === 'income' && styles.typeBtnIncome]}
          onPress={() => setType('income')}>
          <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>Income</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.label, { color: isDark ? '#e3e3e3' : '#333' }]}>Amount (PHP)</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? '#202225' : '#fff',
            borderColor: isDark ? '#3a3f45' : '#ddd',
            color: isDark ? '#f1f1f1' : '#111',
          },
        ]}
        placeholderTextColor={isDark ? '#9aa0a6' : '#666'}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={[styles.label, { color: isDark ? '#e3e3e3' : '#333' }]}>Category</Text>
      <View style={styles.categoryGrid}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryBtn,
              { backgroundColor: isDark ? '#202225' : '#fff', borderColor: isDark ? '#3a3f45' : '#ddd' },
              category === cat && styles.categoryBtnActive,
            ]}
            onPress={() => setCategory(cat)}>
            <Text
              style={[
                styles.categoryText,
                { color: isDark ? '#e8e8e8' : '#333' },
                category === cat && styles.categoryTextActive,
              ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { color: isDark ? '#e3e3e3' : '#333' }]}>Description</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? '#202225' : '#fff',
            borderColor: isDark ? '#3a3f45' : '#ddd',
            color: isDark ? '#f1f1f1' : '#111',
          },
        ]}
        placeholderTextColor={isDark ? '#9aa0a6' : '#666'}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: type === 'expense' ? '#f44336' : '#4CAF50' }]}
        disabled={saving}
        onPress={handleSubmit}>
        <Text style={styles.submitText}>{saving ? 'Saving...' : 'Save Transaction'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contentContainer: { paddingHorizontal: 16, paddingBottom: 24 },
  heading: { fontSize: 24, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  typeRow: { flexDirection: 'row', marginBottom: 16, borderRadius: 12, overflow: 'hidden' },
  typeBtn: { flex: 1, padding: 14, alignItems: 'center', backgroundColor: '#fff' },
  typeBtnExpense: { backgroundColor: '#f44336' },
  typeBtnIncome: { backgroundColor: '#4CAF50' },
  typeText: { fontWeight: '700', color: '#333' },
  typeTextActive: { color: '#fff' },
  label: { fontWeight: '700', marginBottom: 8, color: '#333' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  categoryBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  categoryBtnActive: { backgroundColor: '#2196F3', borderColor: '#2196F3' },
  categoryText: { color: '#333' },
  categoryTextActive: { color: '#fff' },
  submitBtn: { padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
