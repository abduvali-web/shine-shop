'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './AdminDashboard.module.css'

interface AdminDashboardProps {
    stats: {
        products: number
        orders: number
        categories: number
        revenue: number
    }
    recentOrders: {
        id: string
        customerName: string
        total: number
        status: string
        createdAt: string | Date
    }[]
}

export default function AdminDashboard({ stats, recentOrders }: AdminDashboardProps) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated' || (session?.user as { role?: string })?.role !== 'admin') {
            router.push('/account/login')
        }
    }, [session, status, router])

    if (status === 'loading' || (session?.user as { role?: string })?.role !== 'admin') {
        return <div className={styles.loading}>Checking permissions...</div>
    }

    const navItems = [
        { label: 'Overview', icon: '📊', href: '/admin' },
        { label: 'Products', icon: '📦', href: '/admin/products' },
        { label: 'Categories', icon: '📁', href: '/admin/categories' },
        { label: 'Orders', icon: '🛒', href: '/admin/orders' },
        { label: 'Settings', icon: '⚙️', href: '/admin/settings' },
    ]

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2>SUN KISSED YOU</h2>
                    <span>Admin Panel</span>
                </div>
                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link key={item.label} href={item.href} className={styles.navItem}>
                            <span className={styles.navIcon}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1>Welcome back, {session?.user?.name}</h1>
                    <button onClick={() => router.push('/')} className={styles.viewSiteBtn}>
                        View Website
                    </button>
                </header>

                <section className={styles.stats}>
                    <div className={styles.statCard}>
                        <h3>Total Products</h3>
                        <p className={styles.statValue}>{stats.products}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Total Orders</h3>
                        <p className={styles.statValue}>{stats.orders}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Categories</h3>
                        <p className={styles.statValue}>{stats.categories}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Total Revenue</h3>
                        <p className={styles.statValue}>£{stats.revenue.toFixed(2)}</p>
                    </div>
                </section>

                <section className={styles.recentOrders}>
                    <div className={styles.sectionHeader}>
                        <h2>Recent Orders</h2>
                        <Link href="/admin/orders">View All</Link>
                    </div>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length > 0 ? recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td>#{order.id.slice(-6).toUpperCase()}</td>
                                        <td>{order.customerName}</td>
                                        <td>£{order.total.toFixed(2)}</td>
                                        <td>
                                            <span className={`${styles.status} ${styles[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className={styles.empty}>No orders found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className={styles.quickActions}>
                    <h2>Quick Actions</h2>
                    <div className={styles.actionGrid}>
                        <Link href="/admin/products/new" className={styles.actionCard}>
                            <span>➕</span>
                            Add New Product
                        </Link>
                        <Link href="/admin/categories" className={styles.actionCard}>
                            <span>📂</span>
                            Manage Categories
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    )
}
