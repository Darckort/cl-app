import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import COLORS from '../../constants/colors';
import theme from '../../constants/theme';

const ProfileScreen = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'usuario@ejemplo.com'}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Información de la cuenta</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Nombre</Text>
          <Text style={styles.infoValue}>{user?.name || 'No disponible'}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Correo electrónico</Text>
          <Text style={styles.infoValue}>{user?.email || 'No disponible'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileHeader: {
    backgroundColor: COLORS.primary,
    padding: theme.spacing.xl,
    alignItems: 'center',
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xxl + 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...theme.shadow.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadow.lg,
  },
  avatarText: {
    ...theme.typography.h1,
    color: COLORS.primary,
  },
  userName: {
    ...theme.typography.h2,
    color: COLORS.white,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    ...theme.typography.body,
    color: COLORS.white,
    opacity: 0.9,
  },
  infoContainer: {
    marginTop: -20,
    backgroundColor: COLORS.white,
    borderRadius: theme.radius.lg,
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
    ...theme.shadow.sm,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: COLORS.primary,
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoItem: {
    marginBottom: theme.spacing.lg,
  },
  infoLabel: {
    ...theme.typography.caption,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    ...theme.typography.body,
    color: COLORS.text,
  },
});

export default ProfileScreen;
