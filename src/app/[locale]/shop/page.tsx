import { prisma } from '@/lib/prisma'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import ProductCard from '@/components/store/ProductCard'
import styles from './shop.module.css'
import { getTranslations } from 'next-intl/server'

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
    const { } = await params
    const t = await getTranslations('Shop')

    const [categories, products] = await Promise.all([
        prisma.category.findMany({ orderBy: { order: 'asc' } }),
        prisma.product.findMany({
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        })
    ])

    return (
        <>
            <Header categories={categories} />

            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1>{t('allProducts')}</h1>
                        <p>{products.length} {t('productsCount')}</p>
                    </div>

                    <div className={styles.productsGrid}>
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                {...product}
                                category={product.category}
                            />
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className={styles.empty}>
                            <p>{t('noProducts')}</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    )
}
