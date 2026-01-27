import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/admin/login')
    }

    // Get stats
    const [productCount, orderCount, categoryCount] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.category.count()
    ])

    const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    })

    const totalRevenue = await prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'cancelled' } }
    })

    return (
        <AdminDashboard
            stats={{
                products: productCount,
                orders: orderCount,
                categories: categoryCount,
                revenue: totalRevenue._sum.total || 0
            }}
            recentOrders={recentOrders}
        />
    )
}
