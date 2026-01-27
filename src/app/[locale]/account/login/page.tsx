'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Link, useRouter } from '@/navigation'
import styles from './auth.module.css'
import { useTranslations } from 'next-intl'

function LoginContent() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const [registered, setRegistered] = useState(false)
    const t = useTranslations('Auth')

    useEffect(() => {
        const flag = searchParams.get('registered')
        if (flag) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setRegistered(true)
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password
        })

        setLoading(false)

        if (result?.error) {
            setError(t('invalid'))
        } else {
            router.push('/account')
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.authBox}>
                <h1 className={styles.title}>{t('login')}</h1>
                <p className={styles.subtitle}>{t('loginSub')}</p>

                {registered && <p className={styles.success}>{t('regSuccess')}</p>}
                {error && <p className={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit} className={styles.form}>
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
                        {loading ? t('loggingIn') : t('login')}
                    </button>
                </form>

                <p className={styles.switch}>
                    {t('noAccount')} <Link href="/account/register">{t('createOne')}</Link>
                </p>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    )
}
