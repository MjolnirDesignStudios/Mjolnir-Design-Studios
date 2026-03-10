// types/modules.d.ts
// Third-party packages that need module declaration assistance

// react-icons ships types only for some sub-paths — wildcard covers everything
declare module 'react-icons/io5' {
  import { FC, SVGProps } from 'react';
  type IconType = FC<SVGProps<SVGSVGElement> & { size?: number | string }>;
  export const IoChevronDown: IconType;
  export const IoChevronUp: IconType;
  export const IoClose: IconType;
  export const IoMenuOutline: IconType;
  export const IoCheckmark: IconType;
  export const IoInformation: IconType;
  export const IoWarning: IconType;
  // Named re-export of any other icon
  const _: IconType;
  export default _;
}
declare module 'react-icons/fa' {
  import { FC, SVGProps } from 'react';
  type IconType = FC<SVGProps<SVGSVGElement> & { size?: number | string }>;
  const _: IconType;
  export default _;
}
declare module 'react-icons/hi' {
  import { FC, SVGProps } from 'react';
  type IconType = FC<SVGProps<SVGSVGElement> & { size?: number | string }>;
  const _: IconType;
  export default _;
}

// @tabler/icons-react — ships types but CJS path misses them
declare module '@tabler/icons-react' {
  import { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';
  export type IconProps = SVGProps<SVGSVGElement> & {
    size?: number | string;
    stroke?: number | string;
    color?: string;
  };
  export type TablerIcon = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
  // All icon exports from this package
  export const IconHome: TablerIcon;
  export const IconSettings: TablerIcon;
  export const IconUser: TablerIcon;
  export const IconBolt: TablerIcon;
  export const IconCode: TablerIcon;
  export const IconBrandGithub: TablerIcon;
  export const IconBrandTwitter: TablerIcon;
  export const IconPlayerPlay: TablerIcon;
  export const IconPlayerPause: TablerIcon;
  export const IconMenu2: TablerIcon;
  export const IconX: TablerIcon;
  export const IconChevronDown: TablerIcon;
  export const IconChevronUp: TablerIcon;
  export const IconChevronRight: TablerIcon;
  export const IconSparkles: TablerIcon;
  export const IconRocket: TablerIcon;
  export const IconShield: TablerIcon;
  export const IconStar: TablerIcon;
  export const IconMail: TablerIcon;
  export const IconPhone: TablerIcon;
  export const IconMapPin: TablerIcon;
  export const IconArrowRight: TablerIcon;
  export const IconArrowLeft: TablerIcon;
  export const IconCheck: TablerIcon;
  export const IconAlertCircle: TablerIcon;
  export const IconInfoCircle: TablerIcon;
  export const IconLoader2: TablerIcon;
  export const IconMaximize: TablerIcon;
  export const IconMinimize: TablerIcon;
  export const IconRefresh: TablerIcon;
  export const IconTrash: TablerIcon;
  export const IconEdit: TablerIcon;
  export const IconCopy: TablerIcon;
  export const IconDownload: TablerIcon;
  export const IconUpload: TablerIcon;
  export const IconSearch: TablerIcon;
  export const IconFilter: TablerIcon;
  export const IconSortAscending: TablerIcon;
  export const IconSortDescending: TablerIcon;
  export const IconPlus: TablerIcon;
  export const IconMinus: TablerIcon;
  export const IconEye: TablerIcon;
  export const IconEyeOff: TablerIcon;
  export const IconLock: TablerIcon;
  export const IconUnlock: TablerIcon;
  export const IconKey: TablerIcon;
  export const IconDatabase: TablerIcon;
  export const IconServer: TablerIcon;
  export const IconCloud: TablerIcon;
  export const IconCpu: TablerIcon;
  export const IconActivity: TablerIcon;
  export const IconCurrencyDollar: TablerIcon;
  export const IconCurrencyBitcoin: TablerIcon;
  export const IconCreditCard: TablerIcon;
  export const IconReceipt: TablerIcon;
  export const IconBriefcase: TablerIcon;
  export const IconChartBar: TablerIcon;
  export const IconChartLine: TablerIcon;
  export const IconChartPie: TablerIcon;
  export const IconLayoutDashboard: TablerIcon;
  export const IconLayoutGrid: TablerIcon;
  export const IconLayoutList: TablerIcon;
  export const IconPalette: TablerIcon;
  export const IconBrush: TablerIcon;
  export const IconPhoto: TablerIcon;
  export const IconVideo: TablerIcon;
  export const IconMicrophone: TablerIcon;
  export const IconHeadphones: TablerIcon;
  export const IconWand: TablerIcon;
  export const IconBrain: TablerIcon;
  export const IconRobot: TablerIcon;
  export const IconMessage: TablerIcon;
  export const IconMessages: TablerIcon;
  export const IconSend: TablerIcon;
  export const IconBell: TablerIcon;
  export const IconCalendar: TablerIcon;
  export const IconClock: TablerIcon;
  export const IconLink: TablerIcon;
  export const IconExternalLink: TablerIcon;
  export const IconGlobe: TablerIcon;
  export const IconWorld: TablerIcon;
  export const IconFlame: TablerIcon;
  export const IconZap: TablerIcon;
  export const IconAtom: TablerIcon;
  export const IconDiamond: TablerIcon;
  export const IconCrown: TablerIcon;
  export const IconTrophy: TablerIcon;
  export const IconMedal: TablerIcon;
  export const IconFlag: TablerIcon;
  export const IconBookmark: TablerIcon;
  export const IconTag: TablerIcon;
  export const IconHash: TablerIcon;
  export const IconAt: TablerIcon;
  export const IconDots: TablerIcon;
  export const IconDotsVertical: TablerIcon;
}
