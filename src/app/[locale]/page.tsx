import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import ProductCard from '@/components/store/ProductCard'
import PopUp from '@/components/store/PopUp'
import styles from './page.module.css'

export default async function HomePage() {
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

      <main>
        {/* Section 1: Hero / Greeting Message Background */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            {/* Branding text removed per user request */}
            <div className={styles.shopNameContainer}>
              <span className={styles.shopName}>SUN KISSED YOU</span>
            </div>
          </div>
          <div className={styles.heroBg}></div>
        </section>

        {/* Section 2: New Arrivals */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>NEW ARRIVALS</h2>
            <div className={styles.productsGrid}>
              {newArrivals.map(product => (
                <ProductCard
                  key={product.id}
                  {...product}
                  category={product.category}
                />
              ))}
            </div>
            <div className={styles.centerBtn}>
              <Link href="/shop/new-arrivals" className={styles.viewAllBtn}>
                VIEW ALL PRODUCTS
              </Link>
            </div>
          </div>
        </section>

        {/* Section 3: Build Your Own */}
        <section className={styles.splitSection}>
          <div className={styles.splitImage} style={{ backgroundImage: "url('/placeholder-build.jpg')" }}></div>
          <div className={styles.splitContent}>
            <h2 className={styles.splitTitle}>CREATE YOUR OWN UNIQUE NECKLACE BY CHOOSING YOUR FAVOURITE CHAIN AND CHARMS!</h2>
            <h3 className={styles.splitSub}>HOW IT WORKS:</h3>
            <ol className={styles.steps}>
              <li>Start by selecting a chain in the length and color (silver or gold) you prefer, and add it to your cart.</li>
              <li>Then, browse and choose the charms you love. Add each charm to your cart as well.</li>
              <li>If you&apos;d like to leave a note (for example, special instructions), you can do so at checkout in the &quot;Note to Seller&quot; section.</li>
            </ol>
            <p className={styles.tip}>
              <strong>Our tip:</strong> For a full and balanced look, we recommend choosing between 5 and 11 charms. We will arrange them beautifully based on their size and shape for the best result. Have fun designing your necklace!
            </p>
            <Link href="/build-your-own" className={styles.shopNowLink}>SHOP NOW</Link>
          </div>
        </section>

        {/* Section 4: Personalised Jewellery */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>PERSONALISED JEWELLERY</h2>
            <div className={styles.productsGrid}>
              {personalised.map(product => (
                <ProductCard
                  key={product.id}
                  {...product}
                  category={product.category}
                />
              ))}
            </div>
            <div className={styles.centerBtn}>
              <Link href="/shop/personalised-jewellery" className={styles.viewAllBtn}>
                VIEW ALL PRODUCTS
              </Link>
            </div>
          </div>
        </section>

        {/* Section 5: Original Designs by me */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Original Designs by me</h2>
            <div className={styles.galleryPlaceholder}>
              <div className={styles.galleryItem}></div>
              <div className={styles.galleryItem}></div>
              <div className={styles.galleryItem}></div>
              <div className={styles.galleryItem}></div>
            </div>
            <div className={styles.centerBtn}>
              <Link href="/shop" className={styles.viewAllBtn}>
                VIEW ALL PRODUCTS
              </Link>
            </div>
          </div>
        </section>

        {/* Section 6: Overview about shop */}
        <section className={styles.aboutSection}>
          <div className={styles.containerNarrow}>
            <h2 className={styles.aboutTitle}>SUN KISSED YOU</h2>
            <p className={styles.aboutText}>
              is a high quality jewellery brand that strives to provide its customers with pieces that foster self-love and self-confidence while fitting into their daily lives.
            </p>
            <p className={styles.aboutText}>
              All our pieces are made with 18K Gold Plated on Stainless Steel which makes them Water Resistant and Tarnish Free.
            </p>
            <p className={styles.aboutText}>
              SUN KISSED YOU started by small business owner and born for the need for fashionable, quality yet affordable jewellery!
            </p>
          </div>
        </section>

        {/* Section 7: Best Seller */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>BEST SELLER</h2>
            <div className={styles.productsGrid}>
              {bestSellers.map(product => (
                <ProductCard
                  key={product.id}
                  {...product}
                  category={product.category}
                />
              ))}
            </div>
            <div className={styles.centerBtn}>
              <Link href="/shop" className={styles.viewAllBtn}>
                VIEW ALL PRODUCTS
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
