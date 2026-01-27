'use client'

import { useSession, signOut } from 'next-auth/react'
import { Link, useRouter } from '@/navigation'
import { useState, useEffect } from 'react'
import styles from './Account.module.css'
import { useTranslations } from 'next-intl'

export default function AccountPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [orders] = useState([])
    const t = useTranslations('Account')

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/account/login')
        }
    }, [status, router])

    if (status === 'loading') {
        return <div className={styles.loading}>{t('loading')}</div>
    }

    if (!session) return null

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>{t('title')}</h1>
                <button onClick={() => signOut()} className={styles.logoutBtn}>{t('logout')}</button>
            </header>

            <div className={styles.grid}>
                <section className={styles.profile}>
                    <h2>{t('details')}</h2>
                    <div className={styles.card}>
                        <p><strong>{t('name')}:</strong> {session.user.name}</p>
                        <p><strong>{t('email')}:</strong> {session.user.email}</p>
                        <p><strong>{t('status')}:</strong> {(session.user as { role?: string }).role === 'admin' ? t('admin') : t('customer')}</p>
                        {(session.user as { role?: string }).role === 'admin' && (
                            <Link href="/admin" className={styles.adminLink}>{t('adminPanel')}</Link>
                        )}
                    </div>
                </section>

                <section className={styles.orders}>
                    <h2>{t('orderHistory')}</h2>
                    <div className={styles.card}>
                        {orders.length > 0 ? (
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>{t('order')}</th>
                                        <th>{t('date')}</th>
                                        <th>{t('orderStatus')}</th>
                                        <th>{t('total')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Map orders here */}
                                </tbody>
                            </table>
                        ) : (
                            <div className={styles.empty}>
                                <p>{t('noOrders')}</p>
                                <Link href="/shop" className={styles.shopNow}>{t('startShopping')}</Link>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
