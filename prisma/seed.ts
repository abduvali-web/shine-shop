import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.admin.upsert({
        where: { email: 'admin@shine.shop' },
        update: {},
        create: {
            email: 'admin@shine.shop',
            password: hashedPassword,
            name: 'Admin'
        }
    })
    console.log('✅ Created admin:', admin.email)

    // Create categories
    const categories = [
        { name: 'Rings', slug: 'rings', order: 1 },
        { name: 'Necklaces', slug: 'necklaces', order: 2 },
        { name: 'Earrings', slug: 'earrings', order: 3 },
        { name: 'Bracelets', slug: 'bracelets', order: 4 },
        { name: 'Anklets', slug: 'anklets', order: 5 },
        { name: 'New Arrivals', slug: 'new-arrivals', order: 0 }
    ]

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat
        })
    }
    console.log('✅ Created categories')

    // Create sample products
    const ringsCategory = await prisma.category.findUnique({ where: { slug: 'rings' } })
    const necklacesCategory = await prisma.category.findUnique({ where: { slug: 'necklaces' } })
    const braceletsCategory = await prisma.category.findUnique({ where: { slug: 'bracelets' } })

    if (ringsCategory && necklacesCategory && braceletsCategory) {
        const products = [
            {
                name: 'Golden Hand Ring',
                slug: 'golden-hand-ring',
                description: '18K Gold Plated on Stainless Steel. Water Resistant and Tarnish Free.',
                price: 24.99,
                compareAt: 34.99,
                categoryId: ringsCategory.id,
                featured: true,
                sizes: JSON.stringify(['S', 'M', 'L'])
            },
            {
                name: 'Clover Bliss Ring',
                slug: 'clover-bliss-ring',
                description: 'Beautiful clover design. 18K Gold Plated on Stainless Steel.',
                price: 29.99,
                categoryId: ringsCategory.id,
                featured: true,
                sizes: JSON.stringify(['S', 'M', 'L'])
            },
            {
                name: 'Heart Letter Necklace',
                slug: 'heart-letter-necklace',
                description: 'Personalized heart letter necklace. 18K Gold Plated.',
                price: 39.99,
                categoryId: necklacesCategory.id,
                featured: true
            },
            {
                name: 'Snake Chain',
                slug: 'snake-chain',
                description: 'Elegant snake chain necklace. 18K Gold Plated on Stainless Steel.',
                price: 34.99,
                categoryId: necklacesCategory.id,
                featured: true
            },
            {
                name: 'Sparkle Love Bangle',
                slug: 'sparkle-love-bangle',
                description: 'Stunning bangle with sparkle design. 18K Gold Plated.',
                price: 44.99,
                compareAt: 59.99,
                categoryId: braceletsCategory.id,
                featured: true
            }
        ]

        for (const product of products) {
            await prisma.product.upsert({
                where: { slug: product.slug },
                update: {},
                create: product
            })
        }
        console.log('✅ Created sample products')
    }

    // Create default pages
    const pages = [
        {
            title: 'FAQs',
            slug: 'faqs',
            content: `<h2>Frequently Asked Questions</h2>
<h3>Do you ship worldwide?</h3>
<p>Yes, we ship to all countries. Shipping times vary by location.</p>
<h3>What is your return policy?</h3>
<p>We offer 30-day returns on all unworn items in original packaging.</p>
<h3>How do I know my ring size?</h3>
<p>Check our Size Guide page for detailed instructions.</p>`
        },
        {
            title: 'Shipping Policy',
            slug: 'shipping',
            content: `<h2>Shipping Policy</h2>
<p>Free shipping on orders over £100. Standard shipping fee is £5.</p>
<p>Orders are processed within 1-2 business days.</p>`
        },
        {
            title: 'Contact Us',
            slug: 'contact',
            content: `<h2>Contact Us</h2>
<p>Email: contact@shineshop.com</p>
<p>We aim to respond within 24 hours.</p>`
        },
        {
            title: 'About Us',
            slug: 'about',
            content: `<h2>About Shine Shop</h2>
<p>We offer beautiful 18K Gold Plated jewelry that is water resistant and tarnish free.</p>`
        }
    ]

    for (const page of pages) {
        await prisma.page.upsert({
            where: { slug: page.slug },
            update: {},
            create: page
        })
    }
    console.log('✅ Created default pages')

    // Create default settings
    await prisma.settings.upsert({
        where: { id: 'main' },
        update: {},
        create: {
            storeName: 'Shine Shop',
            storeEmail: 'contact@shineshop.com',
            currency: '£',
            shippingFee: 5.0,
            freeShipMin: 100.0,
            heroTitle: 'SHINE ON YOU',
            heroSubtitle: '18K Gold Plated Jewellery · Worldwide Shipping',
            footerText: '© 2024 Shine Shop. All rights reserved.'
        }
    })
    console.log('✅ Created settings')

    console.log('🎉 Seeding complete!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
