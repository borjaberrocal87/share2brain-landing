import { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  items: NavItem[];
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeMenu]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="mobile-menu-wrapper md:hidden">
      {/* Hamburger button */}
      <button
        onClick={toggleMenu}
        className="w-[38px] h-[38px] rounded-[10px] border flex items-center justify-center cursor-pointer transition-colors"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: isOpen ? 'var(--accent-soft)' : 'var(--surface)',
          color: isOpen ? 'var(--accent-ink)' : 'var(--text)',
        }}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? <X size={18} strokeWidth={1.9} /> : <Menu size={18} strokeWidth={1.9} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Menu panel */}
      <div
        id="mobile-menu"
        className="fixed top-[66px] right-0 z-50 w-[280px] max-h-[calc(100vh-66px)] overflow-y-auto"
        style={{
          backgroundColor: 'var(--surface)',
          borderBottomLeftRadius: 'var(--radius)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s ease',
        }}
        role="menu"
        aria-label="Mobile navigation"
      >
        <nav className="flex flex-col p-4 gap-1">
          {items.map((item, i) => (
            <a
              key={i}
              href={item.href}
              onClick={closeMenu}
              className="flex items-center gap-3 no-underline px-4 py-3 rounded-[calc(var(--radius)-2px)] text-[15px] font-medium transition-colors"
              style={{ color: 'var(--text)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              role="menuitem"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
