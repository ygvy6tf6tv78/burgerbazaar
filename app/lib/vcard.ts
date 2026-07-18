export interface VCardData {
  name: string
  organization: string
  title?: string
  phones: string[]
  email?: string
  address: string
  website: string
  note?: string
}

function escapeVCardValue(value: string): string {
  return value.replace(/[\\;,\n]/g, (c) => (c === '\n' ? '\\n' : `\\${c}`))
}

export function generateVCard(data: VCardData): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:;${escapeVCardValue(data.name)};;;`,
    `FN:${escapeVCardValue(data.name)}`,
    `ORG:${escapeVCardValue(data.organization)}`,
  ]

  if (data.title) {
    lines.push(`TITLE:${escapeVCardValue(data.title)}`)
  }

  data.phones.forEach((phone, index) => {
    const type = index === 0 ? 'WORK,CELL' : 'VOICE'
    const cleaned = phone.replace(/\D/g, '')
    lines.push(`TEL;TYPE=${type}:+91${cleaned}`)
  })

  if (data.email && data.email.trim()) {
    lines.push(`EMAIL;TYPE=INTERNET:${data.email}`)
  }
  lines.push(`ADR;TYPE=WORK:;;${escapeVCardValue(data.address.replace(/,/g, ';'))};;`)
  lines.push(`URL:${data.website}`)

  if (data.note) {
    lines.push(`NOTE:${escapeVCardValue(data.note)}`)
  }

  lines.push('END:VCARD')

  return lines.join('\r\n')
}

export function downloadVCard(vcard: string, filename: string): void {
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
