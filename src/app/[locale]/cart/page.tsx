'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/navigation'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import styles from './cart.module.css'
import { useTranslations } from 'next-intl'

interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
}

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(true)
    const t = useTranslations('Cart')

    useEffect(() => {
        const cartJson = localStorage.getItem('cart')
        if (cartJson) {
            const items = JSON.parse(cartJson)
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCart(items)
        }
        setLoading(false)
    }, [])

    const updateQuantity = (id: string, delta: number) => {
        const newCart = cart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta)
                return { ...item, quantity: newQty }
            }
            return item
        })
        setCart(newCart)
        localStorage.setItem('cart', JSON.stringify(newCart))
    }

    const removeItem = (id: string) => {
        const newCart = cart.filter(item => item.id !== id)
        setCart(newCart)
        localStorage.setItem('cart', JSON.stringify(newCart))
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= 100 ? 0 : 5
    const total = subtotal + shipping

    if (loading) {
        return null
    }

    return (
        <>
            <Header categories={[]} />

            <main className={styles.main}>
                <div className={styles.container}>
                    <h1 className={styles.title}>{t('title')}</h1>

                    {cart.length === 0 ? (
                        <div className={styles.empty}>
                            <span className={styles.emptyIcon}>🛒</span>
                            <h2>{t('empty')}</h2>
                            <p>{t('emptySub')}</p>
                            <Link href="/shop" className={styles.shopBtn}>
                                {t('continueShopping')}
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.cartGrid}>
                            <div className={styles.items}>
                                {cart.map(item => (
                                    <div key={item.id} className={styles.item}>
                                        <div className={styles.itemImage}>
                                            <span>✦</span>
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <h3>{item.name}</h3>
                                            <p className={styles.itemPrice}>£{item.price.toFixed(2)}</p>
                                        </div>
                                        <div className={styles.itemQuantity}>
                                            <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                        </div>
                                        <div className={styles.itemTotal}>
                                            £{(item.price * item.quantity).toFixed(2)}
                                        </div>
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => removeItem(item.id)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.summary}>
                                <h2>{t('orderSummary')}</h2>
                                <div className={styles.summaryRow}>
                                    <span>{t('subtotal')}</span>
                                    <span>£{subtotal.toFixed(2)}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>{t('shipping')}</span>
                                    <span>{shipping === 0 ? t('free') : `£${shipping.toFixed(2)}`}</span>
                                </div>
                                {subtotal < 100 && (
                                    <p className={styles.freeShipping}>
                                        {t('freeShippingPromo', { amount: `£${(100 - subtotal).toFixed(2)}` })}
                                    </p>
                                )}
                                <div className={`${styles.summaryRow} ${styles.total}`}>
                                    <span>{t('total')}</span>
                                    <span>£{total.toFixed(2)}</span>
                                </div>
                                <Link href="/checkout" className={styles.checkoutBtn}>
                                    {t('checkout')}
                                </Link>
                                <Link href="/shop" className={styles.continueBtn}>
                                    {t('continueShopping')}
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    )
}
