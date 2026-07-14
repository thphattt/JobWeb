import * as migration_20260712_113639_initial from './20260712_113639_initial';
import * as migration_20260714_053351_initial from './20260714_053351_initial';

export const migrations = [
  {
    up: migration_20260712_113639_initial.up,
    down: migration_20260712_113639_initial.down,
    name: '20260712_113639_initial',
  },
  {
    up: migration_20260714_053351_initial.up,
    down: migration_20260714_053351_initial.down,
    name: '20260714_053351_initial'
  },
];
