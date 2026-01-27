'use client'

import { useState, useEffect } from 'react'
import styles from './PopUp.module.css'
import { useTranslations } from 'next-intl'

export default function PopUp() {
    const [visible, setVisible] = useState(false)
    const t = useTranslations('PopUp')

    useEffect(() => {
        const closed = localStorage.getItem('signup-popup-closed')
        if (!closed) {
            const timer = setTimeout(() => setVisible(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleClose = () => {
        setVisible(false)
        localStorage.setItem('signup-popup-closed', 'true')
    }

    if (!visible) return null

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <button className={styles.closeBtn} onClick={handleClose}>✕</button>
                <div className={styles.content}>
                    <h2 className={styles.title}>{t('title')}</h2>
                    <p className={styles.text}>{t('text')}</p>
                    <p className={styles.subtext}>{t('subtext')}</p>
                    <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleClose(); }}>
                        <input type="email" placeholder="Enter your email" required />
                        <button type="submit">{t('subscribe')}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
