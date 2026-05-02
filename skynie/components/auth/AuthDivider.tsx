import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AuthDivider() {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.text}>Or</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#8A8A8A',
  },
  text: {
    color: '#F3F3F3',
    fontSize: 15,
    fontWeight: '500',
    marginHorizontal: 10,
  },
});
