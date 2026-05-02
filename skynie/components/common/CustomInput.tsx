import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TextInputProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

interface CustomInputProps extends TextInputProps {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  containerStyle,
  inputStyle,
  labelStyle,
  secureTextEntry,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const isSecureField = Boolean(secureTextEntry);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, isSecureField && styles.inputWithIcon, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          secureTextEntry={isSecureField && !isPasswordVisible}
          {...rest} // allows type, value, onChangeText, etc.
        />

        {isSecureField && (
          <Pressable
            onPress={() => setIsPasswordVisible((value) => !value)}
            style={styles.eyeButton}
            hitSlop={10}>
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#B8B8B8"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 6,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#2c2c2c",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "#fff",
    fontSize: 15,
    minHeight: 52,
  },
  inputWithIcon: {
    paddingRight: 48,
  },
  eyeButton: {
    position: "absolute",
    right: 14,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
});
