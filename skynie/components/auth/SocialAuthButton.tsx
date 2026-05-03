import React from 'react';
import { StyleSheet } from 'react-native';

import CustomButton from '@/components/common/CustomButton';

type Props = {
  brand: 'google' | 'facebook';
  title: string;
  onPress?: () => void;
};

export default function SocialAuthButton({ brand, title, onPress }: Props) {
  const icon =
    brand === 'google'
      ? require('@/assets/images/Google.svg')
      : require('@/assets/images/facebook.svg');

  return (
    <CustomButton
      title={title}
      onPress={onPress ?? (() => {})}
      icon={icon}
      variant="outline"
      style={styles.button}
      textStyle={styles.text}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B9B9B9',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
