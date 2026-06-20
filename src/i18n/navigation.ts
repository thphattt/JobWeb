import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Bộ điều hướng nhận biết ngôn ngữ (Link, useRouter, usePathname...)
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
