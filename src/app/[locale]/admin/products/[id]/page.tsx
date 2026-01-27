import ProductForm from '../ProductForm'

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params
    return <ProductForm productId={id} />
}
