import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import theme from '../../constants/theme';

const banks = [
  { id: '0102', name: 'Banco de Venezuela' },
  { id: '0104', name: 'Venezolano de Crédito' },
  { id: '0105', name: 'Banco Mercantil' },
  { id: '0108', name: 'Banco Provincial' },
  { id: '0114', name: 'Bancaribe' },
  { id: '0115', name: 'Banco Exterior' },
  { id: '0116', name: 'Banco Occidental de Descuento' },
  { id: '0128', name: 'Banco Caroní' },
  { id: '0134', name: 'Banesco' },
  { id: '0137', name: 'Banco Sofitasa' },
  { id: '0138', name: 'Banco Plaza' },
  { id: '0146', name: 'Banco de la Gente Emprendedora' },
  { id: '0151', name: 'BFC Banco Fondo Común' },
  { id: '0156', name: '100% Banco' },
  { id: '0157', name: 'DelSur' },
  { id: '0163', name: 'Banco del Tesoro' },
  { id: '0166', name: 'Banco Agrícola de Venezuela' },
  { id: '0168', name: 'Bancrecer' },
  { id: '0169', name: 'Mi Banco' },
  { id: '0171', name: 'Banco Activo' },
  { id: '0172', name: 'Bancamiga' },
  { id: '0173', name: 'Banco Internacional de Desarrollo' },
  { id: '0174', name: 'Banplus' },
  { id: '0175', name: 'Banco Bicentenario' },
  { id: '0176', name: 'Banco de la Fuerza Armada Nacional Bolivariana' },
  { id: '0177', name: 'Banco de la Gente Emprendedora' },
  { id: '0190', name: 'Citibank' },
  { id: '0191', name: 'Banco Nacional de Crédito' },
];

const PaymentScreen = () => {
  const navigation = useNavigation();
  const { total } = useSelector(state => state.cart);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showMobilePaymentModal, setShowMobilePaymentModal] = useState(false);
  const [bank, setBank] = useState('');
  const [reference, setReference] = useState('');
  const [phone, setPhone] = useState('');
  const [showBankList, setShowBankList] = useState(false);

  const formatPhoneNumber = (text) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Format as 0412-1234567 (4-7)
    let formatted = '';
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 11)}`;
    } else {
      formatted = cleaned;
    }
    
    setPhone(formatted);
  };

  const handlePayment = () => {
    // Handle payment submission
    console.log({
      method: selectedMethod,
      bank,
      reference,
      phone,
      amount: total
    });
    
    // Show success message and navigate to order confirmation
    alert('Pago procesado exitosamente');
    navigation.navigate('OrderConfirmation');
  };

  const renderMobilePaymentModal = () => (
    <Modal
      visible={showMobilePaymentModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowMobilePaymentModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Pago Móvil</Text>
            <TouchableOpacity onPress={() => setShowMobilePaymentModal(false)}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.instructions}>
              Realiza el pago a través de tu banca móvil y luego ingresa los datos de la transacción.
            </Text>
            
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total a pagar:</Text>
              <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Banco</Text>
              <TouchableOpacity 
                style={styles.bankSelector}
                onPress={() => setShowBankList(!showBankList)}
              >
                <Text style={bank ? styles.bankSelectedText : styles.placeholderText}>
                  {bank || 'Selecciona un banco'}
                </Text>
                <Ionicons 
                  name={showBankList ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color={COLORS.text} 
                />
              </TouchableOpacity>
              
              {showBankList && (
                <View style={styles.bankList}>
                  <ScrollView style={styles.bankScrollView}>
                    {banks.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.bankItem}
                        onPress={() => {
                          setBank(item.name);
                          setShowBankList(false);
                        }}
                      >
                        <Text style={styles.bankName}>{item.name}</Text>
                        <Text style={styles.bankCode}>({item.id})</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Últimos 6 dígitos de referencia</Text>
              <TextInput
                style={styles.input}
                placeholder="123456"
                keyboardType="numeric"
                maxLength={6}
                value={reference}
                onChangeText={setReference}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Teléfono (ej: 0412-1234567)</Text>
              <TextInput
                style={styles.input}
                placeholder="0412-1234567"
                keyboardType="phone-pad"
                maxLength={12}
                value={phone}
                onChangeText={formatPhoneNumber}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={() => setShowMobilePaymentModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.confirmButton, (!bank || !reference || phone.length < 12) && styles.disabledButton]}
              onPress={handlePayment}
              disabled={!bank || !reference || phone.length < 12}
            >
              <Text style={styles.confirmButtonText}>Confirmar Pago</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Métodos de Pago</Text>
        
        <View style={styles.paymentMethods}>
          <TouchableOpacity 
            style={[styles.methodCard, selectedMethod === 'mobile' && styles.selectedMethod]}
            onPress={() => {
              setSelectedMethod('mobile');
              setShowMobilePaymentModal(true);
            }}
          >
            <View style={styles.methodIcon}>
              <Ionicons name="phone-portrait" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>Pago Móvil</Text>
              <Text style={styles.methodDescription}>Paga con tu banca móvil preferida</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.methodCard, selectedMethod === 'transfer' && styles.selectedMethod]}
            onPress={() => setSelectedMethod('transfer')}
          >
            <View style={styles.methodIcon}>
              <Ionicons name="swap-horizontal" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>Transferencia Bancaria</Text>
              <Text style={styles.methodDescription}>Realiza una transferencia desde tu banco</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.methodCard, selectedMethod === 'cash' && styles.selectedMethod]}
            onPress={() => setSelectedMethod('cash')}
          >
            <View style={styles.methodIcon}>
              <Ionicons name="cash" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>Efectivo</Text>
              <Text style={styles.methodDescription}>Paga al momento de la entrega</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Resumen del Pedido</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Envío</Text>
            <Text style={styles.summaryValue}>$0.00</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.payButton, !selectedMethod && styles.disabledButton]}
          disabled={!selectedMethod}
          onPress={() => {
            if (selectedMethod === 'mobile') {
              setShowMobilePaymentModal(true);
            } else {
              handlePayment();
            }
          }}
        >
          <Text style={styles.payButtonText}>
            {selectedMethod === 'mobile' ? 'Continuar con Pago Móvil' : 'Realizar Pago'}
          </Text>
        </TouchableOpacity>
      </View>

      {renderMobilePaymentModal()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    ...theme.typography.h4,
    marginBottom: 24,
    color: COLORS.text,
  },
  paymentMethods: {
    marginBottom: 24,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...theme.shadow.sm,
  },
  selectedMethod: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    ...theme.typography.subtitle,
    color: COLORS.text,
    marginBottom: 4,
  },
  methodDescription: {
    ...theme.typography.caption,
    color: COLORS.textSecondary,
  },
  summary: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    ...theme.shadow.sm,
  },
  summaryTitle: {
    ...theme.typography.subtitle,
    marginBottom: 16,
    color: COLORS.text,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    ...theme.typography.body,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    ...theme.typography.body,
    color: COLORS.text,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    ...theme.typography.subtitle,
    color: COLORS.text,
  },
  totalAmount: {
    ...theme.typography.h5,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  payButtonText: {
    ...theme.typography.button,
    color: COLORS.white,
  },
  disabledButton: {
    backgroundColor: COLORS.disabled,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    ...theme.typography.h5,
    color: COLORS.text,
  },
  modalBody: {
    padding: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: COLORS.lightGray,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    ...theme.typography.button,
    color: COLORS.text,
  },
  confirmButtonText: {
    ...theme.typography.button,
    color: COLORS.white,
  },
  // Form styles
  formGroup: {
    marginBottom: 16,
  },
  label: {
    ...theme.typography.caption,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    padding: 12,
    ...theme.typography.body,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bankSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bankSelectedText: {
    ...theme.typography.body,
    color: COLORS.text,
  },
  placeholderText: {
    ...theme.typography.body,
    color: COLORS.placeholder,
  },
  bankList: {
    maxHeight: 200,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginTop: 8,
    ...theme.shadow.sm,
  },
  bankScrollView: {
    maxHeight: 196,
  },
  bankItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  bankName: {
    ...theme.typography.body,
    color: COLORS.text,
  },
  bankCode: {
    ...theme.typography.caption,
    color: COLORS.textSecondary,
  },
  instructions: {
    ...theme.typography.body,
    color: COLORS.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default PaymentScreen;
