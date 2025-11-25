import { redirect } from 'next/navigation'

export default function BeatsRedirect({ params }: { params: { id: string } }) {
  // Redirect /beats/[id] to /beat/[id] (singular)
  redirect(`/beat/${params.id}`)
}