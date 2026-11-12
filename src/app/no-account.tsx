import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, EmptyState, Screen } from '../components/ui';
import { formatPhone } from '../lib/format';
import { colors } from '../theme/tokens';

/** 2.4 · No gym has added this number */
export default function NoAccount() {
  const { phone = '' } = useLocalSearchParams<{ phone?: string }>();

  return (
    <Screen>
      <EmptyState
        icon="users"
        title="No gym has added this number"
        body={`We couldn't find a membership for ${phone ? `+91 ${formatPhone(phone)}` : 'this number'}. GymFlow passes are set up by your gym.`}
      />
      <Card bordered>
        <AppText variant="headline">What to do</AppText>
        <View style={styles.steps}>
          <AppText color={colors.textSoft}>1. Ask the front desk to add this number to your membership.</AppText>
          <AppText color={colors.textSoft}>2. If you gave them a different number, sign in with that one.</AppText>
        </View>
      </Card>
      <Button label="Try a different number" onPress={() => router.replace('/login')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  steps: { gap: 6 },
});
