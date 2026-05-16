import { BridgeDetailPage } from '@/views/bridge/BridgeDetailPage'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <BridgeDetailPage id={id} />
}
