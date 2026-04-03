export const colors = {
  primary: '#2D7D4F',
  primaryLight: '#A8D5B8',
  danger: '#ff3b30',
  success: '#34c759',
  divider: '#e0e0e0',
  disabled: '#ccc',
  secondaryText: '#888',
  tertiaryText: '#aaa',
  white: '#fff',
  background: '#fff',
} as const;

export const switchColors = {
  trackColor: { false: colors.disabled, true: colors.primaryLight },
  thumbColor: colors.primary,
} as const;
