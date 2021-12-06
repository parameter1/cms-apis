import { trim } from '@cms-apis/utils';

export default {
  /**
   *
   */
  User: {
    accountNonExpired() {
      return true;
    },
    accountNonLocked() {
      return true;
    },
    credentialsNonExpired() {
      return true;
    },
    password(user) {
      const password = trim(user.password);
      return password == null ? null : '__REDACTED__';
    },
  },
};
