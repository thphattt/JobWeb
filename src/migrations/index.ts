import * as migration_20260712_113639_initial from './20260712_113639_initial';

export const migrations = [
  {
    up: migration_20260712_113639_initial.up,
    down: migration_20260712_113639_initial.down,
    name: '20260712_113639_initial'
  },
];
