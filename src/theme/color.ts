export const color = {
  primary: '#835EEB',
  subPrimary: '#C0AEF5',
  variant: '#E0DDF5',
  red: '#F22735',
  green: '#1FCCA1',
  yellow: '#FFC107',
  navy: '#344252',
  dark: '#222222',
  subDark: '#444444',
  gray: '#9AA7B8',
  lightGray: '#E9EEF4',
  lightLightGray: '#F9FBFC',
  white: '#FFFFFF',
};

export type Theme = {
  background: string;
  text: string;
  box: string;
  subText: string;
  box2: string;
  modal: string;
};

export const light = {
  background: color.white,
  text: color.dark,
  box: color.lightGray,
  subText: color.navy,
  box2: color.lightLightGray,
  modal: color.white,
};

export const dark = {
  background: color.dark,
  text: color.white,
  box: color.subDark,
  subText: color.white,
  box2: color.subDark,
  modal: '#333333',
};
