import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, TextInput, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

// --- INTERFACES ---
interface PledgeItem {
  qty: string;
  name: string;
}

export default function PledgeScreen() {
  const router = useRouter();
  
  // --- FORM STATES ---
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState<boolean>(false);
  const [selectedSite, setSelectedSite] = useState<string>('Select Site Location');

  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<string>('Select Time Slot');

  const [items, setItems] = useState<PledgeItem[]>([
    { qty: '', name: '' },
    { qty: '', name: '' },
    { qty: '', name: '' },
  ]);

  // --- VALIDATION & MODAL STATES ---
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false); // Modal 1: Confirm Pledge
  const [showVolunteerModal, setShowVolunteerModal] = useState<boolean>(false); // Modal 2: Volunteer Prompt
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  // --- DATA ARRAYS ---
  const ustBuildings: string[] = [
    "UST Main Building", "UST Hospital", "Roque Ruaño Building", 
    "St. Martin de Porres Building", "St. Pier Giorgio Frassati, O.P. Building",
    "Albertus Magnus Building", "Benavides Building", "St. Raymund de Peñafort Building"
  ];

  const timeSlots: string[] = [
    "Morning (8:00 AM - 12:00 PM)", "Afternoon (1:00 PM - 5:00 PM)", "Evening (5:00 PM - 8:00 PM)"
  ];

  // --- HANDLERS ---
  const addItem = () => setItems([...items, { qty: '', name: '' }]);
  const removeItem = (indexToRemove: number) => setItems(items.filter((_, index) => index !== indexToRemove));
  const updateItem = (index: number, field: keyof PledgeItem, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // --- VALIDATION LOGIC ---
  const isSiteValid = selectedSite !== 'Select Site Location';
  const isTimeValid = selectedTime !== 'Select Time Slot';
  const validItems = items.filter(item => item.qty.trim() !== '' && item.name.trim() !== '');
  const isItemsValid = validItems.length > 0;

  // Step 1: Submit the initial form
  const handleInitialSubmit = () => {
    if (isSiteValid && isTimeValid && isItemsValid) {
      setIsConfirmed(false);
      setShowModal(true); // Open confirmation modal
      setShowErrors(false);
    } else {
      setShowErrors(true);
    }
  };

  // Step 2: Confirm the details
  const handleFinalConfirm = () => {
    if (isConfirmed) {
      setShowModal(false); // Close confirmation modal
      setShowVolunteerModal(true); // Open the "Do you want to volunteer?" modal
    }
  };

  // Step 3: Handle the Volunteer Choice
  const handleVolunteerChoice = (choice: 'yes' | 'no') => {
    setShowVolunteerModal(false);
    if (choice === 'yes') {
      router.push('/volunteer' as any); // Go to volunteer page
    } else {
      router.push('/' as any); // Go back home
    }
  };

  return (
    <View style={styles.container}>
      
      {/* ========================================================= */}
      {/* MODAL 1: PLEDGE CONFIRMATION                              */}
      {/* ========================================================= */}
      {showModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Your Pledge</Text>
            
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Location:</Text>
              <Text style={styles.summaryValue}>{selectedSite}</Text>

              <Text style={styles.summaryLabel}>Time Slot:</Text>
              <Text style={styles.summaryValue}>{selectedTime}</Text>

              <Text style={styles.summaryLabel}>Items to Donate:</Text>
              {validItems.map((item, idx) => (
                <Text key={idx} style={styles.summaryValue}>• {item.qty} x {item.name}</Text>
              ))}
            </View>

            <Pressable style={styles.checkboxRowModal} onPress={() => setIsConfirmed(!isConfirmed)}>
              <View style={[styles.checkbox, isConfirmed && styles.checkboxChecked]}>
                {isConfirmed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>I confirm that all details provided are correct.</Text>
            </Pressable>

            <View style={styles.modalActions}>
              <Pressable style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.8 }]} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelBtnText}>Back</Text>
              </Pressable>
              <Pressable 
                style={({ pressed }) => [styles.confirmBtn, !isConfirmed && styles.confirmBtnDisabled, pressed && isConfirmed && { transform: [{ scale: 0.98 }] }]} 
                onPress={handleFinalConfirm}
                disabled={!isConfirmed}
              >
                <Text style={styles.confirmBtnText}>Confirm Donation</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: VOLUNTEER PROMPT (UPDATED WITH CHECKMARK)        */}
      {/* ========================================================= */}
      {showVolunteerModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { alignItems: 'center', padding: 30 }]}>
            
            {/* NEW STYLED CHECKMARK ICON */}
            <View style={styles.checkmarkIconCircle}>
              <Text style={styles.checkmarkIconText}>✓</Text>
            </View>

            <Text style={styles.modalTitle}>Pledge Confirmed!</Text>
            
            <Text style={{ textAlign: 'center', fontSize: 16, color: '#444', marginBottom: 30, lineHeight: 22 }}>
              Thank you for your generous donation. Would you also like to volunteer your time to help with the relief efforts?
            </Text>

            <View style={{ flexDirection: 'row', gap: 15, width: '100%' }}>
              <Pressable 
                style={({ pressed }) => [styles.cancelBtn, { flex: 1 }, pressed && { opacity: 0.8 }]} 
                onPress={() => handleVolunteerChoice('no')}
              >
                <Text style={styles.cancelBtnText}>No</Text>
              </Pressable>
              <Pressable 
                style={({ pressed }) => [styles.confirmBtn, { flex: 1.5, backgroundColor: '#4273B8' }, pressed && { transform: [{ scale: 0.98 }] }]} 
                onPress={() => handleVolunteerChoice('yes')}
              >
                <Text style={styles.confirmBtnText}>Yes, view roles</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* NAVIGATION BAR */}
      <View style={styles.navBar}>
        <View style={styles.navLeft}>
          <Pressable onPress={() => router.push('/' as any)} style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
            <Image source={require('../assets/logo_b.png')} style={styles.logoImage} resizeMode="contain" />
          </Pressable>
        </View>

        <View style={styles.navRight}>
          <Pressable style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.7 }]}>
            <Image source={require('../assets/icon-bell.png')} style={styles.navIcon} resizeMode="contain" />
          </Pressable>
          <Pressable style={({ pressed }) => [styles.userProfile, pressed && { opacity: 0.7 }]}>
            <Image source={require('../assets/icon-user.png')} style={styles.navIcon} resizeMode="contain" />
          </Pressable>
        </View>
      </View>

      {/* PAGE BODY */}
      <View style={styles.pageBody}>
        <Image source={require('../assets/hero-bg.png')} style={styles.bgImage} resizeMode="cover" />
        <View style={styles.bgOverlay} />

        <View style={styles.contentWrapper}>
          
          <View style={styles.headerBannerGreen}>
            <Text style={styles.bannerText}>Pledge Donation</Text>
          </View>

          {/* MASTER SCROLLVIEW */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            
            {/* 1. LOCATION & TIME */}
            <View style={styles.section}>
              <Text style={styles.fieldLabel}>Select Site Location</Text>
              <Pressable 
                style={({pressed}) => [styles.pickerBox, showErrors && !isSiteValid && styles.errorBorder, pressed && { opacity: 0.8 }]} 
                onPress={() => { setIsSiteDropdownOpen(!isSiteDropdownOpen); setIsTimeDropdownOpen(false); }}
              >
                <Text style={[styles.pickerText, !isSiteValid && {color: '#888'}]}>"{selectedSite}"</Text>
                <Text style={styles.pickerArrow}>∨</Text>
              </Pressable>
              {showErrors && !isSiteValid && <Text style={styles.errorText}>● Site Location is required.</Text>}

              {isSiteDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {ustBuildings.map((building, index) => (
                    <Pressable key={index} style={styles.dropdownItem} onPress={() => { setSelectedSite(building); setIsSiteDropdownOpen(false); }}>
                      <Text style={styles.dropdownItemText}>{building}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              <Text style={[styles.fieldLabel, { marginTop: 20 }]}>Select Time Slot</Text>
              <Pressable 
                style={({pressed}) => [styles.pickerBox, showErrors && !isTimeValid && styles.errorBorder, pressed && { opacity: 0.8 }]} 
                onPress={() => { setIsTimeDropdownOpen(!isTimeDropdownOpen); setIsSiteDropdownOpen(false); }}
              >
                <Text style={[styles.pickerText, !isTimeValid && {color: '#888'}]}>"{selectedTime}"</Text>
                <Text style={styles.pickerArrow}>∨</Text>
              </Pressable>
              {showErrors && !isTimeValid && <Text style={styles.errorText}>● Time Slot is required.</Text>}

              {isTimeDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {timeSlots.map((time, index) => (
                    <Pressable key={index} style={styles.dropdownItem} onPress={() => { setSelectedTime(time); setIsTimeDropdownOpen(false); }}>
                      <Text style={styles.dropdownItemText}>{time}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* 2. ITEMS TO DONATE */}
            <View style={styles.section}>
              <Text style={styles.fieldLabel}>Input Donation Item Details</Text>
              <View style={styles.itemHeaders}>
                <Text style={styles.qtyHeader}>Qty.</Text>
                <Text style={styles.nameHeader}>Item Name</Text>
                <View style={{ width: 35 }} />
              </View>

              <View style={styles.itemsOuterFrame}>
                {items.map((item, index) => {
                  const showInputError = showErrors && !isItemsValid && item.qty === '' && item.name === '';
                  return (
                    <View key={index} style={styles.itemRow}>
                      <TextInput 
                        style={[styles.qtyBox, showInputError && styles.errorBorder]} 
                        value={item.qty} onChangeText={(text) => updateItem(index, 'qty', text)}
                        placeholder="No." keyboardType="numeric"
                      />
                      <TextInput 
                        style={[styles.nameBox, showInputError && styles.errorBorder]} 
                        value={item.name} onChangeText={(text) => updateItem(index, 'name', text)}
                        placeholder="Item Name"
                      />
                      <Pressable style={({pressed}) => [styles.removeBtn, pressed && { transform: [{ scale: 0.9 }] }]} onPress={() => removeItem(index)}>
                        <Text style={styles.removeBtnText}>✕</Text>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
              {showErrors && !isItemsValid && <Text style={styles.errorText}>● At least one valid item is required.</Text>}
              
              <Pressable style={({pressed}) => [styles.addItemBtn, pressed && { opacity: 0.8 }]} onPress={addItem}>
                <Text style={styles.addItemBtnText}>+ ADD ITEM</Text>
              </Pressable>
            </View>

            {/* SUBMIT BUTTON */}
            {showErrors && (!isSiteValid || !isTimeValid || !isItemsValid) && (
              <Text style={[styles.errorText, { textAlign: 'center', marginBottom: 10 }]}>
                ● Please address all required fields highlighted above.
              </Text>
            )}
            <Pressable 
              style={({ pressed }) => [styles.submitPledgeBtn, pressed && { transform: [{scale: 0.98}], opacity: 0.9 }]} 
              onPress={handleInitialSubmit}
            >
              <Text style={styles.submitBtnText}>Submit Pledge Donation</Text>
            </Pressable>

          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  
  // NAVBAR
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 90, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingTop: 35 },
  navLeft: { flexDirection: 'row', alignItems: 'center' },
  logoImage: { width: 45, height: 45 },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconButton: { padding: 5 },
  navIcon: { width: 28, height: 28, opacity: 0.7 },
  userProfile: { flexDirection: 'row', alignItems: 'center' },

  // BODY
  pageBody: { flex: 1, minHeight: height - 90, position: 'relative', alignItems: 'center', paddingVertical: 20 },
  bgImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  bgOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0F172A', opacity: 0.75 },
  contentWrapper: { width: '95%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, flex: 1, elevation: 10 },
  headerBannerGreen: { backgroundColor: '#2D8A61', borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginBottom: 20 },
  bannerText: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },

  // FORMS
  section: { marginBottom: 30 },
  fieldLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#111' },
  errorBorder: { borderColor: '#E53E3E', borderWidth: 1, backgroundColor: '#FFF5F5' },
  errorText: { color: '#E53E3E', fontSize: 12, marginTop: 4, fontWeight: 'bold' },
  
  pickerBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E5E7EB', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#CCCCCC' },
  pickerText: { fontSize: 14, color: '#111' },
  pickerArrow: { fontSize: 14, fontWeight: 'bold', color: '#555' },
  dropdownMenu: { backgroundColor: '#FFF', borderRadius: 10, borderWidth: 1, borderColor: '#CCC', marginTop: 5 },
  dropdownItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  dropdownItemText: { fontSize: 14, color: '#333' },

  // ITEMS
  itemHeaders: { flexDirection: 'row', gap: 10, marginBottom: 5, paddingHorizontal: 5 },
  qtyHeader: { width: 60, textAlign: 'center', fontSize: 13, fontWeight: 'bold', color: '#555' },
  nameHeader: { flex: 1, fontSize: 13, fontWeight: 'bold', color: '#555' },
  itemsOuterFrame: { borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 10, padding: 15, backgroundColor: '#FAFAFA' },
  itemRow: { flexDirection: 'row', gap: 10, marginBottom: 12, alignItems: 'center' },
  qtyBox: { width: 60, backgroundColor: '#E5E7EB', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#CCCCCC', textAlign: 'center' },
  nameBox: { flex: 1, backgroundColor: '#E5E7EB', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#CCCCCC' },
  removeBtn: { width: 40, height: 40, backgroundColor: '#FFEDED', borderRadius: 8, borderWidth: 1, borderColor: '#FFB3B3', alignItems: 'center', justifyContent: 'center' },
  removeBtnText: { color: '#CC0000', fontSize: 18, fontWeight: 'bold' },
  addItemBtn: { alignSelf: 'flex-start', marginTop: 10, backgroundColor: '#E5E7EB', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#CCCCCC' },
  addItemBtnText: { fontSize: 12, fontWeight: 'bold', color: '#333' },

  // SUBMIT
  submitPledgeBtn: { backgroundColor: '#2D8A61', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  submitBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },

  // MODALS
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 25, width: '90%', elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#111', marginBottom: 20, textAlign: 'center' },
  summaryBox: { backgroundColor: '#F7F7F7', borderRadius: 12, padding: 15, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  summaryLabel: { fontSize: 12, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', marginTop: 10, marginBottom: 4 },
  summaryValue: { fontSize: 15, color: '#0F172A', fontWeight: '500' },
  
  checkboxRowModal: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  checkbox: { width: 24, height: 24, borderWidth: 2, borderColor: '#2D8A61', borderRadius: 6, marginRight: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  checkboxChecked: { backgroundColor: '#2D8A61' },
  checkmark: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  checkboxText: { flex: 1, fontSize: 14, color: '#334155', lineHeight: 20 },
  
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#E2E8F0', alignItems: 'center' },
  cancelBtnText: { color: '#475569', fontSize: 16, fontWeight: 'bold' },
  confirmBtn: { flex: 2, paddingVertical: 14, borderRadius: 12, backgroundColor: '#2D8A61', alignItems: 'center' },
  confirmBtnDisabled: { backgroundColor: '#94A3B8' },
  confirmBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

  // NEW STYLED CHECKMARK ICON
  checkmarkIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDF4',
    borderWidth: 3,
    borderColor: '#2D8A61',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  checkmarkIconText: {
    color: '#2D8A61',
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: -3,
  },
});