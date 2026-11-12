import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppText, Avatar, EmptyState, Icon, Input, ListRow, Screen, StatusPill, type PillTone } from '../../components/ui';
import { useTrainerClients } from '../../features/trainer/queries';
import { formatRelativeDay } from '../../lib/format';
import { colors } from '../../theme/tokens';

function sessionsTone(left: number): PillTone {
  if (left === 0) return 'danger';
  if (left <= 2) return 'warning';
  return 'neutral';
}

/** Trainer · My members */
export default function Clients() {
  const clients = useTrainerClients();
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const list = (clients.data ?? []).filter(
    (c) => !q || c.name.toLowerCase().includes(q) || c.goal.toLowerCase().includes(q) || c.plan.toLowerCase().includes(q),
  );

  return (
    <Screen scroll edges={['top']}>
      <View>
        <AppText variant="title">My members</AppText>
        {clients.data ? (
          <AppText variant="caption" color={colors.muted}>
            {clients.data.length} assigned to you
          </AppText>
        ) : null}
      </View>

      <Input
        label="Search"
        placeholder="Name, goal or plan"
        value={query}
        onChangeText={setQuery}
        left={<Icon name="search" size={18} color={colors.muted} />}
        autoCorrect={false}
        returnKeyType="search"
      />

      {clients.isPending ? (
        <ActivityIndicator color={colors.accent} accessibilityLabel="Loading members" />
      ) : list.length === 0 ? (
        <EmptyState
          icon={q ? 'search' : 'users'}
          title={q ? 'No matches' : 'No members assigned'}
          body={q ? `Nobody matches “${query.trim()}”.` : 'Members your gym assigns to you will be listed here.'}
        />
      ) : (
        <View style={styles.list}>
          {list.map((c) => (
            <ListRow
              key={c.id}
              title={c.name}
              subtitle={`${c.goal} · ${c.plan}\nLast visit ${formatRelativeDay(c.lastVisit).toLowerCase()}`}
              left={<Avatar name={c.name} size={40} />}
              right={<StatusPill label={c.sessionsLeft === 0 ? 'No sessions' : `${c.sessionsLeft} left`} tone={sessionsTone(c.sessionsLeft)} />}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
});
