import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../../redux/slices/cartSlice';
import COLORS from '../../constants/colors';
import theme from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const CartScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { items, total } = useSelector(state => state.cart);

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const renderItem = ({ item }) => {
    // Determinar la fuente de la imagen
    const imageSource = item.image || 
                       (item.imageUrl ? { uri: item.imageUrl } : null);
    
    return (
      <View style={styles.cartItem}>
        <View style={styles.itemImageContainer}>
          {imageSource ? (
            <Image 
              source={imageSource} 
              style={styles.itemImage} 
              resizeMode="cover"
              onError={(error) => console.log('Error loading cart item image:', error.nativeEvent.error)}
            />
          ) : (
            <View style={[styles.itemImage, { backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="image-outline" size={24} color={COLORS.primary} />
            </View>
          )}
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)} c/u</Text>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityText}>Cantidad: {item.quantity}</Text>
            <Text style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => handleRemoveFromCart(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
    );
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={64} color={COLORS.primary} />
        <Text style={styles.emptyText}>Tu carrito está vacío</Text>
        <Text style={styles.emptySubtext}>Añade productos para comenzar a comprar</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Carrito</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearButton}>Vaciar carrito</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Payment')}
        >
          <Text style={styles.checkoutButtonText}>Pagar ahora</Text>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: COLORS.background,
  },
  emptyText: {
    ...theme.typography.h2,
    color: COLORS.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    ...theme.typography.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  title: {
    ...theme.typography.h2,
    color: COLORS.primary,
  },
  clearButton: {
    ...theme.typography.body,
    color: COLORS.danger,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: theme.spacing.md,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    ...theme.typography.subtitle,
    color: COLORS.text,
    marginBottom: 4,
  },
  itemPrice: {
    ...theme.typography.body,
    color: COLORS.primary,
    marginBottom: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityText: {
    ...theme.typography.caption,
    color: COLORS.textSecondary,
  },
  itemTotal: {
    ...theme.typography.bodyBold,
    color: COLORS.primary,
  },
  removeButton: {
    justifyContent: 'center',
    paddingLeft: theme.spacing.md,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  totalText: {
    ...theme.typography.h3,
    color: COLORS.text,
  },
  totalAmount: {
    ...theme.typography.h2,
    color: COLORS.primary,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  checkoutButtonText: {
    ...theme.typography.button,
    color: COLORS.white,
  },
});

export default CartScreen;
