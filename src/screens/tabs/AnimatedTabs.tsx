import {SharedStateProvider} from './SharedContext';
import UserBottomTab from './UserBottomTab';

const AnimatedTabs: React.FC = () => (
  <SharedStateProvider>
    <UserBottomTab />
  </SharedStateProvider>
);

export default AnimatedTabs;
