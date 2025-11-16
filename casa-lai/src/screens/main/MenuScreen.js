import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import COLORS from '../../constants/colors';
import theme from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const MenuScreen = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const menuItems = [
    { id: '1', title: 'Mi Perfil', icon: 'person-outline' },
    { id: '2', title: 'Mis Pedidos', icon: 'receipt-outline' },
    { id: '3', title: 'Configuración', icon: 'settings-outline' },
    { id: '4', title: 'Ayuda', icon: 'help-circle-outline' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menú</Text>
      </View>
      
      <ScrollView style={styles.menuList}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem}>
            <Ionicons name={item.icon} size={24} color={COLORS.primary} style={styles.menuIcon} />
            <Text style={styles.menuText}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    ...theme.typography.h2,
    color: COLORS.primary,
  },
  menuList: {
    flex: 1,
    padding: theme.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  menuIcon: {
    marginRight: theme.spacing.md,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    ...theme.typography.body,
    flex: 1,
    color: COLORS.text,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: COLORS.lightGray,
  },
  logoutIcon: {
    marginRight: theme.spacing.sm,
  },
  logoutText: {
    ...theme.typography.bodyBold,
    color: COLORS.danger,
  },
});

export default MenuScreen;
