import { prisma } from '@/lib/prisma'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import styles from './static-page.module.css'

export default async function StaticPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params
    const page = await prisma.page.findUnique({
        where: { slug }
    })

    if (!page) {
        return <div>Page not found</div>
    }

    const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } })

    return (
        <>
            <Header categories={categories} />
            <main className={styles.container}>
                <h1 className={styles.title}>{page.title}</h1>
                <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </main>
            <Footer />
        </>
    )
}

export async function generateStaticParams() {
    const locales = ['en', 'ru', 'uz'];
    const pages = await prisma.page.findMany()

    const params = [];
    for (const locale of locales) {
        for (const page of pages) {
            params.push({ locale, slug: page.slug });
        }
    }
    return params;
}
