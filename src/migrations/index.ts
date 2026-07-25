import * as migration_20260712_113639_initial from './20260712_113639_initial';
import * as migration_20260714_053351_initial from './20260714_053351_initial';
import * as migration_20260725_122305_page_text from './20260725_122305_page_text';

export const migrations = [
  {
    up: migration_20260712_113639_initial.up,
    down: migration_20260712_113639_initial.down,
    name: '20260712_113639_initial',
  },
  {
    up: migration_20260714_053351_initial.up,
    down: migration_20260714_053351_initial.down,
    name: '20260714_053351_initial',
  },
  {
    up: migration_20260725_122305_page_text.up,
    down: migration_20260725_122305_page_text.down,
    name: '20260725_122305_page_text'
  },
];
