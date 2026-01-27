'use client'

import { useState } from 'react'
import { Link, useRouter } from '@/navigation'
import styles from './auth.module.css'
import { useTranslations } from 'next-intl'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const t = useTranslations('Auth')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name })
            })

            if (res.ok) {
                router.push('/account/login?registered=true')
            } else {
                const data = await res.json()
                setError(data.error || 'Registration failed')
            }
        } catch {
            setError('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.authBox}>
                <h1 className={styles.title}>{t('register')}</h1>
                <p className={styles.subtitle}>{t('registerSub')}</p>

                {error && <p className={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label>{t('name')}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label>{t('email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label>{t('password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className={styles.submitBtn}>
                        {loading ? t('creating') : t('register')}
                    </button>
                </form>

                <p className={styles.switch}>
                    {t('haveAccount')} <Link href="/account/login">{t('loginNow')}</Link>
                </p>
            </div>
        </div>
    )
}
