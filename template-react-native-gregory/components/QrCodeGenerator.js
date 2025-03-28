import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const TableQRCode = () => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <QRCode value="1" size={200} />
    </View>
  );
};

export default TableQRCode;
