import { useQuery } from '@tanstack/react-query';
import { trainerClients, trainerToday, trainerWeek } from '../../mocks/data';

/** Trainer data hooks. MOCK — swap the queryFns for Orval calls when the API exists. */

const LATENCY_MS = 300;
const mock = <T>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), LATENCY_MS));

export function useTrainerToday() {
  return useQuery({ queryKey: ['trainer', 'today'], queryFn: () => mock(trainerToday) });
}

export function useTrainerClients() {
  return useQuery({ queryKey: ['trainer', 'clients'], queryFn: () => mock(trainerClients) });
}

export function useTrainerWeek() {
  return useQuery({ queryKey: ['trainer', 'week'], queryFn: () => mock(trainerWeek) });
}
