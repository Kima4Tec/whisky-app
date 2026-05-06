import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export function Wave() {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: -1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, []);

  const rotate = anim.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-5deg", "5deg"],
  });

  return (
    <Animated.Text
      style={{
        fontSize: 20,
        transform: [{ rotate }],
      }}
    >
      🥃
    </Animated.Text>
  );
}
