'use client'

import { useState } from 'react'
import styles from './Header.module.css'
import { Link, usePathname, useRouter } from '@/navigation'
import { useTranslations, useLocale } from 'next-intl'

interface Category {
    id: string
    name: string
    slug: string
}

interface HeaderProps {
    categories: Category[]
}

export default function Header({ categories }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const t = useTranslations('Header')
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const navItems = [
        { label: 'HOME', href: '/' },
        { label: 'SHOP', href: '/shop' },
        { label: 'BUILD YOUR OWN', href: '/build-your-own' },
        { label: 'PERSONALISED JEWELLERY', href: '/shop/personalised-jewellery' },
        { label: 'NEW ARRIVALS', href: '/shop/new-arrivals' },
        { label: 'CONTACT US', href: '/pages/contact' },
    ]

    const handleLanguageChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale })
    }

    return (
        <header className={styles.header}>
            <div className={styles.topBar}>
                <p>✨ Free shipping on orders over £100 ✨</p>
                <div className={styles.langSelector}>
                    <span className={styles.langLabel}>Language:</span>
                    <button onClick={() => handleLanguageChange('en')} className={locale === 'en' ? styles.activeLang : ''}>English</button>
                    <button onClick={() => handleLanguageChange('ru')} className={locale === 'ru' ? styles.activeLang : ''}>Russian</button>
                    <button onClick={() => handleLanguageChange('uz')} className={locale === 'uz' ? styles.activeLang : ''}>Uzbek</button>
                </div>
            </div>

            <nav className={styles.nav}>
                <button
                    className={styles.menuBtn}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <Link href="/" className={styles.logo}>
                    <div className={styles.logoContent}>
                        <span className={styles.logoText}>SUN KISSED YOU</span>
                        <span className={styles.logoSubtext}>JEWELLERY</span>
                    </div>
                </Link>

                <ul className={`${styles.navLinks} ${mobileMenuOpen ? styles.open : ''}`}>
                    {navItems.map((item) => (
                        <li key={item.label}>
                            <Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className={styles.actions}>
                    <Link href="/account" className={styles.actionIcon} aria-label="Account">
                        👤
                    </Link>
                    <Link href="/search" className={styles.actionIcon} aria-label="Search">
                        🔍
                    </Link>
                    <Link href="/cart" className={styles.cartBtn}>
                        🛒
                    </Link>
                </div>
            </nav>

            {mobileMenuOpen && (
                <div className={styles.mobileMenu}>
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    )
}
