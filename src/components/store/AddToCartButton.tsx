'use client'

import { useState } from 'react'
import styles from './AddToCartButton.module.css'

interface Product {
    id: string
    name: string
    price: number
}

interface AddToCartButtonProps {
    product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const [added, setAdded] = useState(false)
    const [quantity, setQuantity] = useState(1)

    const handleAddToCart = () => {
        // Get current cart from localStorage
        const cartJson = localStorage.getItem('cart')
        const cart = cartJson ? JSON.parse(cartJson) : []

        // Check if product already in cart
        const existingIndex = cart.findIndex((item: { id: string }) => item.id === product.id)

        if (existingIndex >= 0) {
            cart[existingIndex].quantity += quantity
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity
            })
        }

        localStorage.setItem('cart', JSON.stringify(cart))
        setAdded(true)

        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.quantity}>
                <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={styles.qtyBtn}
                >
                    -
                </button>
                <span>{quantity}</span>
                <button
                    onClick={() => setQuantity(quantity + 1)}
                    className={styles.qtyBtn}
                >
                    +
                </button>
            </div>

            <button
                onClick={handleAddToCart}
                className={`${styles.addBtn} ${added ? styles.added : ''}`}
            >
                {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
        </div>
    )
}
