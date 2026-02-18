import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import ProductCard from '@/components/store/ProductCard'
import PopUp from '@/components/store/PopUp'
import styles from './page.module.css'
import { getTranslations } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations('HomePage')
  // Fetch data
  const [categories, products, settings] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.settings.findFirst()
  ])

  const newArrivals = products.filter(p => p.featured).slice(0, 4)
  const personalised = products.filter(p => p.categoryId === categories.find(c => c.slug === 'necklaces')?.id).slice(0, 4)
  const bestSellers = products.slice(0, 4)

  return (
    <>
      <PopUp />
      <Header categories={categories} />

      <main className={styles.main}>
        {/* Hero Section - Cinematic */}
        <section className={styles.hero}>
          <div className={styles.heroBackground}>
            <div className={styles.heroImage} style={{ backgroundImage: "url('/hero-luxury.png')" }} />
            <div className={styles.heroOverlay} />
          </div>
          <div className={styles.heroContent}>
            <div className={styles.heroTextWrapper}>
              <span className={styles.heroEyebrow}>{t('heroEyebrow')}</span>
              <h1 className={styles.heroTitle}>
                SUN KISSED YOU
              </h1>

              <div className={styles.heroCta}>
                <Link href="/shop" className={styles.btnPrimary}>
                  {t('exploreCollection')}
                </Link>
                <Link href="/shop/new-arrivals" className={styles.btnSecondary}>
                  {t('newArrivalsCta')}
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.heroScroll}>
            <span>{t('scroll')}</span>
            <div className={styles.scrollLine} />
          </div>
        </section>

        {/* Featured Collection Banner */}
        <section className={styles.featuredBanner}>
          <div className={styles.bannerContent}>
            <span className={styles.bannerLabel}>{t('featured')}</span>
            <h2 className={styles.bannerTitle}>{t('signatureCollection')}</h2>
            <p className={styles.bannerText}>{t('featuredText')}</p>
          </div>
        </section>

        {/* {t('newArrivalsTitle')} Section */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>{t('discover')}</span>
              <h2 className={styles.sectionTitle}>{t('newArrivalsTitle')}</h2>
              <div className={styles.sectionDivider} />
            </div>
            <div className={styles.productsGrid}>
              {newArrivals.map((product, index) => (
                <div key={product.id} className={styles.productWrapper} style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard
                    {...product}
                    category={product.category}
                  />
                </div>
              ))}
            </div>
            <div className={styles.centerBtn}>
              <Link href="/shop/new-arrivals" className={styles.viewAllBtn}>
                <span>{t('viewAll')}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Build Your Own - Split Section */}
        <section className={styles.splitSection}>
          <div className={styles.splitImage}>
            <div className={styles.splitImageInner} style={{ backgroundImage: "url('/build-your-own.png')" }} />
          </div>
          <div className={styles.splitContent}>
            <span className={styles.splitLabel}>{t('personalize')}</span>
            <h2 className={styles.splitTitle}>{t('createUniquePiece')}</h2>
            <p className={styles.splitText}>
              {t('createDescription')}
            </p>
            <ol className={styles.steps}>
              <li>
                <span className={styles.stepNumber}>01</span>
                <span>{t('step1')}</span>
              </li>
              <li>
                <span className={styles.stepNumber}>02</span>
                <span>{t('step2')}</span>
              </li>
              <li>
                <span className={styles.stepNumber}>03</span>
                <span>{t('step3')}</span>
              </li>
            </ol>
            <Link href="/build-your-own" className={styles.btnPrimary}>
              {t('startCreating')}
            </Link>
          </div>
        </section>

        {/* {t('personalisedJewelleryTitle')} */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>{t('bespoke')}</span>
              <h2 className={styles.sectionTitle}>{t('personalisedJewelleryTitle')}</h2>
              <div className={styles.sectionDivider} />
            </div>
            <div className={styles.productsGrid}>
              {personalised.map((product, index) => (
                <div key={product.id} className={styles.productWrapper} style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard
                    {...product}
                    category={product.category}
                  />
                </div>
              ))}
            </div>
            <div className={styles.centerBtn}>
              <Link href="/shop/personalised-jewellery" className={styles.viewAllBtn}>
                <span>{t('exploreMore')}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Brand Story Section */}
        <section className={styles.brandSection}>
          <div className={styles.brandContent}>
            <span className={styles.brandLabel}>{t('ourStory')}</span>
            <h2 className={styles.brandTitle}>SUN KISSED YOU</h2>
            <div className={styles.brandDivider} />
            <p className={styles.brandText}>
              {t('brandText1')}
            </p>
            <p className={styles.brandText}>
              {t('brandText2')}
            </p>
            <div className={styles.brandFeatures}>
              <div className={styles.brandFeature}>
                <span className={styles.featureIcon}>✦</span>
                <span>{t('feature1')}</span>
              </div>
              <div className={styles.brandFeature}>
                <span className={styles.featureIcon}>✦</span>
                <span>{t('feature2')}</span>
              </div>
              <div className={styles.brandFeature}>
                <span className={styles.featureIcon}>✦</span>
                <span>{t('feature3')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* {t('bestSellersTitle')} */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>{t('mostLoved')}</span>
              <h2 className={styles.sectionTitle}>{t('bestSellersTitle')}</h2>
              <div className={styles.sectionDivider} />
            </div>
            <div className={styles.productsGrid}>
              {bestSellers.map((product, index) => (
                <div key={product.id} className={styles.productWrapper} style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard
                    {...product}
                    category={product.category}
                  />
                </div>
              ))}
            </div>
            <div className={styles.centerBtn}>
              <Link href="/shop" className={styles.viewAllBtn}>
                <span>{t('shopAll')}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
