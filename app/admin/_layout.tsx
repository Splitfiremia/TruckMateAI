import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AdminLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'TruckMate Admin Portal',
            headerStyle: { backgroundColor: '#117ACA' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: 'bold' }
          }} 
        />
        <Stack.Screen 
          name="users" 
          options={{ 
            title: 'User Management',
            headerStyle: { backgroundColor: '#117ACA' },
            headerTintColor: '#FFFFFF'
          }} 
        />
        <Stack.Screen 
          name="api-gateway" 
          options={{ 
            title: 'API Gateway',
            headerStyle: { backgroundColor: '#117ACA' },
            headerTintColor: '#FFFFFF'
          }} 
        />
        <Stack.Screen 
          name="cost-control" 
          options={{ 
            title: 'Cost Control',
            headerStyle: { backgroundColor: '#117ACA' },
            headerTintColor: '#FFFFFF'
          }} 
        />
        <Stack.Screen 
          name="payments" 
          options={{ 
            title: 'Payment System',
            headerStyle: { backgroundColor: '#117ACA' },
            headerTintColor: '#FFFFFF'
          }} 
        />
      </Stack>
    </>
  );
}