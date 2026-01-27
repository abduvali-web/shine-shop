'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './Products.module.css'

interface Product {
    id: string
    name: string
    price: number
    images: string
    category: { name: string }
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products')
            const data = await res.json()
            setProducts(data)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
        if (res.ok) {
            setProducts(products.filter(p => p.id !== id))
        }
    }

    if (loading) return <div className={styles.loading}>Loading products...</div>

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>Products</h1>
                    <p>Manage your collection of jewellery</p>
                </div>
                <Link href="/admin/products/new" className={styles.addBtn}>
                    + ADD PRODUCT
                </Link>
            </header>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <div className={styles.productCell}>
                                        <img
                                            src={JSON.parse(product.images || '[]')[0] || '/placeholder.jpg'}
                                            alt={product.name}
                                        />
                                        <span>{product.name}</span>
                                    </div>
                                </td>
                                <td>{product.category?.name}</td>
                                <td>£{product.price.toFixed(2)}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <button onClick={() => router.push(`/admin/products/${product.id}`)}>Edit</button>
                                        <button onClick={() => handleDelete(product.id)} className={styles.deleteBtn}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
