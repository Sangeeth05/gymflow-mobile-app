import { queryClient } from '../../api/queryClient';
import { useNotifications } from '../notifications/store';
import { useMemberStore } from './memberStore';

/** Clears everything cached for the signed-in member (log out, delete account, gallery reset). */
export function resetMemberState() {
  useMemberStore.getState().reset();
  useNotifications.getState().reset();
  queryClient.clear();
}
