import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, Text, FlatList, View, Platform } from 'react-native';
import axios from 'axios';

const API_BASE = Platform.select({
  ios: 'http://localhost:4000',
  android: 'http://10.0.2.2:4000'
});

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [leaders, setLeaders] = useState([]);

  const login = async () => {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      alert('Hello ' + (res.data.user.displayName || 'Student'));
    } catch {
      alert('Login failed');
    }
  };

  const loadLeaders = async () => {
    const r = await axios.get(`${API_BASE}/leaderboard`);
    setLeaders(r.data);
  };

  return (
    <SafeAreaView style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>EduPortal</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
      />
      <Button title="Log in" onPress={login} />
      <View style={{ height: 16 }} />
      <Button title="Load Leaderboard" onPress={loadLeaders} />
      <FlatList
        data={leaders}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <Text>{item.displayName || 'Anon'} — {item.points} pts</Text>
        )}
      />
    </SafeAreaView>
  );
}
