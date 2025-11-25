import { redirect } from 'next/navigation'

export default function ProducersRedirect({ params }: { params: { id: string } }) {
  // Redirect /producers/[id] to /producer/[id] (singular)
  redirect(`/producer/${params.id}`)
}