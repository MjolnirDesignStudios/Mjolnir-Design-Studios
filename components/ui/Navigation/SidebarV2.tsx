"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX, IconChevronDown } from "@tabler/icons-react";
import { Hammer } from "lucide-react";

interface Links {
  label: string;
  href: string;
  icon: React.ReactElement;
  subItems?: string[];
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = ({
  className,
  children,
  ...motionProps
}: {
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof motion.div>, 'children' | 'className'>) => {
  return (
    <>
      <DesktopSidebar className={className} {...motionProps}>
        {children}
      </DesktopSidebar>
      <MobileSidebar className={className}>
        {children}
      </MobileSidebar>
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentProps<typeof motion.div>, 'children' | 'className'>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "px-4 py-4 hidden md:flex md:flex-col bg-black/95 backdrop-blur-2xl border-r border-white/10 w-[300px] shrink-0 fixed top-24 left-0 bottom-0",
          className
        )}
        animate={{
          width: animate ? (open ? "300px" : "80px") : "300px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {/* Hammer Icon Header */}
        <div className="flex items-center justify-center mb-6 pb-4 border-b border-white/10">
          <motion.div
            animate={{ rotate: open ? 0 : -90 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <Hammer className="w-10 h-10 text-gold drop-shadow-lg" />
          </motion.div>
        </div>

        {/* MjolnirUI Text Reveal */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center mb-8"
            >
              <span className="text-lg font-bold text-white whitespace-pre">
                MjolnirUI
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentProps<"div">, 'children' | 'className'>) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-black/95 backdrop-blur-2xl border-b border-white/10 w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-neutral-200"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-black/95 backdrop-blur-2xl p-10 z-[100] flex flex-col justify-between border-r border-white/10",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-neutral-200"
                onClick={() => setOpen(!open)}
              >
                <IconX />
              </div>

              {/* Mobile Hammer Header */}
              <div className="flex items-center justify-center mb-6 pb-4 border-b border-white/10">
                <Hammer className="w-12 h-12 text-gold drop-shadow-lg" />
              </div>

              {/* Mobile MjolnirUI Text */}
              <div className="flex items-center justify-center mb-8">
                <span className="text-xl font-bold text-white whitespace-pre">
                  MjolnirUI
                </span>
              </div>

              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <a
        href={link.href}
        className={cn(
          "flex items-center justify-start gap-2 group/sidebar py-2 cursor-pointer rounded-lg px-3 hover:bg-white/5 transition-colors",
          className
        )}
        onClick={(e) => {
          if (link.subItems) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        {...props}
      >
        {link.icon}

        <AnimatePresence>
          {(!animate || open) && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-neutral-200 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
            >
              {link.label}
            </motion.span>
          )}
        </AnimatePresence>

        {link.subItems && open && (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-auto"
          >
            <IconChevronDown className="h-4 w-4 text-neutral-400" />
          </motion.div>
        )}
      </a>

      {link.subItems && open && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="ml-6 mt-2 space-y-1 overflow-hidden"
            >
              <ul className="space-y-1">
                {link.subItems.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="block py-1 px-2 text-xs text-neutral-400 hover:text-neutral-200 transition-colors rounded hover:bg-white/5"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};