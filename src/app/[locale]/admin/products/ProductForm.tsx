'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Products.module.css'

interface ProductFormProps {
    productId?: string
}

export default function ProductForm({ productId }: ProductFormProps) {
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([])
    const [loading, setLoading] = useState(productId ? true : false)
    const [submitting, setSubmitting] = useState(false)
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        compareAt: '',
        images: [] as string[],
        categoryId: '',
        featured: false,
        inStock: true
    })

    useEffect(() => {
        fetch('/api/categories').then(res => res.json()).then(setCategories)

        if (productId) {
            fetch(`/api/products/${productId}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        ...data,
                        images: JSON.parse(data.images || '[]'),
                        price: data.price.toString(),
                        compareAt: data.compareAt?.toString() || ''
                    })
                    setLoading(false)
                })
        }
    }, [productId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        const method = productId ? 'PUT' : 'POST'
        const url = productId ? `/api/products/${productId}` : '/api/products'

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })

        if (res.ok) {
            router.push('/admin/products')
        } else {
            alert('Failed to save product')
            setSubmitting(false)
        }
    }

    const addImage = () => {
        const url = prompt('Enter Image URL:')
        if (url) {
            setFormData({ ...formData, images: [...formData.images, url] })
        }
    }

    const removeImage = (index: number) => {
        const newImages = [...formData.images]
        newImages.splice(index, 1)
        setFormData({ ...formData, images: newImages })
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className={styles.container}>
            <h1>{productId ? 'Edit Product' : 'Add New Product'}</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.mainGrid}>
                    <div className={styles.formSection}>
                        <div className={styles.field}>
                            <label>Product Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows={5}
                                required
                            />
                        </div>

                        <div className={styles.priceGrid}>
                            <div className={styles.field}>
                                <label>Price (£)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Compare At Price (£)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.compareAt}
                                    onChange={e => setFormData({ ...formData, compareAt: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.sideSection}>
                        <div className={styles.field}>
                            <label>Category</label>
                            <select
                                value={formData.categoryId}
                                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label>Images</label>
                            <div className={styles.imageGrid}>
                                {formData.images.map((img, i) => (
                                    <div key={i} className={styles.imageThumb}>
                                        <img src={img} alt="" />
                                        <button type="button" onClick={() => removeImage(i)}>✕</button>
                                    </div>
                                ))}
                                <button type="button" className={styles.addImgBtn} onClick={addImage}>+</button>
                            </div>
                            <p className={styles.help}>First image is main, second is hover.</p>
                        </div>

                        <div className={styles.checkboxes}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                                />
                                Show on Homepage
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.inStock}
                                    onChange={e => setFormData({ ...formData, inStock: e.target.checked })}
                                />
                                In Stock
                            </label>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="submit" disabled={submitting} className={styles.saveBtn}>
                        {submitting ? 'SAVING...' : 'SAVE PRODUCT'}
                    </button>
                    <button type="button" onClick={() => router.back()}>Cancel</button>
                </div>
            </form>
        </div>
    )
}
