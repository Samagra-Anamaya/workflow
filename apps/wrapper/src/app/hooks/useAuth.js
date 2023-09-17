import { useSelector } from 'react-redux';

export function useUserData() {
  return useSelector((state) => state.auth);
}