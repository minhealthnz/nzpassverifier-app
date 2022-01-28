import { Animated } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

/**
 * A TouchableWithoutFeedback that handles animated styles
 */
export const AnimatedTouchableWithoutFeedback = Animated.createAnimatedComponent(TouchableWithoutFeedback);
