import { Image } from "expo-image";
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

type Props = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  icon?: any; // image source (require or uri)
  variant?: "primary" | "outline";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const CustomButton: React.FC<Props> = ({
  title,
  onPress,
  icon,
  variant = "primary",
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "primary" ? styles.primary : styles.outline,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {icon && <Image source={icon} style={styles.icon} contentFit="contain" />}
        <Text
          style={[
            styles.text,
            variant === "primary" ? styles.primaryText : styles.outlineText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  primary: {
    backgroundColor: "#E50914", // 🔴 Netflix-style red
  },

  outline: {
    borderWidth: 1,
    borderColor: "#BFBFBF",
    backgroundColor: "transparent",
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  icon: {
    width: 18,
    height: 18,
  },

  text: {
    fontSize: 15,
    fontWeight: "600",
  },

  primaryText: {
    color: "#fff",
  },

  outlineText: {
    color: "#fff",
  },
});
