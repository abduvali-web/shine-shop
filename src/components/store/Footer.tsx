import styles from './Footer.module.css'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'

export default function Footer() {
    const t = useTranslations('Footer')
    const h = useTranslations('Header')

    const footerLinks = [
        { label: h('home'), href: '/' },
        { label: h('shop'), href: '/shop' },
        { label: h('buildYourOwn'), href: '/build-your-own' },
        { label: h('personalisedJewellery'), href: '/shop/personalised-jewellery' },
        { label: h('newArrivals'), href: '/shop/new-arrivals' },
        { label: h('contact'), href: '/pages/contact' },
    ]

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <div className={styles.logo}>
                            <span className={styles.logoText}>SUN KISSED YOU</span>
                        </div>
                        <p className={styles.description}>
                            {t('brandDescription')}
                        </p>
                    </div>

                    <div className={styles.column}>
                        <h4>{t('navigation')}</h4>
                        {footerLinks.map(link => (
                            <Link key={link.label} href={link.href}>{link.label}</Link>
                        ))}
                    </div>

                    <div className={styles.column}>
                        <h4>{t('customerCare')}</h4>
                        <Link href="/pages/faqs">{t('faqs')}</Link>
                        <Link href="/pages/shipping">{t('shipping')}</Link>
                        <Link href="/pages/contact">{t('contact')}</Link>
                        <Link href="/pages/about">{t('about')}</Link>
                    </div>

                    <div className={styles.column}>
                        <h4>{t('newsletter')}</h4>
                        <p>{t('newsletterSub')}</p>
                        <form className={styles.newsletter}>
                            <input type="email" placeholder="Enter your email" />
                            <button type="submit">{t('join')}</button>
                        </form>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>© 2026 SUN KISSED YOU. {t('rights')}</p>
                    <div className={styles.socials}>
                        <a href="#" aria-label="Instagram">INSTAGRAM</a>
                        <a href="#" aria-label="TikTok">TIKTOK</a>
                    </div>
                </div>
            </div>

            {/* Mobile Icon Bar */}
            <div className={styles.mobileBar}>
                <Link href="/" className={styles.mobileItem}>🏠<span>HOME</span></Link>
                <Link href="/shop" className={styles.mobileItem}>🛍️<span>SHOP</span></Link>
                <Link href="/build-your-own" className={styles.mobileItem}>🛠️<span>BUILD</span></Link>
                <Link href="/shop/personalised-jewellery" className={styles.mobileItem}>🎨<span>CARDS</span></Link>
                <Link href="/pages/contact" className={styles.mobileItem}>📞<span>CONTACT</span></Link>
            </div>
        </footer>
    )
}
