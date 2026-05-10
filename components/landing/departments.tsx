'use client';

import {
  Cpu,
  Drill,
  Factory,
  Flame,
  HeartPulse,
  Landmark,
  Map,
  MonitorCog,
  RadioTower,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

import { BrandIcon } from '@/components/brand/brand-assets';
import { Reveal, StaggerGroup, StaggerItem } from './motion-primitives';

type DepartmentCard = {
  name: string;
  Icon: LucideIcon;
  accent: string;
};

const DEPARTMENT_CARDS: DepartmentCard[] = [
  { name: 'Civil Engineering', Icon: Landmark, accent: 'var(--brand-purple)' },
  { name: 'Mechanical Engineering', Icon: Wrench, accent: 'var(--brand-orange-warm)' },
  { name: 'Metallurgical & Materials Engineering', Icon: Factory, accent: 'var(--brand-pink)' },
  { name: 'Chemical Engineering', Icon: Flame, accent: 'var(--brand-cyan)' },
  { name: 'Petroleum & Gas Engineering', Icon: Drill, accent: 'var(--brand-orange)' },
  { name: 'Biomedical Engineering', Icon: HeartPulse, accent: 'var(--brand-pink)' },
  { name: 'Computer Engineering', Icon: Cpu, accent: 'var(--brand-purple)' },
  { name: 'Electrical & Electronics Engineering', Icon: RadioTower, accent: 'var(--brand-cyan)' },
  { name: 'Systems Engineering', Icon: MonitorCog, accent: 'var(--brand-plum)' },
  { name: 'Surveying & Geoinformatics', Icon: Map, accent: 'var(--brand-orange-warm)' },
];

const BRAND_ICON_CYCLE = ['gear', 'nut', 'chip', 'bulb'] as const;

export function Departments() {
  return (
    <section id="departments" className="px-6 pb-24 pt-10 sm:pb-32 sm:pt-12">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="max-w-3xl text-balance font-heading text-4xl font-semibold tracking-[-0.07em] text-foreground sm:text-5xl">
            10 Departments. One Competition.
          </h2>
        </Reveal>

        <StaggerGroup as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {DEPARTMENT_CARDS.map((dept, index) => (
            <StaggerItem
              key={dept.name}
              as="li"
              className="brand-panel motion-surface motion-surface-hover relative overflow-hidden rounded-[1.6rem] p-5"
            >
              <BrandIcon
                name={BRAND_ICON_CYCLE[index % BRAND_ICON_CYCLE.length]}
                width={54}
                height={54}
                sizes="54px"
                className="absolute -right-3 -top-3 opacity-[0.08]"
              />
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: dept.accent, color: dept.accent === 'var(--brand-cyan)' ? 'var(--brand-plum)' : 'white' }}
              >
                <dept.Icon className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold leading-6 text-foreground">
                {dept.name}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
