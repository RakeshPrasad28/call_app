import Animated, { useSharedValue } from 'react-native-reanimated';
import { createContext, FC, ReactNode, useContext } from 'react';
import { BOTTOM_TAB_HEIGHT } from '../../utility/constants';
import { screenHeight } from '../../utility/Scaling';

interface SharedStateContextType {
  translationY: Animated.SharedValue<number>;
}


const SharedStateContext = createContext<SharedStateContextType | undefined>(
  undefined,
);

export const SharedStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const translationY = useSharedValue(0);

  return (
    <SharedStateContext.Provider value={{ translationY }}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => {
  const context = useContext(SharedStateContext);
  if (context === undefined) {
    throw new Error('useSharedState must be used within a SharedStateprovider');
  }
  return context;
};
