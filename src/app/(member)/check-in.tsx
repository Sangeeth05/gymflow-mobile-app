import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import * as Brightness from 'expo-brightness';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { AppText, Button, Card, Icon, Screen, ScreenHeader, Segmented } from '../../components/ui';
import { useActiveMember } from '../../features/member/memberStore';
import { summarizeMembership } from '../../features/member/membership';
import { useMembership } from '../../features/member/queries';
import { colors, fonts, radius } from '../../theme/tokens';

type Mode = 'show' | 'scan';

const ROTATE_MS = 30_000;

/** 4.1 · Check in — show a rotating code, or scan the gym's code. */
export default function CheckIn() {
  const member = useActiveMember();
  const membership = useMembership(member.id);
  const [mode, setMode] = useState<Mode>('show');
  const ended = membership.data ? summarizeMembership(membership.data).ended : false;

  // Mock: the real API decides; here an ended plan is rejected at the desk.
  function complete() {
    router.replace({ pathname: '/checked-in', params: { result: ended || !membership.data ? 'expired' : 'success' } });
  }

  return (
    <Screen>
      <ScreenHeader title="Check in" variant="close" />
      <Segmented
        accessibilityLabel="Check-in method"
        options={[
          { value: 'show', label: 'Show my code' },
          { value: 'scan', label: 'Scan gym code' },
        ]}
        value={mode}
        onChange={setMode}
      />
      {mode === 'show' ? (
        <ShowCode memberName={member.name} memberCode={membership.data?.memberCode} onSimulate={complete} />
      ) : (
        <ScanCode onScanned={complete} />
      )}
    </Screen>
  );
}

function ShowCode({ memberName, memberCode, onSimulate }: { memberName: string; memberCode?: string; onSimulate: () => void }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Max brightness so scanners read the screen; restore whatever it was on the way out.
  useEffect(() => {
    let previous: number | null = null;
    let cancelled = false;
    (async () => {
      try {
        previous = await Brightness.getBrightnessAsync();
        if (!cancelled) await Brightness.setBrightnessAsync(1);
      } catch {
        // Not supported (e.g. web) — the code still works.
      }
    })();
    return () => {
      cancelled = true;
      if (previous !== null) Brightness.setBrightnessAsync(previous).catch(() => {});
    };
  }, []);

  const window = Math.floor(now / ROTATE_MS);
  const secondsLeft = Math.ceil((ROTATE_MS - (now % ROTATE_MS)) / 1000);
  const code = (memberCode ?? '').replace(' ', '');

  return (
    <View style={styles.showWrap}>
      <View style={styles.qrCard}>
        <Pressable
          accessibilityRole={__DEV__ ? 'button' : 'image'}
          accessibilityLabel="Your check-in code"
          accessibilityHint={__DEV__ ? 'Dev: simulates the front desk scanning this code' : undefined}
          onPress={__DEV__ ? onSimulate : undefined}
          style={styles.qr}
        >
          <QRCode value={`gymflow:checkin:${code}:${window}`} size={232} backgroundColor={colors.white} color={colors.onAccent} />
        </Pressable>
        <AppText style={styles.name}>{memberName}</AppText>
        <AppText variant="caption" color={colors.onAccent} accessibilityLiveRegion="none">
          New code in {secondsLeft}s
        </AppText>
      </View>
      <AppText color={colors.muted} align="center">
        Hold your phone up to the scanner at the front desk. Screen brightness is turned up while this is open.
      </AppText>
      {memberCode ? (
        <AppText variant="caption" color={colors.muted} align="center">
          Scanner not working? Member code {memberCode}
        </AppText>
      ) : null}
      {__DEV__ ? <Button label="Dev: simulate a scan" variant="text" onPress={onSimulate} /> : null}
    </View>
  );
}

function ScanCode({ onScanned }: { onScanned: () => void }) {
  const [permission, requestPermission] = useCameraPermissions();
  const handled = useRef(false);

  function onBarcode(_result: BarcodeScanningResult) {
    if (handled.current) return;
    handled.current = true;
    onScanned();
  }

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.showWrap}>
        <Card bordered style={styles.permission}>
          <View style={styles.permIcon}>
            <Icon name="camera" size={28} color={colors.accent} />
          </View>
          <AppText variant="headline" align="center">
            Allow camera to scan
          </AppText>
          <AppText color={colors.muted} align="center">
            Point your camera at the QR code on the front desk. We only use the camera while this screen is open.
          </AppText>
          {permission.canAskAgain ? (
            <Button label="Allow camera" onPress={requestPermission} />
          ) : (
            <Button label="Open settings" variant="secondary" onPress={() => Linking.openSettings()} />
          )}
        </Card>
        {__DEV__ ? <Button label="Dev: simulate a scan" variant="text" onPress={onScanned} /> : null}
      </View>
    );
  }

  return (
    <View style={styles.showWrap}>
      <View style={styles.cameraWrap}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={onBarcode}
          accessibilityLabel="Camera viewfinder"
        />
        <View style={styles.frame} pointerEvents="none" />
      </View>
      <AppText color={colors.muted} align="center">
        Scan the GymFlow code at the front desk.
      </AppText>
      {__DEV__ ? <Button label="Dev: simulate a scan" variant="text" onPress={onScanned} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  showWrap: { flex: 1, justifyContent: 'center', gap: 16 },
  qrCard: { backgroundColor: colors.accent, borderRadius: 26, padding: 20, alignItems: 'center', gap: 6 },
  qr: { backgroundColor: colors.white, padding: 16, borderRadius: 18, marginBottom: 8 },
  name: { fontFamily: fonts.displayBold, fontSize: 22, lineHeight: 28, color: colors.onAccent },
  permission: { alignItems: 'center' },
  permIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraWrap: { aspectRatio: 1, borderRadius: radius.card, overflow: 'hidden', backgroundColor: colors.surface },
  frame: {
    position: 'absolute',
    top: '18%',
    left: '18%',
    right: '18%',
    bottom: '18%',
    borderWidth: 3,
    borderColor: colors.accent,
    borderRadius: 24,
  },
});
