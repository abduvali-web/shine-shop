import { prisma } from '@/lib/prisma'
import { Link } from '@/navigation'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import AddToCartButton from '@/components/store/AddToCartButton'
import styles from './product.module.css'

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params
    const product = await prisma.product.findUnique({
        where: { slug },
        include: { category: true }
    })

    if (!product) {
        return <div>Product not found</div>
    }

    const images = JSON.parse(product.images || '[]') as string[]
    const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } })

    return (
        <>
            <Header categories={categories} />
            <main className={styles.container}>
                {/* Breadcrumbs */}
                <nav className={styles.breadcrumbs}>
                    <Link href="/">Home</Link> /
                    <Link href={`/shop/${product.category.slug}`}>{product.category.name}</Link> /
                    <span>{product.name}</span>
                </nav>

                <div className={styles.grid}>
                    {/* Gallery */}
                    <div className={styles.gallery}>
                        {images.length > 0 ? images.map((img, i) => (
                            <img key={i} src={img} alt={`${product.name} ${i + 1}`} className={styles.mainImage} />
                        )) : (
                            <img src="/placeholder.jpg" alt="Placeholder" className={styles.mainImage} />
                        )}
                    </div>

                    {/* Details */}
                    <div className={styles.details}>
                        <h1 className={styles.title}>{product.name}</h1>
                        <p className={styles.price}>£{product.price.toFixed(2)}</p>

                        <div className={styles.description}>
                            <h3>Details</h3>
                            <p>{product.description}</p>
                        </div>

                        <AddToCartButton product={product} />

                        <div className={styles.extraInfo}>
                            <div className={styles.infoItem}>
                                <strong>✨ 18K Gold Plated</strong>
                            </div>
                            <div className={styles.infoItem}>
                                <strong>💧 Water Resistant</strong>
                            </div>
                            <div className={styles.infoItem}>
                                <strong>🚫 Tarnish Free</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

export async function generateStaticParams() {
    const locales = ['en', 'ru', 'uz'];
    const products = await prisma.product.findMany()

    const params = [];
    for (const locale of locales) {
        for (const product of products) {
            params.push({ locale, slug: product.slug });
        }
    }
    return params;
}
