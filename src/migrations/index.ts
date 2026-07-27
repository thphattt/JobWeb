import * as migration_20260712_113639_initial from './20260712_113639_initial';
import * as migration_20260714_053351_initial from './20260714_053351_initial';
import * as migration_20260725_122305_page_text from './20260725_122305_page_text';
import * as migration_20260727_100435_gallery_images from './20260727_100435_gallery_images';
import * as migration_20260727_151101_project_detail from './20260727_151101_project_detail';

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
    name: '20260725_122305_page_text',
  },
  {
    up: migration_20260727_100435_gallery_images.up,
    down: migration_20260727_100435_gallery_images.down,
    name: '20260727_100435_gallery_images',
  },
  {
    up: migration_20260727_151101_project_detail.up,
    down: migration_20260727_151101_project_detail.down,
    name: '20260727_151101_project_detail'
  },
];
