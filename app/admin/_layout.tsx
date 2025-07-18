import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'TruckMate AI Admin',
          headerStyle: { backgroundColor: '#1f2937' },
          headerTintColor: '#fff',
        }} 
      />
      <Stack.Screen 
        name="profit-guard" 
        options={{ 
          title: 'Profit Guard Dashboard',
          headerStyle: { backgroundColor: '#1f2937' },
          headerTintColor: '#fff',
        }} 
      />
      <Stack.Screen 
        name="user-management" 
        options={{ 
          title: 'User Management',
          headerStyle: { backgroundColor: '#1f2937' },
          headerTintColor: '#fff',
        }} 
      />
      <Stack.Screen 
        name="api-gateway" 
        options={{ 
          title: 'API Gateway Control',
          headerStyle: { backgroundColor: '#1f2937' },
          headerTintColor: '#fff',
        }} 
      />
    </Stack>
  );
}